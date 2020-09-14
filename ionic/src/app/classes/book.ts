export class Role {
  name: string;
  color: string;
  key: string;
  roles: string[];
  variables: {name: string, value: any}[];
  actions: {name: string, value: any}[];

  constructor(options?) {
    this.name = '';
    this.color = 'medium';
    this.key = '';
    this.roles = [];
    this.variables = [];
    this.actions = [];
    Object.keys(options).forEach((key) => {
      if (key in this) {
        this[key] = options[key];
      }
    });
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

  constructor(options?) {
    this.name = '';
    this.type = '';
    this.color = '';
    this.img = '';
    this.key = '';
    this.roles = [];
    this.banner = '';
    Object.keys(options).forEach((key) => {
      if (key in this) {
        this[key] = options[key];
      }
    });
  }
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
  verso: string;
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

 // Content
  setup: {main: string};
  scripts: {name: string, content: string}[];
  entities: Entity[];
  roles: Role[];
  medias: {name: string, base64: string}[];

  constructor(options = {}) {
    this.id = '';
    this.title = '';
    this.titleLower = '';
    this.author = '';
    this.category = '';
    this.description = '';
    this.verso = '';
    this.tags = [];
    this.banner = '';
    this.cover = '';
    this.likes = 0;
    this.views = 0;
    this.version = 0;
    this.language = 'en';
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
        this[key] = options[key];
      }
    });
  }

  getCover() {
    return {
      id: this.id,
      title: this.title,
      titleLower: this.titleLower,
      author: this.author,
      language: this.language,
      category: this.category,
      description: this.description,
      verso: this.verso,
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
  }

  addEntity(entity: Entity) {
    const name = entity.name;
    if (!entity.key) {
      const key = this.addRole(name);
      entity.key = key;
      entity.roles = [key];
    }
    this.entities.push(entity);
  }

  addRole(name: string, opts?: Role): string {
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
    Object.assign(res, opts);
    this.roles.push(res);
    return name;
  }

  getEntity(key: string) {
    return this.entities.filter((value) => value.key = key)[0];
  }

  addScript(script) {
    this.scripts.push(script);
  }
}
