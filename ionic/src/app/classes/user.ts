export class User {
  id: string;
  name: string;
  nameLower: string;
  avatar: string;
  bio: string;
  lang: string;
  searchlangs: string[];
  color: string;
  first: boolean;
  tuto: boolean;

  constructor(options?) {
    this.id = '';
    this.name = '';
    this.nameLower = '';
    this.avatar = '';
    this.bio = '';
    this.lang = '';
    this.searchlangs = [];
    this.color = 'primary';
    this.first = false;
    this.tuto = true;
    Object.keys(options).forEach((key) => {
      if (key in this) {
        this[key] = options[key];
      }
    });
  }
}
