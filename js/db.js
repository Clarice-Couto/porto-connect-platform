const localStore = {
  get(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || 'null');
    } catch (error) {
      return null;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(key);
  },
};

const cacheStudentProfile = (profile) => {
  localStore.set('aluno_logado', profile);
  localStore.set('perfilAluno', profile);
};

const cacheCompanyProfile = (profile) => {
  localStore.set('empresa_logado', profile);
  localStore.set('perfilEmpresa', profile);
};

let useRemoteApi = null;

const shouldUseRemoteApi = () => {
  if (useRemoteApi !== null) return useRemoteApi;
  const host = window.location.hostname;
  // Use API se não estiver em localhost, ou se for explicitamente solicitado via query param ?api=true
  const urlParams = new URLSearchParams(window.location.search);
  const forceApi = urlParams.get('api') === 'true';
  useRemoteApi = (host !== 'localhost' && host !== '127.0.0.1') || forceApi;
  return useRemoteApi;
};

async function apiCall(op, payload = {}) {
  // Ajuste o path se necessário dependendo de onde o frontend está em relação à API
  // No Vercel, /api/db funciona se a pasta api/ estiver na raiz
  const response = await fetch('/api/db', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ op, payload }),
  });
  
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error?.message || 'Erro ao acessar o banco de dados');
  }
  return result;
}

async function callDb(op, payload = {}) {
  if (shouldUseRemoteApi()) {
    try {
      const result = await apiCall(op, payload);
      if (!result.error && result.data) {
        // Cache de sessão local
        if (['signUpStudent', 'signInStudent', 'updateStudentProfile'].includes(op)) cacheStudentProfile(result.data);
        if (['signUpCompany', 'signInCompany', 'updateCompanyProfile'].includes(op)) cacheCompanyProfile(result.data);
      }
      return result;
    } catch (error) {
      console.error('API Error:', error.message);
      // Se a API falhar no Vercel, não temos fallback local para dados compartilhados
      return { data: null, error: { message: 'Serviço de banco de dados temporariamente indisponível.' } };
    }
  }
  
  // Mensagem informativa para desenvolvimento local
  console.warn('Rodando em modo LOCAL (localStorage). Use ?api=true na URL para conectar ao banco compartilhado.');
  return { data: null, error: { message: 'Banco de dados remoto não disponível em localhost sem ?api=true' } };
}

const db = {
  ready: Promise.resolve(),

  async signUpStudent(payload) { return callDb('signUpStudent', payload); },
  async signInStudent(email, password) { return callDb('signInStudent', { email, password }); },
  async signUpCompany(payload) { return callDb('signUpCompany', payload); },
  async signInCompany(email, password) { return callDb('signInCompany', { email, password }); },

  async signOut() {
    localStore.remove('aluno_logado');
    localStore.remove('empresa_logado');
    localStore.remove('perfilAluno');
    localStore.remove('perfilEmpresa');
    return true;
  },

  getCurrentStudent() { return localStore.get('aluno_logado'); },
  getCurrentCompany() { return localStore.get('empresa_logado'); },

  async getStudentProfileByEmail(email) {
    const result = await callDb('getStudentProfileByEmail', { email });
    return result.data;
  },

  async getCompanyProfileByEmail(email) {
    const result = await callDb('getCompanyProfileByEmail', { email });
    return result.data;
  },

  async updateStudentProfile(profile) { return callDb('updateStudentProfile', profile); },
  async updateCompanyProfile(profile) { return callDb('updateCompanyProfile', profile); },

  async getCompanyVacancies(companyEmail) {
    const result = await callDb('getCompanyVacancies', { companyEmail });
    return result.data || [];
  },

  async getAllCompanyVacancies() {
    const result = await callDb('getAllCompanyVacancies');
    return result.data || [];
  },

  async addCompanyVacancy(companyEmail, vacancy) {
    const company = this.getCurrentCompany();
    return callDb('addCompanyVacancy', {
      companyEmail,
      vacancy,
      companyName: company?.nome || '',
    });
  },

  async updateCompanyVacancy(companyEmail, vacancyId, vacancy) {
    return callDb('updateCompanyVacancy', { companyEmail, vacancyId, vacancy });
  },

  async getStudentFavorites(studentEmail) {
    const result = await callDb('getStudentFavorites', { studentEmail });
    return result.data || [];
  },

  async addStudentFavorite(studentEmail, favorite) {
    return callDb('addStudentFavorite', { studentEmail, favorite });
  },

  async removeStudentFavorite(studentEmail, vacancyTitle, companyName) {
    return callDb('removeStudentFavorite', { studentEmail, vacancyTitle, companyName });
  },

  async getStudentProjects(studentEmail) {
    const result = await callDb('getStudentProjects', { studentEmail });
    return result.data || [];
  },

  async saveStudentProject(studentEmail, project) {
    return callDb('saveStudentProject', { studentEmail, project });
  },

  async deleteStudentProject(studentEmail, projectId) {
    return callDb('deleteStudentProject', { studentEmail, projectId });
  },

  async applyToVacancy(application) {
    return callDb('applyToVacancy', { application });
  },

  async getApplicationsByStudent(emailAluno) {
    const result = await callDb('getApplicationsByStudent', { emailAluno });
    return result.data || [];
  },

  async getApplicationsByCompany(companyEmail) {
    const result = await callDb('getApplicationsByCompany', { companyEmail });
    return result.data || [];
  },

  async updateApplicationStatus(emailAluno, titulo, novoStatus, companyEmail) {
    return callDb('updateApplicationStatus', { emailAluno, titulo, novoStatus, companyEmail });
  },

  usesRemoteApi: shouldUseRemoteApi,
};

window.db = db;
