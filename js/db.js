const SUPABASE_URL = window.SUPABASE_URL || 'https://YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

let supabaseClient = null;

const isSupabaseConfigured = () => {
  return SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes('YOUR_') && !SUPABASE_ANON_KEY.includes('YOUR_');
};

const initSupabaseClient = async () => {
  if (supabaseClient) return supabaseClient;
  if (!isSupabaseConfigured()) {
    console.warn('Supabase não está configurado. O app usará fallback localStorage. Configure SUPABASE_URL e SUPABASE_ANON_KEY em js/db.js.');
    return null;
  }

  const module = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
  supabaseClient = module.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      storage: window.localStorage,
    },
  });

  return supabaseClient;
};

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

const db = {
  ready: initSupabaseClient(),

  async getClient() {
    return await initSupabaseClient();
  },

  async signUpStudent({ nome, email, password, cidade = '', sobre = '', skills = '' }) {
    if (!isSupabaseConfigured()) {
      const usuarios = localStore.get('usuarios_aluno') || [];
      if (usuarios.some(user => user.email === email)) {
        return { error: { message: 'Este e-mail já está cadastrado!' } };
      }
      const novoUsuario = { nome, email, senha: password, cidade, sobre, skills };
      usuarios.push(novoUsuario);
      localStore.set('usuarios_aluno', usuarios);
      cacheStudentProfile(novoUsuario);
      localStore.set(`candidaturas_${email}`, []);
      localStore.set(`favoritos_${email}`, []);
      localStore.set(`projetos_${email}`, []);
      return { data: novoUsuario, error: null };
    }

    const client = await this.getClient();
    const { data, error } = await client.auth.signUp({ email, password });
    if (error) return { error };

    const userId = data.user?.id || null;
    const profile = { user_id: userId, nome, email, cidade, sobre, skills, role: 'student' };
    const insert = await client.from('students').insert([profile]);
    if (insert.error) return { error: insert.error };
    cacheStudentProfile({ ...profile, senha: password });
    return { data: insert.data[0], error: null };
  },

  async signInStudent(email, password) {
    if (!isSupabaseConfigured()) {
      const usuarios = localStore.get('usuarios_aluno') || [];
      const usuario = usuarios.find(user => user.email === email && user.senha === password);
      if (!usuario) {
        return { error: { message: 'E-mail ou senha incorretos!' } };
      }
      cacheStudentProfile(usuario);
      return { data: usuario, error: null };
    }

    const client = await this.getClient();
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) return { error };
    const profileResult = await client.from('students').select('*').eq('email', email).single();
    if (profileResult.error) return { error: profileResult.error };
    cacheStudentProfile(profileResult.data);
    return { data: profileResult.data, error: null };
  },

  async signUpCompany({ nome, email, password, cidade = '', sobre = '' }) {
    if (!isSupabaseConfigured()) {
      const usuarios = localStore.get('usuarios_empresa') || [];
      if (usuarios.some(user => user.email === email)) {
        return { error: { message: 'Este e-mail corporativo já está cadastrado!' } };
      }
      const novoUsuario = { nome, email, senha: password, cidade, sobre };
      usuarios.push(novoUsuario);
      localStore.set('usuarios_empresa', usuarios);
      cacheCompanyProfile(novoUsuario);
      localStore.set(`vagas_${email}`, []);
      return { data: novoUsuario, error: null };
    }

    const client = await this.getClient();
    const { data, error } = await client.auth.signUp({ email, password });
    if (error) return { error };
    const userId = data.user?.id || null;
    const profile = { user_id: userId, nome, email, cidade, sobre, role: 'company' };
    const insert = await client.from('companies').insert([profile]);
    if (insert.error) return { error: insert.error };
    cacheCompanyProfile(profile);
    return { data: insert.data[0], error: null };
  },

  async signInCompany(email, password) {
    if (!isSupabaseConfigured()) {
      const usuarios = localStore.get('usuarios_empresa') || [];
      const usuario = usuarios.find(user => user.email === email && user.senha === password);
      if (!usuario) {
        return { error: { message: 'E-mail corporativo ou senha incorretos!' } };
      }
      cacheCompanyProfile(usuario);
      return { data: usuario, error: null };
    }

    const client = await this.getClient();
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) return { error };
    const profileResult = await client.from('companies').select('*').eq('email', email).single();
    if (profileResult.error) return { error: profileResult.error };
    cacheCompanyProfile(profileResult.data);
    return { data: profileResult.data, error: null };
  },

  async signOut() {
    if (isSupabaseConfigured()) {
      const client = await this.getClient();
      await client.auth.signOut();
    }
    localStore.remove('aluno_logado');
    localStore.remove('empresa_logado');
    localStore.remove('perfilAluno');
    localStore.remove('perfilEmpresa');
    return true;
  },

  getCurrentStudent() {
    const cached = localStore.get('aluno_logado');
    return cached;
  },

  getCurrentCompany() {
    const cached = localStore.get('empresa_logado');
    return cached;
  },

  async getStudentProfileByEmail(email) {
    if (!isSupabaseConfigured()) {
      const usuarios = localStore.get('usuarios_aluno') || [];
      return usuarios.find(user => user.email === email) || null;
    }
    const client = await this.getClient();
    const { data, error } = await client.from('students').select('*').eq('email', email).single();
    if (error) return null;
    return data;
  },

  async getCompanyProfileByEmail(email) {
    if (!isSupabaseConfigured()) {
      const usuarios = localStore.get('usuarios_empresa') || [];
      return usuarios.find(user => user.email === email) || null;
    }
    const client = await this.getClient();
    const { data, error } = await client.from('companies').select('*').eq('email', email).single();
    if (error) return null;
    return data;
  },

  async updateStudentProfile(profile) {
    if (!isSupabaseConfigured()) {
      const usuarios = localStore.get('usuarios_aluno') || [];
      const idx = usuarios.findIndex(user => user.email === profile.email);
      if (idx >= 0) {
        usuarios[idx] = { ...usuarios[idx], ...profile };
        localStore.set('usuarios_aluno', usuarios);
        cacheStudentProfile(usuarios[idx]);
        return { data: usuarios[idx], error: null };
      }
      return { data: null, error: { message: 'Aluno não encontrado' } };
    }
    const client = await this.getClient();
    const { data, error } = await client.from('students').update(profile).eq('email', profile.email).select().single();
    if (!error) cacheStudentProfile(data);
    return { data, error };
  },

  async updateCompanyProfile(profile) {
    if (!isSupabaseConfigured()) {
      const usuarios = localStore.get('usuarios_empresa') || [];
      const idx = usuarios.findIndex(user => user.email === profile.email);
      if (idx >= 0) {
        usuarios[idx] = { ...usuarios[idx], ...profile };
        localStore.set('usuarios_empresa', usuarios);
        cacheCompanyProfile(usuarios[idx]);
        return { data: usuarios[idx], error: null };
      }
      return { data: null, error: { message: 'Empresa não encontrada' } };
    }
    const client = await this.getClient();
    const { data, error } = await client.from('companies').update(profile).eq('email', profile.email).select().single();
    if (!error) cacheCompanyProfile(data);
    return { data, error };
  },

  async getCompanyVacancies(companyEmail) {
    if (!isSupabaseConfigured()) {
      return localStore.get(`vagas_${companyEmail}`) || [];
    }
    const client = await this.getClient();
    const { data, error } = await client.from('vacancies').select('*').eq('company_email', companyEmail).order('created_at', { ascending: false });
    if (error) return [];
    return data;
  },

  async getAllCompanyVacancies() {
    if (!isSupabaseConfigured()) {
      return Object.keys(localStorage)
        .filter(key => key.startsWith('vagas_'))
        .flatMap(key => JSON.parse(localStorage.getItem(key) || '[]'));
    }
    const client = await this.getClient();
    const { data, error } = await client.from('vacancies').select('*').order('created_at', { ascending: false });
    if (error) return [];
    return data;
  },

  async addCompanyVacancy(companyEmail, vacancy) {
    if (!isSupabaseConfigured()) {
      const vagasKey = `vagas_${companyEmail}`;
      const vagas = localStore.get(vagasKey) || [];
      vagas.push(vacancy);
      localStore.set(vagasKey, vagas);
      return { data: vacancy, error: null };
    }
    const client = await this.getClient();
    const vacancyRecord = {
      ...vacancy,
      id: vacancy.id || crypto.randomUUID(),
      company_email: companyEmail,
      company_name: vacancy.empresa || vacancy.company_name || '',
      company_id: (await this.getCurrentCompany())?.user_id || null,
      created_at: new Date().toISOString(),
    };
    const { data, error } = await client.from('vacancies').insert([vacancyRecord]).select().single();
    return { data, error };
  },

  async updateCompanyVacancy(companyEmail, vacancyId, vacancy) {
    if (!isSupabaseConfigured()) {
      const vagasKey = `vagas_${companyEmail}`;
      const vagas = localStore.get(vagasKey) || [];
      const index = vagas.findIndex(job => job.id === vacancyId);
      if (index >= 0) {
        vagas[index] = vacancy;
        localStore.set(vagasKey, vagas);
        return { data: vacancy, error: null };
      }
      return { data: null, error: { message: 'Vaga não encontrada' } };
    }
    const client = await this.getClient();
    const { data, error } = await client.from('vacancies').update(vacancy).eq('id', vacancyId).eq('company_email', companyEmail).select().single();
    return { data, error };
  },

  async getStudentFavorites(studentEmail) {
    if (!isSupabaseConfigured()) {
      return localStore.get(`favoritos_${studentEmail}`) || [];
    }
    const client = await this.getClient();
    const { data, error } = await client.from('favorites').select('*').eq('student_email', studentEmail).order('created_at', { ascending: false });
    if (error) return [];
    return data;
  },

  async addStudentFavorite(studentEmail, favorite) {
    if (!isSupabaseConfigured()) {
      const favoritosKey = `favoritos_${studentEmail}`;
      const favoritos = localStore.get(favoritosKey) || [];
      const novoFav = { id: favorite.id || Date.now(), ...favorite };
      favoritos.push(novoFav);
      localStore.set(favoritosKey, favoritos);
      return { data: novoFav, error: null };
    }
    const client = await this.getClient();
    const record = {
      id: favorite.id || crypto.randomUUID(),
      student_email: studentEmail,
      vacancy_title: favorite.titulo,
      company_name: favorite.empresa,
      company_email: favorite.company_email || favorite.empresa_email || '',
      categoria: favorite.area || favorite.categoria || '',
      tipo: favorite.tipo || '',
      created_at: new Date().toISOString(),
    };
    const { data, error } = await client.from('favorites').insert([record]).select().single();
    return { data, error };
  },

  async removeStudentFavorite(studentEmail, vacancyTitle, companyName) {
    if (!isSupabaseConfigured()) {
      const favoritosKey = `favoritos_${studentEmail}`;
      const favoritos = localStore.get(favoritosKey) || [];
      const filtered = favoritos.filter(fav => !(fav.titulo === vacancyTitle && fav.empresa === companyName));
      localStore.set(favoritosKey, filtered);
      return { data: filtered, error: null };
    }
    const client = await this.getClient();
    const { data, error } = await client.from('favorites').delete().match({ student_email: studentEmail, vacancy_title: vacancyTitle, company_name: companyName }).select();
    return { data, error };
  },

  async getStudentProjects(studentEmail) {
    if (!isSupabaseConfigured()) {
      return localStore.get(`projetos_${studentEmail}`) || [];
    }
    const client = await this.getClient();
    const { data, error } = await client.from('projects').select('*').eq('student_email', studentEmail).order('created_at', { ascending: false });
    if (error) return [];
    return data;
  },

  async saveStudentProject(studentEmail, project) {
    if (!isSupabaseConfigured()) {
      const projetosKey = `projetos_${studentEmail}`;
      const projetos = localStore.get(projetosKey) || [];
      const projectId = project.id || String(Date.now());
      const idx = projetos.findIndex(p => String(p.id) === String(projectId));
      const projectToSave = { id: projectId, ...project };
      if (idx >= 0) {
        projetos[idx] = projectToSave;
      } else {
        projetos.push(projectToSave);
      }
      localStore.set(projetosKey, projetos);
      return { data: projectToSave, error: null };
    }
    const client = await this.getClient();
    const projectId = project.id || crypto.randomUUID();
    const record = {
      ...project,
      id: projectId,
      student_email: studentEmail,
      created_at: new Date().toISOString(),
    };
    const { data, error } = await client.from('projects').upsert(record, { onConflict: 'id' }).select().single();
    return { data, error };
  },

  async deleteStudentProject(studentEmail, projectId) {
    if (!isSupabaseConfigured()) {
      const projetosKey = `projetos_${studentEmail}`;
      const projetos = localStore.get(projetosKey) || [];
      const filtered = projetos.filter(proj => String(proj.id) !== String(projectId));
      localStore.set(projetosKey, filtered);
      return { data: filtered, error: null };
    }
    const client = await this.getClient();
    const { data, error } = await client.from('projects').delete().eq('id', projectId).eq('student_email', studentEmail).select();
    return { data, error };
  },

  isSupabaseConfigured,

  async applyToVacancy(application) {
    if (!isSupabaseConfigured()) {
      const userEmail = application.emailAluno || application.emailAluno;
      const candidaturasKey = `candidaturas_${userEmail}`;
      const candidaturas = localStore.get(candidaturasKey) || [];
      candidaturas.push(application);
      localStore.set(candidaturasKey, candidaturas);
      return { data: application, error: null };
    }
    const client = await this.getClient();
    const record = {
      ...application,
      id: crypto.randomUUID(),
      student_email: application.emailAluno,
      company_email: application.empresa_email || application.empresa_email || application.empresa || '',
      company_name: application.empresa || '',
      vacancy_title: application.titulo,
      status: application.status || 'Pendente',
      created_at: new Date().toISOString(),
    };
    const { data, error } = await client.from('applications').insert([record]).select().single();
    return { data, error };
  },

  async getApplicationsByStudent(emailAluno) {
    if (!isSupabaseConfigured()) {
      return Object.keys(localStorage)
        .filter(key => key.startsWith('candidaturas_'))
        .flatMap(key => JSON.parse(localStorage.getItem(key) || '[]'))
        .filter(app => app.emailAluno === emailAluno);
    }
    const client = await this.getClient();
    const { data, error } = await client.from('applications').select('*').eq('student_email', emailAluno).order('created_at', { ascending: false });
    if (error) return [];
    return data;
  },

  async getApplicationsByCompany(companyEmail) {
    if (!isSupabaseConfigured()) {
      return Object.keys(localStorage)
        .filter(key => key.startsWith('candidaturas_'))
        .flatMap(key => JSON.parse(localStorage.getItem(key) || '[]'))
        .filter(app => app.empresa === companyEmail || app.company_email === companyEmail || app.empresa_email === companyEmail);
    }
    const client = await this.getClient();
    const { data, error } = await client.from('applications').select('*').or(`company_email.eq.${companyEmail},empresa.eq.${companyEmail}`);
    if (error) return [];
    return data;
  },

  async updateApplicationStatus(emailAluno, titulo, novoStatus, companyEmail) {
    if (!isSupabaseConfigured()) {
      const candidaturasKey = `candidaturas_${emailAluno}`;
      const candidaturas = localStore.get(candidaturasKey) || [];
      const index = candidaturas.findIndex(app => app.titulo === titulo && (app.empresa === companyEmail || app.company_email === companyEmail));
      if (index >= 0) {
        candidaturas[index].status = novoStatus;
        localStore.set(candidaturasKey, candidaturas);
        return { data: candidaturas[index], error: null };
      }
      return { data: null, error: { message: 'Candidatura não encontrada' } };
    }
    const client = await this.getClient();
    const { data, error } = await client.from('applications')
      .update({ status: novoStatus })
      .eq('student_email', emailAluno)
      .eq('vacancy_title', titulo)
      .eq('company_email', companyEmail)
      .select()
      .single();
    return { data, error };
  },

  async normalizeStudentApplications(emailAluno) {
    const applications = await this.getApplicationsByStudent(emailAluno);
    return applications.map(app => ({
      titulo: app.titulo || app.vacancy_title || '',
      empresa: app.empresa || app.company_name || app.company_email || '',
      emailAluno: app.emailAluno || app.student_email || '',
      status: app.status || 'Pendente',
      data: app.data || new Date(app.created_at).toLocaleDateString('pt-BR') || '',
      diasAtras: app.diasAtras || 0,
      msgExtra: app.msgExtra || app.extra_message || '',
    }));
  },

  async getStudentByEmail(email) {
    return await this.getStudentProfileByEmail(email);
  },
};

window.db = db;
