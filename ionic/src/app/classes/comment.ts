import { User } from './user';

export class Comment {
  date: number;
  text: string;
  userId: string;
  user: User;
  constructor(options?) {
    this.date = Date.now();
    this.text = '';
    this.userId = '';
    this.user = new User({});
    Object.keys(options).forEach((key) => {
      if (key in this) {
        this[key] = options[key];
      }
    });
  }
}
