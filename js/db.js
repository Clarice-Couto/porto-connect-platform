const db = {
  storage: window.localStorage,

  getRaw(key) {
    return this.storage.getItem(key);
  },

  get(key, fallback = null) {
    const raw = this.getRaw(key);
    if (raw === null) {
      return fallback;
    }
    try {
      return JSON.parse(raw);
    } catch (error) {
      console.warn(`db.get: failed to parse ${key}`, error);
      return fallback;
    }
  },

  set(key, value) {
    this.storage.setItem(key, JSON.stringify(value));
  },

  remove(key) {
    this.storage.removeItem(key);
  },

  getCurrentCompany() {
    return this.get('empresa_logado', null);
  },

  getCurrentStudent() {
    return this.get('aluno_logado', null);
  },

  getCompanyVacancies(email) {
    if (!email) return [];
    return this.get(`vagas_${email}`, []);
  },

  saveCompanyVacancies(email, vagas) {
    if (!email) return;
    this.set(`vagas_${email}`, vagas);
  },

  addCompanyVacancy(email, vaga) {
    if (!email) return [];
    const vagas = this.getCompanyVacancies(email);
    vagas.push(vaga);
    this.saveCompanyVacancies(email, vagas);
    return vagas;
  },

  getAllCompanyVacancies() {
    return Object.keys(this.storage)
      .filter(key => key.startsWith('vagas_'))
      .flatMap(key => this.get(key, []));
  },

  updateCompanyVacancy(email, id, updates) {
    if (!email) return [];
    const vagas = this.getCompanyVacancies(email).map(vaga => {
      if (vaga.id === id) {
        return { ...vaga, ...updates };
      }
      return vaga;
    });
    this.saveCompanyVacancies(email, vagas);
    return vagas;
  }
};

window.db = db;