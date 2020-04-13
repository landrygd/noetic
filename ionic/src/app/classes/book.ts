export class Book {
  name: string;
  desc: string = '';
  autors: [];
  first: string = 'main';
  
  constructor(name: string) {
    this.name = name;
  }

  setName(name: string) {
    this.name= name;
  }

  setDesc(desc: string) {
    this.desc= desc;
  }

  getJSON() {
    let json = {};
    json['name'] = this.name;
    if(this.desc !== '') {
      json['desc'] = this.desc;
    }
    return json;
  }
}
