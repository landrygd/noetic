import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController, NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription, Observable } from 'rxjs';
import { Game } from '../classes/game';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { TraductionService } from './traductionService.service';
import { auth } from 'firebase/app';

export interface User {
  book: any [];
  credit: number;
  follow: number;
  lib: any [];
  name: string;
}

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {

  userId: string;
  mail: string;
  method: any;
  connected = false;
  userData: any;
  userBooks: any [] = [];
  userList: any [] = [];
  userNotifs: any[] = [];
  unreadNotif = false;
  curBookId = 'none';
  curChat: string;
  curGame: string;
  book: any = {
    name: 'loading',
    desc: 'loading'
  };
  bookStory: any[];
  bookActor: any[];
  bookPlace: any[];
  chatLogs: any[];
  comments: any[] = [];

  userBooksSub: Subscription;
  userListSub: Subscription;
  userNotifsSub: Subscription;
  bookSub: Subscription;
  bookStorySub: Subscription;
  bookActorSub: Subscription;
  bookPlaceSub: Subscription;
  chatLogsSub: Subscription;
  commentsSub: Subscription;

  gotUser = '';
  profileUserId = '';

  category = [
    'action',
    'adventure',
    'fanfiction',
    'fantastic',
    'fiction',
    'horror',
    'humor',
    'mystery',
    'nonfiction',
    'romance',
    'scifi',
    'thriller'
  ];

  mostVueList: any[];

  usersList: any[] = [];

  constructor(
    private toastController: ToastController,
    public navCtrl: NavController,
    private firestore: AngularFirestore,
    public afAuth: AngularFireAuth,
    public firerealtime: AngularFireDatabase,
    public firestorage: AngularFireStorage,
    public translator: TraductionService
  ) {
    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        this.connected = false;
        // console.log(this.translator.getCurLanguage());
        this.mostVueList = this.getMostVue(this.translator.getCurLanguage());
      } else {
        this.mostVueList = undefined;
        // this.presentToast('connecté: ' + auth.uid);
        this.userId = auth.uid;
        this.mail = auth.email;
        this.method = auth.providerData[0].providerId;
        this.connected = true;
        this.syncUserData();
        this.profileUserId = this.userId;
        this.navCtrl.navigateRoot(['/']);
      }
    });
  }

  async syncUserData() {
    this.firestore.collection('users').doc(this.userId).valueChanges().subscribe((value) => {
      this.userData = value;
      this.syncBooks();
      this.syncList();
      this.syncNotifs();
      if (this.mostVueList === undefined) {
        this.mostVueList = this.getMostVue();
      }
      if (this.userData.first === true) {
        this.navCtrl.navigateRoot('presentation');
        this.firestore.collection('/users').doc(this.userId).update({first: false});
      }
    });
  }

  syncBooks() {
    this.userBooks = [];
    for (let i = 0; i < this.userData.book.length; i++) {
      const bookId = this.userData.book[i];
      this.userBooksSub = this.firestore.collection('books', ref => ref.where('id', '==', bookId)).valueChanges().subscribe((value) => {
        this.userBooks[i] = value[0];
      });
    }
  }

  syncNotifs() {
    this.userNotifs = [];
    this.userNotifsSub = this.firestore.collection('users').doc(this.userId).collection('notifs').valueChanges().subscribe((value) => {
      this.userNotifs = value;
      this.unreadNotif = this.haveUnreadNotif();
    });
  }

  haveUnreadNotif() {
    for (let i = 0; i < this.userNotifs.length; i++) {
      const notif = this.userNotifs[i];
      if (!notif.read) {
        return true;
      }
    }
    return false;
  }

  unsyncBooks() {
    this.userBooksSub.unsubscribe();
  }

  refreshBooks() {
    this.unsyncBooks();
    setTimeout(() => this.syncBooks(), 500);
  }


  syncList() {
    this.userList = [];
    for (let i = 0; i < this.userData.list.length; i++) {
      const bookId = this.userData.list[i];
      this.userListSub = this.firestore.collection('books', ref => ref.where('id', '==', bookId)).valueChanges().subscribe((value) => {
        this.userList[i] = value[0];
      });
    }
  }

  unsyncList() {
    this.userListSub.unsubscribe();
  }

  refreshList() {
    this.unsyncList();
    setTimeout(() => this.syncList(), 500);
  }

  addBook(book, cover='') {
    book.id = this.firestore.createId();
    this.curBookId = book.id;
    const bookList = this.userData.book;
    bookList.push(book.id);
    this.firestore.collection('/users').doc(this.userId).update({book: bookList});
    if (cover.charAt(0) !== '.') {
      this.uploadFile('cover', cover, this.curBookId);
    }
    this.firestore.collection('/books').doc(book.id).set(book).then(() => {
      this.navCtrl.pop().then( () => {
        this.openBook(book.id);
        setTimeout(() => {
          this.firestore.collection('/books').doc(this.curBookId).collection('actors').doc('Narrator').set({id: 'Narrator', name: 'Narrator'}).then(() => {
            this.addChat({name: 'main', desc: '', logs: []}, true);
          });

        }, 100);
      }
      );
      }
    );
  }

  deleteBook(bookId = this.curBookId) {
    this.navCtrl.navigateRoot('/');
    const bookList: any [] = this.userData.book;
    bookList.splice(bookList.indexOf(bookId), 1);
    this.firestore.collection('/users').doc(this.userId).update({book: bookList});
    const subCollections = ['story','actors','map','comments'];
    this.unsyncBook();
    subCollections.forEach((subCollection) => {
      this.firestore.collection('books').doc(bookId).collection(subCollection).get().subscribe((data) => {
        data.docs.forEach((doc) => this.firestore.collection('/books').doc(bookId).collection(subCollection).doc(doc.id).delete());
      });
    });
    this.book.ref.forEach(ref => {
      this.firestorage.ref('books/'+ bookId +'/'+ ref).delete();
    });
    this.firestore.collection('/books').doc(bookId).delete();
    this.refreshBooks();
  }

  openBook(bookId) {
    this.curBookId = bookId;
    this.syncBook();
    this.navCtrl.navigateRoot(['/tabs-book']);
  }

  addChat(chat, main = false) {
    if (main) {
      chat.id = 'main';
    } else {
      chat.id = this.firestore.createId();
    }
    this.firestore.collection('/books').doc(this.curBookId).collection('story').doc(chat.id).set(chat).then(
      () => this.openChat(chat.id)
    );
  }

  openChat(chatId) {
    this.curChat = chatId;
    this.navCtrl.navigateForward(['/chat']);
    this.syncChat();
  }

  syncBook(curBookId = this.curBookId) {
    this.bookSub = this.firestore.collection('books').doc(curBookId).valueChanges().subscribe((value) => {
      this.book = value;
    });
    this.bookStorySub = this.firestore.collection('books').doc(curBookId).collection('story').valueChanges().subscribe((value) => {
      this.bookStory = value;
    });
    this.bookActorSub = this.firestore.collection('books').doc(curBookId).collection('actors').valueChanges().subscribe((value) => {
      this.bookActor = value;
    });
    this.bookPlaceSub = this.firestore.collection('books').doc(curBookId).collection('map').valueChanges().subscribe((value) => {
      this.bookPlace = value;
    });
  }

  unsyncBook() {
    this.bookSub.unsubscribe();
    this.bookStorySub.unsubscribe();
    this.bookActorSub.unsubscribe();
    this.bookPlaceSub.unsubscribe();
  }


  syncChat(chatId = this.curChat) {
    this.chatLogsSub = this.firestore.collection('books').doc(this.curBookId).collection('story').doc(chatId).valueChanges().subscribe((value: any) => {
      if (value !== undefined) {
        this.chatLogs = value.logs;
      } else {
        this.chatLogsSub.unsubscribe();
      }
    });
  }

  unsyncChat() {
    this.chatLogsSub.unsubscribe();
  }

  addActor(actor) {
    actor.id = this.firestore.createId();
    this.firestore.collection('/books').doc(this.curBookId).collection('actors').doc(actor.id).set(actor);
  }

  editChatLog(log, index = this.chatLogs.length) {
    const res = this.chatLogs;
    res.splice(index, 1, log);
    this.setChatLogs(res);
  }

  addChatLog(log, index = this.chatLogs.length) {
    const res = this.chatLogs;
    res.splice(index, 0, log);
    this.setChatLogs(res);
  }

  deleteChatLog(index = this.chatLogs.length) {
    const res = this.chatLogs;
    res.splice(index, 1);
    this.setChatLogs(res);
  }

  deleteChat(chatId = this.curChat) {
    this.unsyncChat();
    this.firestore.collection('books').doc(this.curBookId).collection('story').doc(chatId).delete();
    this.navCtrl.navigateRoot('/tabs-book');
  }

  setChatLogs(logs) {
    this.firestore.collection('books').doc(this.curBookId).collection('story').doc(this.curChat).update({logs});
  }

  async toast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1000
    });
    toast.present();
  }

  login(loginData) {
    this.afAuth.signInWithEmailAndPassword(loginData.email, loginData.password)
    .then(auth => {
    })
    .catch(err => {
      this.error('Email ou mot de passe incorrect');
    });
  }

  signUp(registerData, mode = 'email') {
    if (mode === 'email') {
      this.afAuth.createUserWithEmailAndPassword(registerData.email, registerData.password)
      .then(auth => {
        this.newUser(auth, registerData);
      })
      .catch(err => {
        this.error('Email déjà utilisé');
      });
    }
    if (mode === 'google') {
      this.afAuth.signInWithPopup(new auth.GoogleAuthProvider()).then( auth => {
          this.newUser(auth);
        }
      )
    }
  }

  newUser(auth, registerData = {name: 'unknowed', birthday: 'unknowed'}) {
    const user = this.firestore.collection('/users').doc(auth.user.uid);
    user.set({
      id: auth.user.uid,
      name: registerData.name,
      book: [],
      list: [],
      follow: [],
      followers: [],
      credit: 0,
      first: true,
      birthday: registerData.birthday,
      avatar: '../../../assets/avatar/default.png',
      lang: this.translator.getCurLanguage(),
      bio: 'rien à dire pour le moment...'
    });
  }

  newGame(game: Game, curBookId = this.curBookId) {
    const id = this.firerealtime.createPushId();
    this.curGame = id;
    this.curBookId = curBookId;
    this.syncBook();
    this.curChat = this.getFirstChat();
    this.syncChat();
    const itemRef = this.firerealtime.object('games/' + id);
    itemRef.set(game.getJson());
  }

  getFirstChat() {
    return this.book.first;
  }

  leaveGame() {
    this.unsyncBook();
    this.unsyncChat();
    this.firerealtime.object('games/' + this.curGame).remove();
  }

  async error(text) {
    const toast = await this.toastController.create({
      message: text,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  getActorById(id) {
    for (let i = 0; i < this.bookActor.length; i++) {
      const actor = this.bookActor[i];
      if (actor.id === id) {
        return actor;
      }
    }
  }

  getUserId() {
    return this.userId;
  }

  getLog(line: number) {
    return this.chatLogs[line];
  }

  getMail() {
    return this.mail;
  }

  getLabels(): any[] {
    const res = [];
    this.chatLogs.forEach(element => {
      if (element.action === 'label') {
        res.push(element.number);
      }
    });
    return res;
  }

  getNewLabel(): number {
    let labels = this.getLabels();
    labels = labels.sort();
    for (let i = 0; i < labels.length; i++) {
      if (labels[i] !== i + 1) {
        return i + 1;
      }
    }
    return labels.length + 1;
  }

  getLabelLine(nb) {
    for (let i = 0; i < this.chatLogs.length; i++) {
      const log = this.chatLogs[i];
      if (log.action === 'label') {
        if (log.number === nb) {
          return i;
        }
      }
    }
    return -1;
  }

  logout() {
    this.afAuth.signOut().then(() => this.navCtrl.navigateRoot(['/login']));
  }

  haveChat(chatName: string): boolean {
    for (let i = 0; i < this.bookStory.length; i++) {
      const chat = this.bookStory[i];
      if (chat.name === chatName) {
        return true;
      }
    }
    return false;
  }

  getChatIdByName(chatName: string) {
    for (let i = 0; i < this.bookStory.length; i++) {
      const chat = this.bookStory[i];
      if (chat.name === chatName) {
        return chat.id;
      }
    }
    return this.curChat;
  }

  uploadFile(type: string, file: any, id= this.userId) {
    let path = '';
    if (type == 'userAvatar') {
      path = 'users/'+ id +'/avatar.png';
    }
    if (type === 'cover') {
      path = 'books/'+ id +'/cover.png';
    }
    this.firestorage.ref(path).putString(file, 'data_url').then( () => {
      if (type === 'userAvatar') {
        this.firestorage.ref(path).getDownloadURL().subscribe((ref) => {
          this.firestore.collection('users').doc(id).update({avatar: ref});
        });
      }
      if (type === 'cover') {
        this.firestorage.ref(path).getDownloadURL().subscribe((ref) => {
          if (!this.book.ref.includes('cover.png')) {
            const refWithCover: any[] = this.book.ref;
            refWithCover.push('cover.png');
            this.firestore.collection('books').doc(id).update({ref: refWithCover});
          }
          this.firestore.collection('books').doc(id).update({cover: ref});
        });
      }
    }
    );
  }

  publishBook() {
    this.firestore.collection('/books').doc(this.curBookId).update({public: true});
  }

  unpublishBook() {
    this.firestore.collection('/books').doc(this.curBookId).update({public: false});
  }

  search(filter: string): any[] {
    const res = [];
    this.firestore.collection('books', ref => ref.where('public', '==', true).where('lang', '==', this.userData.lang).orderBy('titleLower').startAt(filter.toLowerCase()).endAt(filter.toLowerCase()+'\uf8ff')).get().subscribe((data) => {
      data.docs.forEach((doc) => {
        res.push(doc.data());
      });
    });
    const filterArray = filter.split(' ');
    this.firestore.collection('books', ref => ref.where('public', '==', true).where('lang', '==', this.userData.lang).where('tags', 'array-contains-any', filterArray)).get().subscribe((data) => {
      data.docs.forEach((doc) => {
        res.push(doc.data());
      });
    });
    return res;
  }

  getCategory(category) {
    const res = [];
    this.firestore.collection('books', ref => ref.where('public', '==', true).where('lang', '==', this.userData.lang).where('cat', '==', category).orderBy('view', 'desc')).get().subscribe((data) => {
      data.docs.forEach((doc) => {
        res.push(doc.data());
      });
      if (res.length === 0) {
        this.toast('catégorie vide pour le moment');
      }
    });
    return res;
  }

  getMostVue(lang = this.userData.lang) {
    const res = [];
    this.firestore.collection('books', ref => ref.where('public', '==', true).where('lang', '==', lang).orderBy('view', 'desc')).get().subscribe((data) => {
      data.docs.forEach((doc) => {
        res.push(doc.data());
      });
    });
    return res;
  }

  openCover(bookJSON) {
    this.book = bookJSON;
    this.book.stars = bookJSON.star / Math.max(bookJSON.vote, 1);
    this.book.starsArray = new Array(Math.round(this.book.stars));
    this.navCtrl.navigateForward('cover');
  }

  play(id = this.curBookId) {
    this.curBookId = id;
    this.navCtrl.navigateForward('/game');
  }

  getUserById(userId): Observable<any> {
    return this.firestore.collection('users').doc(userId).get();
  }

  getBookById(bookId): Observable<any> {
    return this.firestore.collection('books').doc(bookId).get();
  }

  addComment(comment, bookId, commented= false, lastRate= 0) {
    if (commented) {
      this.firestore.collection('books').doc(bookId).update({
        star: this.book.star + comment.rate - lastRate,
      });
    } else {
      this.firestore.collection('books').doc(bookId).update({
        vote: this.book.vote + 1,
        star: this.book.star + comment.rate,
      });
    }
    this.firestore.collection('books').doc(bookId).collection('comments').doc(this.userId).set(comment);
  }

  deleteComment(bookId) {
    this.firestore.collection('books').doc(bookId).collection('comments').doc(this.userId).delete();
  }

  syncComments(bookId) {
    this.commentsSub = this.firestore.collection('books').doc(bookId).collection('comments').valueChanges().subscribe((value) => {
      this.comments = value;
    });
  }

  unsyncComments() {
    this.commentsSub.unsubscribe();
  }

  haveCommented(bookId = this.curBookId): Observable<any> {
    return this.firestore.collection('books').doc(bookId).collection('comments', ref => ref.where('userId', '==', this.userId )).get();
  }

  updateUserData(data: {}) {
    this.firestore.collection('users').doc(this.userId).update(data);
  }

  addToList(bookId) {
    const list = this.userData.list;
    list.push(bookId);
    this.firestore.collection('users').doc(this.userId).update({list});
  }

  removeFromList(bookId) {
    const list: any[] = this.userData.list;
    const index = list.indexOf(bookId);
    if (index > -1) {
      list.splice(index, 1);
    }
    this.firestore.collection('users').doc(this.userId).update({list}).then(
      () => this.refreshList()
    );
  }

  haveFromList(bookId) {
    const list: any[] = this.userData.list;
    const index = list.indexOf(bookId);
    if (index > -1) {
      return true;
    } else {
      return false;
    }
  }

  sendNotif(type, userId, bookId = this.curBookId) {
    const id = this.firestore.createId();
    if (['invBook', 'acceptedInvBook'].includes(type)) {
      this.firestore.collection('users').doc(userId).collection('notifs').doc(id).set({id, type, user: this.userId, book: this.curBookId});
    }
  }

  inviteBook(userId, bookId = this.curBookId) {
    this.sendNotif('invBook', userId, bookId);
  }

  acceptInvitation(userId, bookId) {
    const bookList = this.userData.book;
    bookList.push(bookId);
    this.firestore.collection('users').doc(this.userId).update({book: bookList});
    this.sendNotif('acceptedInvBook', userId, bookId);
    this.firestore.collection('books').doc(bookId).get().subscribe((data) => {
      const book = data.data();
      const authors = book.authors;
      authors.push(this.userId);
      this.firestore.collection('books').doc(bookId).update({authors});
    });
  }

  eraseNotif(index) {
    this.firestore.collection('users').doc(this.userId).collection('notifs').doc(index).delete();
  }

  getUsersByName(userName): Observable<any> {
    return this.firestore.collection('users', ref => ref.where('name', '==', userName)).get();
  }

}

