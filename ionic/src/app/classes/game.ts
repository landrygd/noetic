export class Game {

  name: string = "New game";
  book: string = "main";
  date: string = new Date().toUTCString();
  host: string = "unknowed";
  log: number = 0;
  chat: string = "main";
  place: string = "main";
  players: any[] = [];
  data: object = {
    global: {},
    player: {}
  }

  constructor(name: string, host: string, book: string, chat: string ='main', log: number = 0) {
    this.name = name;
    this.host = host;
    this.book = book;
    this.chat = chat;
    this.log = log;
  }

  addPlayer(player: string) {
    this.players.push(player);
  }

  getJson(): object {
    return { 
      name: this.name,
      date: this.date,
      host: this.host,
      log: this.log,
      chat: this.chat,
      place: this.place,
      players: this.players,
      data: this.data,
    }
  }
}
