import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController, NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription, Observable } from 'rxjs';
import { Game } from '../classes/game';
import { AngularFireDatabase } from '@angular/fire/database';

export interface User { 
  book: any []; 
  credit: number;
  follow: number; 
  lib: any []; 
  name: string
}

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {

  userId: string;
  mail: string;
  method: any;
  connected: boolean = false;
  userData: any;
  userBooks: any [];
  curBookId: string = 'none';
  curChat: string;
  curGame: string;
  book: any;
  bookStory: any[];
  bookActor: any[];
  bookPlace: any[];
  chatLogs: any[];

  bookSub: Subscription;
  bookStorySub: Subscription;
  bookActorSub: Subscription;
  bookPlaceSub: Subscription;
  chatLogsSub: Subscription;

  constructor(
    private toastController: ToastController, 
    public navCtrl: NavController,
    private firestore: AngularFirestore, 
    public afAuth: AngularFireAuth, 
    public firerealtime: AngularFireDatabase,
  ) {
    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        this.presentToast('non connecté');
        this.connected = false;
      } else {
        this.presentToast('connecté: ' + auth.uid);
        this.userId = auth.uid;
        this.mail = auth.email;
        this.method = auth.providerData[0].providerId;
        this.connected = true;
        
        this.syncUserData();
        this.navCtrl.navigateRoot(['/']);
      }
    });
  }

  syncUserData() {
    this.firestore.collection('users').doc(this.userId).valueChanges().subscribe((value) => {
      this.userData = value;
      this.syncBooks();
    });
  }

  syncBooks() { 
    this.firestore.collection('books', ref => ref.where('id', 'in', this.getUserData() )).valueChanges().subscribe((value) => {
      this.userBooks = value;
    });
  }

  getUserData() {
    if (this.userData.book.length == 0) {
      return [''];
    } else {
      return this.userData.book;
    }
    
  }

  addBook(book) {
    book.id = this.firestore.createId();
    this.curBookId = book.id;
    this.addChat({name: 'main', desc: '', logs: []}, true);
    this.addActor({name: 'Narrator'});
    let bookList = this.userData.book;
    bookList.push(book.id);
    this.firestore.collection("/users").doc(this.userId).update({book: bookList});
    this.firestore.collection("/books").doc(book.id).set(book);
    this.openBook(book.id);
  }

  deleteBook(bookId = this.curBookId) {
    this.navCtrl.navigateRoot("/");
    let bookList: any [] = this.userData.book;
    bookList.splice(bookList.indexOf(bookId),1);
    this.firestore.collection("/users").doc(this.userId).update({book: bookList});
    const subCollections = ["story","actors","map"];
    this.unsyncBook()
    subCollections.forEach((subCollection) => {
      this.firestore.collection("books").doc(bookId).collection(subCollection).get().subscribe((data) => {
        data.docs.forEach((doc)=>this.firestore.collection("/books").doc(bookId).collection(subCollection).doc(doc.id).delete());
      });
    })
    this.firestore.collection("/books").doc(bookId).delete();
  }

  openBook(bookId) {
    this.curBookId = bookId;
    this.navCtrl.navigateForward(["/tabs-book"]);
    this.syncBook();
  }

  addChat(chat, main = false) {
    if(main) {
      chat.id = 'main';
    } else {
      chat.id = this.firestore.createId();
    }
    this.firestore.collection("/books").doc(this.curBookId).collection('story').doc(chat.id).set(chat).then(
      () => this.openChat(chat.id)
    );
  }

  openChat(chatId) {
    this.curChat = chatId;
    this.navCtrl.navigateForward(["/chat"]);
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
    this.chatLogsSub = this.firestore.collection('books').doc(this.curBookId).collection('story').doc(chatId).valueChanges().subscribe((value) => {
      if (value !== undefined) {
        this.chatLogs = value['logs'];
      } else {
        this.chatLogsSub.unsubscribe();
      }
    });
  }

  unsyncChat() {
    this.chatLogsSub.unsubscribe();
  }

  addActor(actor) {
    if(actor.name !== 'Narrator') {
      actor.id = this.firestore.createId();
    } else {
      actor.id = 'Narrator';
    }
    this.firestore.collection("/books").doc(this.curBookId).collection('actors').doc(actor.id).set(actor);
  }

  editChatLog (log, index = this.chatLogs.length) {
    let res = this.chatLogs;
    res.splice(index,1,log);
    this.setChatLogs(res);
  }

  addChatLog(log, index = this.chatLogs.length) {
    let res = this.chatLogs;
    res.splice(index,0,log);
    this.setChatLogs(res);
  }

  deleteChatLog(index = this.chatLogs.length) {
    let res = this.chatLogs;
    res.splice(index,1);
    this.setChatLogs(res);
  }

  deleteChat(chatId = this.curChat) {
    this.unsyncChat()
    this.firestore.collection('books').doc(this.curBookId).collection('story').doc(chatId).delete();
    this.navCtrl.navigateRoot('/tabs-book');
  }

  setChatLogs(logs) {
    this.firestore.collection('books').doc(this.curBookId).collection('story').doc(this.curChat).update({logs:logs});
  }

  async presentToast(msg) {
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
      this.errorMail();
    });
  }

  signUp(loginData) {
    this.afAuth.createUserWithEmailAndPassword(loginData.email, loginData.password)
    .then(auth => {
      const user = this.firestore.collection("/users").doc(auth.user.uid);
      user.set({name: loginData.email,
        book: [],
        lib: [],
        follow: 0,
        credit: 0
      });
    })
    .catch(err => {
      this.errorMail();
    });
  }

  newGame(game: Game, curBookId = this.curBookId) {
    const id = this.firerealtime.createPushId();
    this.curGame = id;
    this.curBookId = curBookId;
    this.syncBook();
    this.curChat = this.getFirstChat();
    this.syncChat();
    const itemRef = this.firerealtime.object('games/'+id);
    itemRef.set(game.getJson());
  }

  getFirstChat() {
    return this.book.first;
  }

  leaveGame() {
    this.unsyncBook();
    this.unsyncChat();
    this.firerealtime.object('games/'+this.curGame).remove();
  }

  async errorMail() {
    const toast = await this.toastController.create({
      message: 'Email ou mot de passe incorrect',
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  getActorById(id) {
    for(let i = 0; i < this.bookActor.length; i++) {
      const actor = this.bookActor[i];
      if(actor.id == id) {
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
    let res = [];
    this.chatLogs.forEach(element => {
      if(element.action == 'label') {
        res.push(element.number);
      }
    });
    return res;
  }

  getNewLabel(): number {
    let labels = this.getLabels();
    labels = labels.sort();
    for(let i = 0; i<labels.length; i++) {
      if(labels[i] !== i+1) {
        return i+1;
      }
    }
    return labels.length+1;
  }

  getLabelLine(number) {
    for(let i = 0; i<this.chatLogs.length; i++) {
      const log = this.chatLogs[i];
      if(log["action"] == 'label') {
        if(log['number'] == number) {
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
    for(let i = 0; i<this.bookStory.length; i++) {
      const chat = this.bookStory[i];
      if(chat.name == chatName) {
        return true;
      }
    }
    return false;
  }

  getChatIdByName(chatName: string) {
    for(let i = 0; i<this.bookStory.length; i++) {
      const chat = this.bookStory[i];
      if(chat.name == chatName) {
        return chat.id;
      }
    }
    return this.curChat;
  }


}

