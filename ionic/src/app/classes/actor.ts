export class Actor {
  name: string;
  desc: string = '';
  color: string = 'primary';
  
  constructor(name: string) {
    this.name = name;
  }

  setName(name: string) {
    this.name= name;
  }

  setDesc(desc: string) {
    this.desc= desc;
  }

  setColor(color: string) {
    this.color= color;
  }

  getJSON() {
    let json = {};
    json['name'] = this.name;
    if(this.desc !== '') {
      json['desc'] = this.desc;
    }
    if(this.color !== 'primary') {
      json['color'] = this.color;
    }
    return json;
  }
}
