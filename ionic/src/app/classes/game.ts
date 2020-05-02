import { FirebaseService } from '../services/firebase.service';

// interface GameInterface {
//   name: string,
//   book: string,
//   date: string,
//   chat: any,
//   data: object,
// }

export class Game {

  name: string = "New game";
  book: string = "main";
  date: string = new Date().toUTCString();
  chat = {
    main: {
      name: "main",
      host: "unknowed",
      log: 0,
      place: "main",
      players: [],
      data: {}
    }
  };
  data: object = {
    global: {},
    player: {}
  }

  chatId: string;

  constructor(
    name: string = 'unknowed',
    host: string = 'unknowed',
    book: string = 'unknowed',
    chatName: string = 'main',
    public firebase: FirebaseService) {
    this.name = name;
    this.book = book;
    this.chat.main.name = chatName;
    this.chat.main.log = 0;
    this.chat.main.host = host;
    this.chat.main.players.push(host);
  }

  setFromJson(json) {
    this.name = json.name;
    this.book = json.book;
    this.date = json.date;
    this.chat = json.chat;
    this.data = json.data;
  }

  getJson(): object {
    return {
      name: this.name,
      date: this.date,
      book: this.book,
      chat: this.chat,
      data: this.data
    }
  }

  setChatId(chatId) {
    this.chatId = chatId;
  }

  getCurHost(): string {
    return this.chat[this.chatId].host;
  }

  getChatLogs(): any[] {
    return this.firebase.chatLogs;
  }

  getChat(): any[] {
    return this.chat[this.chatId];
  }

  getLogId(): number {
    return this.chat[this.chatId].log;
  }

  getChatId(): string {
    return this.chatId;
  }

  getLog() {
    return this.firebase.getLog(this.getLogId());
  }

  isHost(): boolean {
    return this.firebase.userId === this.getCurHost();
  }

  getAnswerGoto(): number {
    const answers = this.getAnswersList();
    const index = answers.indexOf(Math.max(...answers));
    return this.getAnswers()[index]['goto'];
  }

  getAnswers(): any[] {
    return this.getLog()['answers'];
  }

  getAnswersList(): any[] {
    return this.getChat()['answers'];
  }

  getAnswersCount(): number {
    let res = 0;
    this.getAnswersList().forEach((value) => {
      res += value;
    })
    return res;
  }

  getPlayerList(): any[] {
    return this.getChat()["players"];
  }

  getPlayerCount(): number {
    return this.getPlayerList().length;
  }
}
