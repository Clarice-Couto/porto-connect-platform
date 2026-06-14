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

const mapVacancy = (vacancy) => ({
  ...vacancy,
  empresa: vacancy.empresa || vacancy.company_name || '',
});

const mapFavorite = (favorite) => ({
  ...favorite,
  titulo: favorite.titulo || favorite.vacancy_title || '',
  empresa: favorite.empresa || favorite.company_name || '',
  area: favorite.area || favorite.categoria || '',
  tipo: favorite.tipo || '',
});

const mapApplication = (application) => ({
  titulo: application.titulo || application.vacancy_title || '',
  empresa: application.empresa || application.company_name || application.company_email || '',
  emailAluno: application.emailAluno || application.student_email || '',
  status: application.status || 'Pendente',
  data: application.data || (application.created_at ? new Date(application.created_at).toLocaleDateString('pt-BR') : ''),
  diasAtras: application.diasAtras || 0,
  msgExtra: application.msgExtra || application.extra_message || '',
  company_email: application.company_email || '',
});

let useRemoteApi = null;

const shouldUseRemoteApi = () => {
  if (useRemoteApi !== null) return useRemoteApi;
  const host = window.location.hostname;
  useRemoteApi = host !== 'localhost' && host !== '127.0.0.1';
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

function runLocalOperation(op, payload = {}) {
  switch (op) {
    case 'signUpStudent': {
      const { nome, email, password, cidade = '', sobre = '', skills = '' } = payload;
      const usuarios = localStore.get('usuarios_aluno') || [];
      if (usuarios.some((user) => user.email === email)) {
        return { data: null, error: { message: 'Este e-mail já está cadastrado!' } };
      }
      const profile = { id: crypto.randomUUID(), nome, email, senha: password, cidade, sobre, skills, role: 'student' };
      usuarios.push(profile);
      localStore.set('usuarios_aluno', usuarios);
      cacheStudentProfile(profile);
      return { data: profile, error: null };
    }
    case 'signInStudent': {
      const usuarios = localStore.get('usuarios_aluno') || [];
      const user = usuarios.find((item) => item.email === payload.email && item.senha === payload.password);
      if (!user) return { data: null, error: { message: 'E-mail ou senha incorretos!' } };
      cacheStudentProfile(user);
      return { data: user, error: null };
    }
    case 'signUpCompany': {
      const { nome, email, password, cidade = '', sobre = '' } = payload;
      const usuarios = localStore.get('usuarios_empresa') || [];
      if (usuarios.some((user) => user.email === email)) {
        return { data: null, error: { message: 'Este e-mail corporativo já está cadastrado!' } };
      }
      const profile = { id: crypto.randomUUID(), nome, email, senha: password, cidade, sobre, role: 'company' };
      usuarios.push(profile);
      localStore.set('usuarios_empresa', usuarios);
      cacheCompanyProfile(profile);
      return { data: profile, error: null };
    }
    case 'signInCompany': {
      const usuarios = localStore.get('usuarios_empresa') || [];
      const user = usuarios.find((item) => item.email === payload.email && item.senha === payload.password);
      if (!user) return { data: null, error: { message: 'E-mail corporativo ou senha incorretos!' } };
      cacheCompanyProfile(user);
      return { data: user, error: null };
    }
    case 'getStudentProfileByEmail': {
      const usuarios = localStore.get('usuarios_aluno') || [];
      return { data: usuarios.find((user) => user.email === payload.email) || null, error: null };
    }
    case 'getCompanyProfileByEmail': {
      const usuarios = localStore.get('usuarios_empresa') || [];
      return { data: usuarios.find((user) => user.email === payload.email) || null, error: null };
    }
    case 'updateStudentProfile': {
      const usuarios = localStore.get('usuarios_aluno') || [];
      const idx = usuarios.findIndex((user) => user.email === payload.email);
      if (idx < 0) return { data: null, error: { message: 'Aluno não encontrado' } };
      usuarios[idx] = { ...usuarios[idx], ...payload };
      localStore.set('usuarios_aluno', usuarios);
      cacheStudentProfile(usuarios[idx]);
      return { data: usuarios[idx], error: null };
    }
    case 'updateCompanyProfile': {
      const usuarios = localStore.get('usuarios_empresa') || [];
      const idx = usuarios.findIndex((user) => user.email === payload.email);
      if (idx < 0) return { data: null, error: { message: 'Empresa não encontrada' } };
      usuarios[idx] = { ...usuarios[idx], ...payload };
      localStore.set('usuarios_empresa', usuarios);
      cacheCompanyProfile(usuarios[idx]);
      return { data: usuarios[idx], error: null };
    }
    case 'getCompanyVacancies': {
      const data = (localStore.get(`vagas_${payload.companyEmail}`) || []).map(mapVacancy);
      return { data, error: null };
    }
    case 'getAllCompanyVacancies': {
      const data = Object.keys(localStorage)
        .filter((key) => key.startsWith('vagas_'))
        .flatMap((key) => JSON.parse(localStorage.getItem(key) || '[]'))
        .map(mapVacancy);
      return { data, error: null };
    }
    case 'addCompanyVacancy': {
      const vagasKey = `vagas_${payload.companyEmail}`;
      const vagas = localStore.get(vagasKey) || [];
      const record = {
        ...payload.vacancy,
        id: payload.vacancy.id || crypto.randomUUID(),
        company_email: payload.companyEmail,
        company_name: payload.vacancy.empresa || payload.vacancy.company_name || payload.companyName || '',
        status: payload.vacancy.status || 'Ativa',
        created_at: new Date().toISOString(),
      };
      vagas.push(record);
      localStore.set(vagasKey, vagas);
      return { data: mapVacancy(record), error: null };
    }
    case 'updateCompanyVacancy': {
      const vagasKey = `vagas_${payload.companyEmail}`;
      const vagas = localStore.get(vagasKey) || [];
      const idx = vagas.findIndex((job) => job.id === payload.vacancyId);
      if (idx < 0) return { data: null, error: { message: 'Vaga não encontrada' } };
      vagas[idx] = { ...vagas[idx], ...payload.vacancy };
      localStore.set(vagasKey, vagas);
      return { data: mapVacancy(vagas[idx]), error: null };
    }
    case 'getStudentFavorites': {
      const data = (localStore.get(`favoritos_${payload.studentEmail}`) || []).map(mapFavorite);
      return { data, error: null };
    }
    case 'addStudentFavorite': {
      const favoritosKey = `favoritos_${payload.studentEmail}`;
      const favoritos = localStore.get(favoritosKey) || [];
      const record = mapFavorite({
        id: payload.favorite.id || crypto.randomUUID(),
        titulo: payload.favorite.titulo,
        empresa: payload.favorite.empresa,
        company_email: payload.favorite.company_email || '',
        categoria: payload.favorite.area || payload.favorite.categoria || '',
        tipo: payload.favorite.tipo || '',
        created_at: new Date().toISOString(),
      });
      favoritos.push(record);
      localStore.set(favoritosKey, favoritos);
      return { data: record, error: null };
    }
    case 'removeStudentFavorite': {
      const favoritosKey = `favoritos_${payload.studentEmail}`;
      const favoritos = (localStore.get(favoritosKey) || []).filter(
        (fav) => !(fav.titulo === payload.vacancyTitle && fav.empresa === payload.companyName)
      );
      localStore.set(favoritosKey, favoritos);
      return { data: favoritos, error: null };
    }
    case 'getStudentProjects': {
      return { data: localStore.get(`projetos_${payload.studentEmail}`) || [], error: null };
    }
    case 'saveStudentProject': {
      const projetosKey = `projetos_${payload.studentEmail}`;
      const projetos = localStore.get(projetosKey) || [];
      const projectId = payload.project.id || crypto.randomUUID();
      const idx = projetos.findIndex((item) => String(item.id) === String(projectId));
      const record = { ...payload.project, id: projectId, student_email: payload.studentEmail };
      if (idx >= 0) projetos[idx] = record;
      else projetos.push(record);
      localStore.set(projetosKey, projetos);
      return { data: record, error: null };
    }
    case 'deleteStudentProject': {
      const projetosKey = `projetos_${payload.studentEmail}`;
      const projetos = (localStore.get(projetosKey) || []).filter(
        (item) => String(item.id) !== String(payload.projectId)
      );
      localStore.set(projetosKey, projetos);
      return { data: projetos, error: null };
    }
    case 'applyToVacancy': {
      const candidaturasKey = `candidaturas_${payload.application.emailAluno}`;
      const candidaturas = localStore.get(candidaturasKey) || [];
      const record = mapApplication({
        ...payload.application,
        id: crypto.randomUUID(),
        student_email: payload.application.emailAluno,
        company_email: payload.application.company_email || '',
        company_name: payload.application.empresa || '',
        vacancy_title: payload.application.titulo,
        created_at: new Date().toISOString(),
      });
      candidaturas.push(record);
      localStore.set(candidaturasKey, candidaturas);
      return { data: record, error: null };
    }
    case 'getApplicationsByStudent': {
      const data = Object.keys(localStorage)
        .filter((key) => key.startsWith('candidaturas_'))
        .flatMap((key) => JSON.parse(localStorage.getItem(key) || '[]'))
        .filter((app) => app.emailAluno === payload.emailAluno || app.student_email === payload.emailAluno)
        .map(mapApplication);
      return { data, error: null };
    }
    case 'getApplicationsByCompany': {
      const data = Object.keys(localStorage)
        .filter((key) => key.startsWith('candidaturas_'))
        .flatMap((key) => JSON.parse(localStorage.getItem(key) || '[]'))
        .filter(
          (app) =>
            app.company_email === payload.companyEmail ||
            app.empresa === payload.companyEmail ||
            app.empresa_email === payload.companyEmail
        )
        .map(mapApplication);
      return { data, error: null };
    }
    case 'updateApplicationStatus': {
      const candidaturasKey = `candidaturas_${payload.emailAluno}`;
      const candidaturas = localStore.get(candidaturasKey) || [];
      const idx = candidaturas.findIndex(
        (app) =>
          (app.titulo === payload.titulo || app.vacancy_title === payload.titulo) &&
          (app.company_email === payload.companyEmail || app.empresa === payload.companyEmail)
      );
      if (idx < 0) return { data: null, error: { message: 'Candidatura não encontrada' } };
      candidaturas[idx].status = payload.novoStatus;
      localStore.set(candidaturasKey, candidaturas);
      return { data: mapApplication(candidaturas[idx]), error: null };
    }
    default:
      return { data: null, error: { message: `Operação desconhecida: ${op}` } };
  }
}

async function callDb(op, payload = {}) {
  if (shouldUseRemoteApi()) {
    try {
      const result = await apiCall(op, payload);
      if (!result.error && result.data) {
        if (op === 'signUpStudent' || op === 'signInStudent') cacheStudentProfile(result.data);
        if (op === 'signUpCompany' || op === 'signInCompany') cacheCompanyProfile(result.data);
        if (op === 'updateStudentProfile') cacheStudentProfile(result.data);
        if (op === 'updateCompanyProfile') cacheCompanyProfile(result.data);
      }
      return result;
    } catch (error) {
      console.warn('API indisponível, usando localStorage:', error.message);
      useRemoteApi = false;
    }
  }
  return runLocalOperation(op, payload);
}

const db = {
  ready: Promise.resolve(),

  async signUpStudent(payload) {
    return callDb('signUpStudent', payload);
  },

  async signInStudent(email, password) {
    return callDb('signInStudent', { email, password });
  },

  async signUpCompany(payload) {
    return callDb('signUpCompany', payload);
  },

  async signInCompany(email, password) {
    return callDb('signInCompany', { email, password });
  },

  async signOut() {
    localStore.remove('aluno_logado');
    localStore.remove('empresa_logado');
    localStore.remove('perfilAluno');
    localStore.remove('perfilEmpresa');
    return true;
  },

  getCurrentStudent() {
    return localStore.get('aluno_logado');
  },

  getCurrentCompany() {
    return localStore.get('empresa_logado');
  },

  async getStudentProfileByEmail(email) {
    const result = await callDb('getStudentProfileByEmail', { email });
    return result.data;
  },

  async getCompanyProfileByEmail(email) {
    const result = await callDb('getCompanyProfileByEmail', { email });
    return result.data;
  },

  async updateStudentProfile(profile) {
    return callDb('updateStudentProfile', profile);
  },

  async updateCompanyProfile(profile) {
    return callDb('updateCompanyProfile', profile);
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
