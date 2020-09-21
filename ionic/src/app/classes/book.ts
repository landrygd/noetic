export class Role {
  color: string;
  name: string;
  roles: string[];
  variables: {name: string, value: any}[];
  actions: {name: string, value: any}[];

  constructor(options?) {
    this.color = 'medium';
    this.name = '';
    this.roles = [];
    this.variables = [];
    this.actions = [];
    Object.keys(options).forEach((key) => {
      if (key in this) {
        this[key] = options[key];
      }
    });
  }

  // DELETERS
  deleteVariable(name: string) {
    const index = this.variables.findIndex((v) => v.name === name);
    this.variables.splice(index, 1);
  }

  deleteAction(name: string) {
    const index = this.actions.findIndex((a) => a.name === name);
    this.actions.splice(index, 1);
  }

  // GETTERS
  getVariable(name): {name: string, value: any} {
    return this.variables.filter((value) => value.name === name)[0];
  }

  getAction(name): {name: string, value: any} {
    return this.actions.filter((value) => value.name === name)[0];
  }

  // SETTERS
  setVariable(variable: {name: string, value: any}) {
    const index = this.variables.findIndex((value) => value.name === variable.name);
    index === -1 ? this.addVariable(variable) : this.variables[index] = variable;
  }

  setAction(action: {name: string, value: any}) {
    const index = this.actions.findIndex((value) => value.name === action.name);
    index === -1 ? this.addAction(action) : this.actions[index] = action;
  }

  // ADDERS
  addVariable(variable: {name: string, value: any}) {
    this.variables.push(variable);
  }

  addAction(action: {name: string, value: any}) {
    this.actions.push(action);
  }
}

export class Entity {
  name: string;
  type: string;
  color: string;
  img: string;
  key: string;
  roles: string[];
  banner: string;
  description: string;
  variables: any;
  // {
  //   variable1: 10;
  //   variable2: "Coucou";
  // }
  extra: any;
  // {
  //   items: string[];
  //   places: string[];
  // }

  constructor(options?) {
    this.name = '';
    this.type = '';
    this.color = 'medium';
    this.img = '';
    this.key = '';
    this.roles = [];
    this.banner = '';
    this.extra = {};
    this.variables = {};
    this.description = '';
    Object.keys(options).forEach((key) => {
      if (key in this) {
        this[key] = options[key];
      }
    });
  }

  haveVariable(name: string) {
    return this.variables.findIndex((v) => v.name === name) !== -1;
  }

  // DELETERS
  deleteVariable(name: string) {
    delete this.variables[name];
  }

  deleteExtra(collection: string, key: string) {
    const index = this.extra[collection].indexOf(key);
    this.extra[collection].splice(index, 1);
  }

  // GETTERS
  getVariable(name): {name: string, value: any} {
    return this.variables[name];
  }

  // SETTERS
  setVariable(variable: {name: string, value: any}) {
    this.variables[variable.name] = variable.value;
  }

  // ADDERS
  addVariable(variable: {name: string, value: any}) {
    this.variables[variable.name] = variable.value;
  }

  addExtra(collection: string, key: string) {
    if (this.extra[collection]) {
      this.extra[collection].push(key);
    } else {
      this.extra[collection] = [key];
    }
  }
}

export class Script {
  name: string;
  messages: string[];

  constructor(options?) {
    this.name = 'main';
    this.messages = [];
    Object.keys(options).forEach((key) => {
      if (key in this) {
        this[key] = options[key];
      }
    });
  }

  getCommand(message: string) {
    return message.split(' ')[0];
  }

  getTabs() {
    let cpt = 0;
    const tabs = [];
    let before = 0;
    for (const msg of this.messages) {
      if (before > 0) {
        cpt += before;
        before -= 1;
      }
      if (['/question', '/if'].includes(this.getCommand(msg))) {
        if (cpt < 5) {
          before += 1;
        }
      }
      if (this.getCommand(msg) === '/end') {
        if (cpt > 0) {
          cpt -= 1;
        }
      }
      tabs.push(new Array(cpt));
    }
    let lastClosed = this.messages.length;
    if (cpt > 0) {
      // before = 0;
      for (let i = this.messages.length - 1; i >= 0; i--) {
        const msg = this.messages[i];
        // if (before < 0) {
        //   cpt += before;
        //   before += 1;
        // }
        if (['/question', '/if'].includes(this.getCommand(msg))) {
          cpt -= 1;
        }
        if (this.getCommand(msg) === '/end') {
          cpt += 1;
        }
        if (cpt <= 0) {
          lastClosed = i;
          break;
        }
      }
    }
    return {tabs, lastClosed};
  }
}

export class Media {
  name: string;
  base64: string;
}

export class Book {
  // Cover
  id: string;
  title: string;
  titleLower: string;
  author: string;
  language: string;
  category: string;
  description: string;
  tags: string[];
  banner: string;
  cover: string;
  likes: number;
  views: number;
  version: number;
  creationDate: number;
  lastModificationDate: number;
  public: boolean;
  downloadURL: string;
  color: string;

 // Content
  setup: {main: string};
  scripts: Script[];
  entities: Entity[];
  roles: Role[];
  medias: Media[];

  constructor(options = {}) {
    this.id = '';
    this.title = '';
    this.titleLower = '';
    this.author = '';
    this.category = '';
    this.description = '';
    this.tags = [];
    this.banner = '';
    this.cover = '';
    this.likes = 0;
    this.views = 0;
    this.version = 0;
    this.language = 'en';
    this.color = 'primary';
    this.creationDate = new Date().getTime();
    this.lastModificationDate = new Date().getTime();
    this.public = false;
    this.downloadURL = '';

    this.setup = {
      main: 'main'
    };
    this.scripts = [];
    this.entities = [];
    this.roles = [];
    this.medias = [];
    Object.keys(options).forEach((key) => {
      if (key in this) {
        const res = [];
        if (key === 'scripts') {
          options[key].forEach(script => {
            res.push(new Script(script));
          });
          options[key] = res;
        }
        if (key === 'entities') {
          options[key].forEach(script => {
            res.push(new Entity(script));
          });
          options[key] = res;
        }
        if (key === 'roles') {
          options[key].forEach(script => {
            res.push(new Role(script));
          });
          options[key] = res;
        }
        this[key] = options[key];
      }
    });
  }

  getCover() {
    const obj = {
      id: this.id,
      title: this.title,
      titleLower: this.titleLower,
      author: this.author,
      language: this.language,
      category: this.category,
      description: this.description,
      tags: this.tags,
      banner: this.banner,
      cover: this.cover,
      likes: this.likes,
      views: this.views,
      version: this.version,
      creationDate: this.creationDate,
      lastModificationDate: this.lastModificationDate,
      public: this.public,
      downloadURL: this.downloadURL
    };
    if (this.version > 1) {
      delete obj.views;
      delete obj.likes;
    }
    return obj;
  }

  haveScript(name: string): boolean {
    return this.scripts.filter((value) => value.name === name).length > 0;
  }

  // ADDERS

  addEntity(entity: Entity) {
    const name = entity.name;
    const key = this.addRole(name);
    entity.key = key;
    entity.roles = [key];
    this.entities.push(entity);
  }

  addRole(name: string, opts?): string {
    this.roles.sort((a, b) => ('' + a.name).localeCompare(b.name));
    name = name.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                  .replace(/[^\w\s]/gi, '').replace(/\s/g, '-');
    for (const role of this.roles) {
      if (role.name === name) {
        if (name.match(/#\d+$/)) {
          name = name.replace(/#\d+$/, (n) => {
            n = n.replace('#', '');
            let rep = parseInt(n, 10);
            ++rep;
            return '#' + rep;
          });
        } else {
          name = name + '#1';
        }
      }
    }
    const res = new Role({name});
    this.roles.push(res);
    return name;
  }

  addScript(script) {
    this.scripts.push(script);
  }

  // GETTERS

  getScript(name): Script {
    return this.scripts.filter((value) => value.name === name)[0];
  }

  getEntities(type: string): Entity[] {
    return this.entities.filter((value) => value.type === type);
  }

  getEntity(key: string): Entity {
    return this.entities.filter((value) => value.key === key)[0];
  }

  getRole(name: string): Role {
    return this.roles.filter((value) => value.name === name)[0];
  }

  getRoles(roles: string[]): Role[] {
    return this.roles.filter((value) => roles.includes(value.name));
  }

  // SETTERS

  setEntity(entity: Entity) {
    const index = this.entities.findIndex((e) => e.key === entity.key);
    index === -1 ? this.addEntity(entity) : this.entities[index] = entity;
  }

  setScript(script: Script) {
    const index = this.scripts.findIndex((s) => s.name === script.name);
    index === -1 ? this.addScript(script) : this.scripts[index] = script;
  }

  setRole(role: Role) {
    const index = this.roles.findIndex((r) => r.name === role.name);
    index === -1 ? this.addRole(role.name, role) : this.roles[index] = role;
  }

  // DELETERS

  deleteScript(name) {
    const index = this.scripts.findIndex((s) => s.name === name);
    this.scripts.splice(index, 1);
  }

  deleteEntity(key) {
    const index = this.entities.findIndex((e) => e.key === key);
    this.entities.splice(index, 1);
  }

  deleteRole(name) {
    const index = this.roles.findIndex((e) => e.name === name);
    this.roles.splice(index, 1);
  }
}
