const { Redis } = require('@upstash/redis');

const DB_KEY = 'porto-connect:data';
const redis = Redis.fromEnv();

const emptyDb = () => ({
  students: [],
  companies: [],
  vacancies: [],
  favorites: [],
  projects: [],
  applications: [],
});

async function loadDb() {
  const data = await redis.get(DB_KEY);
  return data || emptyDb();
}

async function persistDb(data) {
  await redis.set(DB_KEY, data);
}

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

function runOperation(db, op, payload = {}) {
  switch (op) {
    case 'signUpStudent': {
      const { nome, email, password, cidade = '', sobre = '', skills = '' } = payload;
      if (db.students.some((user) => user.email === email)) {
        return { data: null, error: { message: 'Este e-mail já está cadastrado!' } };
      }
      const profile = { id: crypto.randomUUID(), nome, email, senha: password, cidade, sobre, skills, role: 'student' };
      db.students.push(profile);
      return { data: profile, error: null };
    }

    case 'signInStudent': {
      const { email, password } = payload;
      const user = db.students.find((item) => item.email === email && item.senha === password);
      if (!user) return { data: null, error: { message: 'E-mail ou senha incorretos!' } };
      return { data: user, error: null };
    }

    case 'signUpCompany': {
      const { nome, email, password, cidade = '', sobre = '' } = payload;
      if (db.companies.some((user) => user.email === email)) {
        return { data: null, error: { message: 'Este e-mail corporativo já está cadastrado!' } };
      }
      const profile = { id: crypto.randomUUID(), nome, email, senha: password, cidade, sobre, role: 'company' };
      db.companies.push(profile);
      return { data: profile, error: null };
    }

    case 'signInCompany': {
      const { email, password } = payload;
      const user = db.companies.find((item) => item.email === email && item.senha === password);
      if (!user) return { data: null, error: { message: 'E-mail corporativo ou senha incorretos!' } };
      return { data: user, error: null };
    }

    case 'getStudentProfileByEmail': {
      const user = db.students.find((item) => item.email === payload.email) || null;
      return { data: user, error: null };
    }

    case 'getCompanyProfileByEmail': {
      const user = db.companies.find((item) => item.email === payload.email) || null;
      return { data: user, error: null };
    }

    case 'updateStudentProfile': {
      const idx = db.students.findIndex((item) => item.email === payload.email);
      if (idx < 0) return { data: null, error: { message: 'Aluno não encontrado' } };
      db.students[idx] = { ...db.students[idx], ...payload };
      return { data: db.students[idx], error: null };
    }

    case 'updateCompanyProfile': {
      const idx = db.companies.findIndex((item) => item.email === payload.email);
      if (idx < 0) return { data: null, error: { message: 'Empresa não encontrada' } };
      db.companies[idx] = { ...db.companies[idx], ...payload };
      return { data: db.companies[idx], error: null };
    }

    case 'getCompanyVacancies': {
      const data = db.vacancies
        .filter((item) => item.company_email === payload.companyEmail)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map(mapVacancy);
      return { data, error: null };
    }

    case 'getAllCompanyVacancies': {
      const data = [...db.vacancies]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map(mapVacancy);
      return { data, error: null };
    }

    case 'addCompanyVacancy': {
      const { companyEmail, vacancy, companyName = '' } = payload;
      const record = {
        ...vacancy,
        id: vacancy.id || crypto.randomUUID(),
        company_email: companyEmail,
        company_name: vacancy.empresa || vacancy.company_name || companyName,
        status: vacancy.status || 'Ativa',
        created_at: new Date().toISOString(),
      };
      db.vacancies.push(record);
      return { data: mapVacancy(record), error: null };
    }

    case 'updateCompanyVacancy': {
      const idx = db.vacancies.findIndex(
        (item) => item.id === payload.vacancyId && item.company_email === payload.companyEmail
      );
      if (idx < 0) return { data: null, error: { message: 'Vaga não encontrada' } };
      db.vacancies[idx] = { ...db.vacancies[idx], ...payload.vacancy };
      return { data: mapVacancy(db.vacancies[idx]), error: null };
    }

    case 'getStudentFavorites': {
      const data = db.favorites
        .filter((item) => item.student_email === payload.studentEmail)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map(mapFavorite);
      return { data, error: null };
    }

    case 'addStudentFavorite': {
      const { studentEmail, favorite } = payload;
      const record = {
        id: favorite.id || crypto.randomUUID(),
        student_email: studentEmail,
        vacancy_title: favorite.titulo,
        company_name: favorite.empresa,
        company_email: favorite.company_email || '',
        categoria: favorite.area || favorite.categoria || '',
        tipo: favorite.tipo || '',
        created_at: new Date().toISOString(),
      };
      db.favorites.push(record);
      return { data: mapFavorite(record), error: null };
    }

    case 'removeStudentFavorite': {
      db.favorites = db.favorites.filter(
        (item) =>
          !(
            item.student_email === payload.studentEmail &&
            item.vacancy_title === payload.vacancyTitle &&
            item.company_name === payload.companyName
          )
      );
      const data = db.favorites
        .filter((item) => item.student_email === payload.studentEmail)
        .map(mapFavorite);
      return { data, error: null };
    }

    case 'getStudentProjects': {
      const data = db.projects
        .filter((item) => item.student_email === payload.studentEmail)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      return { data, error: null };
    }

    case 'saveStudentProject': {
      const { studentEmail, project } = payload;
      const projectId = project.id || crypto.randomUUID();
      const record = {
        ...project,
        id: projectId,
        student_email: studentEmail,
        created_at: project.created_at || new Date().toISOString(),
      };
      const idx = db.projects.findIndex((item) => String(item.id) === String(projectId));
      if (idx >= 0) db.projects[idx] = record;
      else db.projects.push(record);
      return { data: record, error: null };
    }

    case 'deleteStudentProject': {
      db.projects = db.projects.filter(
        (item) =>
          !(String(item.id) === String(payload.projectId) && item.student_email === payload.studentEmail)
      );
      return { data: db.projects.filter((item) => item.student_email === payload.studentEmail), error: null };
    }

    case 'applyToVacancy': {
      const { application } = payload;
      const record = {
        id: crypto.randomUUID(),
        student_email: application.emailAluno,
        company_email: application.company_email || application.empresa_email || '',
        company_name: application.empresa || application.company_name || '',
        vacancy_title: application.titulo,
        status: application.status || 'Pendente',
        extra_message: application.msgExtra || '',
        created_at: new Date().toISOString(),
      };
      db.applications.push(record);
      return { data: mapApplication(record), error: null };
    }

    case 'getApplicationsByStudent': {
      const data = db.applications
        .filter((item) => item.student_email === payload.emailAluno)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map(mapApplication);
      return { data, error: null };
    }

    case 'getApplicationsByCompany': {
      const data = db.applications
        .filter((item) => item.company_email === payload.companyEmail)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map(mapApplication);
      return { data, error: null };
    }

    case 'updateApplicationStatus': {
      const idx = db.applications.findIndex(
        (item) =>
          item.student_email === payload.emailAluno &&
          item.vacancy_title === payload.titulo &&
          item.company_email === payload.companyEmail
      );
      if (idx < 0) return { data: null, error: { message: 'Candidatura não encontrada' } };
      db.applications[idx].status = payload.novoStatus;
      return { data: mapApplication(db.applications[idx]), error: null };
    }

    default:
      return { data: null, error: { message: `Operação desconhecida: ${op}` } };
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, storage: 'upstash-redis' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Método não permitido' } });
  }

  try {
    const { op, payload } = req.body || {};
    if (!op) {
      return res.status(400).json({ error: { message: 'Operação não informada' } });
    }

    const db = await loadDb();
    const result = runOperation(db, op, payload);
    await persistDb(db);
    return res.status(200).json(result);
  } catch (error) {
    console.error('API DB error:', error);
    return res.status(500).json({
      error: {
        message: 'Banco indisponível. Adicione Upstash Redis em Vercel ? Storage/Marketplace e conecte ao projeto.',
      },
    });
  }
};
