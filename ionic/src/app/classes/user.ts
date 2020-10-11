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
  premium = false;

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
    this.tuto = false;
    Object.keys(options).forEach((key) => {
      if (key in this) {
        this[key] = options[key];
      }
    });
  }

  isPremium() {
    return this.premium;
  }
}
