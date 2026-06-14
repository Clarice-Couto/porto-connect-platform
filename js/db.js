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
  clearOldData() {
    const oldKeys = ['usuarios_aluno', 'usuarios_empresa', 'perfilAluno', 'perfilEmpresa'];
    oldKeys.forEach(k => localStorage.removeItem(k));
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('vagas_') || key.startsWith('favoritos_') || key.startsWith('projetos_') || key.startsWith('candidaturas_')) {
        localStorage.removeItem(key);
      }
    });
  }
};

if (!localStorage.getItem('porto_connect_cleaned')) {
  localStore.clearOldData();
  localStorage.setItem('porto_connect_cleaned', 'true');
}

const cacheSession = (key, profile) => {
  localStore.set(key, profile);
};

let useRemoteApi = null;

const shouldUseRemoteApi = () => {
  if (useRemoteApi !== null) return useRemoteApi;
  const host = window.location.hostname;
  const urlParams = new URLSearchParams(window.location.search);
  const forceApi = urlParams.get('api') === 'true';
  useRemoteApi = (host !== 'localhost' && host !== '127.0.0.1') || forceApi;
  return useRemoteApi;
};

async function apiCall(op, payload = {}) {
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
        if (['signInStudent', 'signInCompany'].includes(op)) {
          const key = op.includes('Student') ? 'aluno_logado' : 'empresa_logado';
          cacheSession(key, result.data);
        }
      }
      return result;
    } catch (error) {
      console.error('API Error:', error.message);
      return { data: null, error: { message: 'Serviço indisponível.' } };
    }
  }
  console.warn('Modo LOCAL desativado para dados compartilhados.');
  return { data: null, error: { message: 'Use o ambiente de produção ou ?api=true' } };
}

const db = {
  ready: Promise.resolve(),

  // Algoritmo de Match Inteligente
  calculateMatch(requiredSkillsStr, studentSkillsStr) {
    if (!requiredSkillsStr || !studentSkillsStr) return 0;
    
    const required = requiredSkillsStr.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
    const student = studentSkillsStr.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
    
    if (required.length === 0) return 100;
    
    let matches = 0;
    required.forEach(req => {
      // Partial matching (ex: "Java" matches "Javascript") - mas aqui faremos exato para ser mais justo
      if (student.some(s => s === req || s.includes(req) || req.includes(s))) {
        matches++;
      }
    });
    
    return Math.round((matches / required.length) * 100);
  },

  async signUpStudent(payload) { return callDb('signUpStudent', payload); },
  async signInStudent(email, password) { return callDb('signInStudent', { email, password }); },
  async signUpCompany(payload) { return callDb('signUpCompany', payload); },
  async signInCompany(email, password) { return callDb('signInCompany', { email, password }); },

  async signOut() {
    localStore.remove('aluno_logado');
    localStore.remove('empresa_logado');
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

  async getAllStudents() {
    const result = await callDb('getAllStudents');
    return result.data || [];
  },

  async updateStudentProfile(profile) { 
    const res = await callDb('updateStudentProfile', profile);
    if (res.data) cacheSession('aluno_logado', res.data);
    return res;
  },

  async updateCompanyProfile(profile) { 
    const res = await callDb('updateCompanyProfile', profile);
    if (res.data) cacheSession('empresa_logado', res.data);
    return res;
  },

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

  async normalizeStudentApplications(emailAluno) {
    return this.getApplicationsByStudent(emailAluno);
  },

  async getStudentByEmail(email) {
    return this.getStudentProfileByEmail(email);
  },

  usesRemoteApi: shouldUseRemoteApi,
};

window.db = db;
