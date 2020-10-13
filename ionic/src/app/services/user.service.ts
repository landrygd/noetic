import { User } from './../classes/user';
import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NavController, Platform, AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreCollection, AngularFirestoreDocument, DocumentChangeAction } from '@angular/fire/firestore/public_api';
import { PopupService } from './popup.service';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { TraductionService } from './traductionService.service';
import { TranslateService } from '@ngx-translate/core';
import { Book } from '../classes/book';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {

  curUser: Observable<unknown>;
  curUserId: string;
  connected = false;

  mostVueSub: Subscription;
  topRatedSub: Subscription;
  mostRecentSub: Subscription;

  userId: string;
  user: Observable<unknown>;
  books: any[] = [];
  bookSub: Subscription;
  list: any[] = [];
  listSub: Subscription;
  userData: User;
  lang: string;
  userNotifs: any[];
  userNotifsSub: Subscription;
  unreadNotif = false;

  followListSub: Subscription;
  followList: any[] = [];

  userSub: Subscription;

  curUserBooksSub: Subscription;
  curUserBooks: any[] = [];

  saves: DocumentChangeAction<firebase.firestore.DocumentData>[] = [];
  savesId: string[] = [];
  savesSub: Subscription;

  likes: any[];

  usersCollection: AngularFirestoreCollection<any>;
  userDoc: AngularFirestoreDocument;

  mostVueBooks: Book[] = [];
  topRatedBooks: any[] = [];
  mostRecentBooks: any[] = [];

  userTradSub: Subscription;
  commonSub: Subscription;
  languagesTradSub: Subscription;
  USER: any;
  COMMON: any;
  LANGUAGES: any;
  languages: any[];
  tradLanguages: any[];
  langs: readonly string[];

  defaultAvatarURL = 'https://firebasestorage.googleapis.com/v0/b/noetic-app.appspot.com/o/lib%2Favatars%2Fdefault.png' +
                     '?alt=media&token=49f967d6-cedb-4b22-9b14-9a2539606c38';

  constructor(
    private firestore: AngularFirestore,
    private firestorage: AngularFireStorage,

    private navCtrl: NavController,
    private popupService: PopupService,
    private fireauth: AngularFireAuth,
    private socialSharing: SocialSharing,
    private plt: Platform,
    private alertController: AlertController,
    private traductionService: TraductionService,
    private translator: TranslateService
    ) {
      this.usersCollection = this.firestore.collection('users');
      this.getTraduction();
  }

  async getTraduction() {
    this.userTradSub = this.translator.get('SERVICES.USER').subscribe((val) => {
      this.USER = val;
    });
    this.languagesTradSub = this.traductionService.translator.get('LANGUAGES').subscribe((val) => {
      this.LANGUAGES = val;
      this.languages = [
        {
          name: this.LANGUAGES.french,
          value: 'fr'
        },
        {
          name: this.LANGUAGES.english,
          value: 'en'
        },
        {
          name: this.LANGUAGES.spanish,
          value: 'es'
        },
        {
          name: this.LANGUAGES.german,
          value: 'de'
        },
        {
          name: this.LANGUAGES.chinese,
          value: 'zh'
        },
        {
          name: this.LANGUAGES.arabic,
          value: 'ar'
        },
        {
          name: this.LANGUAGES.portugese,
          value: 'pt'
        },
        {
          name: this.LANGUAGES.russian,
          value: 'ru'
        },
        {
          name: this.LANGUAGES.hindi,
          value: 'hi'
        },
        {
          name: this.LANGUAGES.swahili,
          value: 'sw'
        }
      ];
      this.tradLanguages = [
        {
          name: this.LANGUAGES.french,
          value: 'fr'
        },
        {
          name: this.LANGUAGES.english,
          value: 'en'
        },
        {
          name: this.LANGUAGES.spanish,
          value: 'es'
        },
        {
          name: this.LANGUAGES.german,
          value: 'de'
        },
        {
          name: this.LANGUAGES.chinese,
          value: 'zh'
        },
        {
          name: this.LANGUAGES.arabic,
          value: 'ar'
        },
        {
          name: this.LANGUAGES.portugese,
          value: 'pt'
        },
        {
          name: this.LANGUAGES.russian,
          value: 'ru'
        },
        {
          name: this.LANGUAGES.hindi,
          value: 'hi'
        },
        {
          name: this.LANGUAGES.swahili,
          value: 'sw'
        }
      ];
    });

    this.commonSub = this.translator.get('COMMON').subscribe((val) => {
      this.COMMON = val;
    });
  }

  ngOnDestroy() {
    this.languagesTradSub.unsubscribe();
    this.userTradSub.unsubscribe();
    this.commonSub.unsubscribe();
  }

  async syncDisconnectedCase() {
    this.lang = await this.traductionService.getLanguage();
    this.langs = await this.traductionService.getLanguages();
    this.getMenuBooks();
  }

  async syncUserData(userId: string) {
    this.userId = userId;
    this.user = this.getAsyncUser();
    this.userDoc = this.usersCollection.doc(this.userId);
    // await this.popupService.loading(this.COMMON.loading, 'sync');
    this.userSub = this.firestore.collection('users').doc(this.userId).valueChanges().subscribe((value: any) => {
      if (value) {
        this.userData = new User(value);
        if (!this.connected) {
          this.connected = true;
          // this.popupService.loadingDismiss('sync');
          this.lang = this.userData.lang;
          this.langs = this.userData.searchlangs;
          this.traductionService.setLanguage(this.lang);
          this.getMenuBooks();
          this.getBooks();
          this.getList();
          this.getLikes();
          this.getSaves();
          this.syncNotifs();
          this.getFollowList();
          // MAJ liste des langues de recherche
          if (!this.userData.searchlangs) {
            this.updateUserData({searchlangs: [this.lang]});
          }
        }
        if (this.userData.first) {
          this.navCtrl.navigateRoot('presentation');
          this.firestore.collection('/users').doc(this.userId).update({first: firebase.firestore.FieldValue.delete()});
        }
      } else {
        setTimeout(() => {
          if (!this.userData && !this.userSub.closed) {
            this.popupService.loadingDismiss('sync');
            this.popupService.alert(this.USER.syncError);
            this.logout();
          }
        }, 3000);
      }
    });
  }

  logout() {
    this.userSub.unsubscribe();
    this.savesSub.unsubscribe();
    this.bookSub.unsubscribe();
    this.listSub.unsubscribe();
    this.followListSub.unsubscribe();
    this.userNotifsSub.unsubscribe();
    this.connected = false;
    this.fireauth.signOut().then(() => this.navCtrl.navigateForward(['/login'])).catch((err) => this.popupService.error(err));
  }

  setCurUser(curUserId: string = this.userId): Promise<unknown> {
    return new Promise<unknown>((resolve, reject) => {
      this.curUserId = curUserId;
      if (this.isOwnProfile()) {
        this.curUser = this.user;
        resolve();
      } else {
        this.checkUserExist(curUserId).then(() => {
          this.curUser = this.getAsyncUser(curUserId);
          resolve();
        }).catch(() => reject());
      }
    });
  }

  checkUserExist(userId: string): Promise<unknown> {
    return new Promise<unknown>((resolve, reject) => {
      const userSub = this.firestore.collection('users', ref => ref.where('id', '==', userId)).get().subscribe(docs => {
        userSub.unsubscribe();
        if (docs.size === 0) {
          reject();
        } else {
          resolve();
        }
      });
    });
  }

  syncNotifs() {
    this.userNotifs = [];
    this.userNotifsSub = this.firestore.collection('users').doc(this.userId).collection('notifs').valueChanges().subscribe((value) => {
      this.userNotifs = value;
      this.unreadNotif = this.haveUnreadNotif();
    });
  }

  haveUnreadNotif() {
    for (const notif of this.userNotifs) {
      if (!notif.read) {
        return true;
      }
    }
    return false;
  }

  getUserBooks(userId): Promise<unknown> {
    return new Promise<unknown>(resolve => {
      this.curUserBooksSub = this.usersCollection.doc(userId)
      .collection('books', ref => ref.where('public', '==', true))
      .snapshotChanges().subscribe((val) => {
        const res = [];
        val.forEach(doc => {
          res.push(doc.payload.doc.id);
        });
        this.curUserBooks = res;
        resolve();
      });
    });
  }

  getBooks() {
    this.bookSub = this.userDoc.collection('books', ref => ref.orderBy('lastChanges', 'desc')).snapshotChanges().subscribe((val) => {
      const res = [];
      val.forEach(doc => {
        res.push(doc.payload.doc.id);
      });
      this.books = res;
    });
  }

  getLikes() {
    this.bookSub = this.userDoc.collection('likes', ref => ref.orderBy('lastChanges', 'desc')).snapshotChanges().subscribe((val) => {
      const res = [];
      val.forEach(doc => {
        res.push(doc.payload.doc.id);
      });
      this.likes = res;
    });
  }

  getList() {
    this.listSub = this.userDoc.collection('list', ref => ref.orderBy('lastChanges', 'desc')).snapshotChanges().subscribe((val) => {
      const res = [];
      val.forEach(doc => {
        res.push(doc.payload.doc.id);
      });
      this.list = res;
    });
  }

  getSaves() {
    this.savesSub = this.userDoc.collection('saves', ref => ref.orderBy('lastChanges', 'desc')).snapshotChanges().subscribe((val) => {
      const res = [];
      val.forEach(doc => {
        res.push(doc.payload.doc.id);
      });
      this.savesId = res;
      this.saves = val;
    });
  }

  async getFollowList() {
    this.followListSub = this.getFollows(this.userId).subscribe((value) => {
      const follows = [];
      value.forEach(user => follows.push(user.payload.doc.id));
      const listTen = []; // Listes de liste de 10 user Id max;
      let subList = [];
      let cpt = 0;
      // création de liste Ten
      for (const userId of follows) {
        subList.push(userId);
        cpt ++;
        if (cpt >= 10) {
          listTen.push(subList);
          subList = [];
          cpt = 0;
        }
      }
      if (subList.length !== 0) {
        listTen.push(subList);
      }
      // On fusionne les observables
      let res = [];
      for (const sub of listTen) {
        const orb = this.firestore.collection('books',
          ref => ref.where('authors', 'array-contains-any', sub).where('public', '==', true)
                    .where('', '==', this.userData.lang).orderBy('date', 'desc').limit(10)
        ).valueChanges().subscribe((books) => {
          books.forEach((book) => res.push(book));
        });
      }
      // Trie des livre par date
      res.sort((a, b) => parseFloat(b.date) - parseFloat(a.date));
      if (res.length > 10) {
        res = res.slice(0, 10);
      }
      this.followList = res;
    });
  }

  getBookList(): Observable<any> {
    return this.userDoc.collection('list').valueChanges();
  }

  getAsyncUser(userId: string = this.userId): Observable<unknown> {
    return this.usersCollection.doc(userId).valueChanges();
  }

  async getUser(userId: string): Promise<User> {
    return new User((await this.usersCollection.doc(userId).get().toPromise()).data());
  }

  async getUsers(usersId: string[]): Promise<User[]> {
    usersId = usersId.slice(0, 10);
    const users: User[] = [];
    await this.firestore.collection('users', ref => ref.where('id', 'in', usersId)).get().toPromise().then((collection) => {
      collection.docs.forEach((doc: any) => {
        users.push(new User(doc.data()));
      });
    });
    return users;
  }

  searchUser(filter: string): Observable<any> {
    const queryByName = this.firestore.collection(
       'users', ref => ref.orderBy('nameLower')
                          .startAt(filter.toLowerCase())
                          .endAt(filter.toLowerCase() + '\uf8ff')
      ).valueChanges();
    return queryByName;
  }

  isOwnProfile(curUserId = this.curUserId) {
    return curUserId === this.userId;
  }

  async openUser(curUserId: string): Promise<unknown> {
    return new Promise(async (resolve, reject) => {
      if (curUserId  !== this.userId) {
        this.setCurUser(curUserId).then(async () => {
          await this.getUserBooks(curUserId);
          resolve();
        }).catch(() => {
          this.popupService.alert(this.USER.userNotFoundError);
          reject();
        });
      } else {
        await this.popupService.toast(this.USER.ownProfileError);
        return resolve();
      }
    });
  }

  updateUserData(data, curUserId: string = this.userId) {
    this.usersCollection.doc(curUserId).update(data);
  }

  followUser(curUserId: string = this.curUserId) {
    if (this.connected) {
      if (curUserId !== this.userId) {
        this.usersCollection.doc(this.userId).collection('follows').doc(curUserId).set({});
        this.usersCollection.doc(curUserId).collection('followers').doc(this.userId).set({});
      }
    } else {
      this.navCtrl.navigateForward('login');
    }
  }

  unfollowUser(curUserId: string = this.curUserId) {
    this.usersCollection.doc(this.userId).collection('follows').doc(curUserId).delete();
    this.usersCollection.doc(curUserId).collection('followers').doc(this.userId).delete();
  }

  getFollows(curUserId: string = this.curUserId): Observable<DocumentChangeAction<firebase.firestore.DocumentData>[]> {
    return this.usersCollection.doc(curUserId).collection('follows').snapshotChanges();
  }

  getFollowers(curUserId: string = this.curUserId): Observable<DocumentChangeAction<firebase.firestore.DocumentData>[]> {
    return this.usersCollection.doc(curUserId).collection('followers').snapshotChanges();
  }

  isFollow(curUserId: string): Promise<boolean> {
    return new Promise(resolve => {
      this.usersCollection.doc(this.userId).collection('follows').get().subscribe((data) => {
        data.forEach((doc) => {
          if (doc.id === curUserId) {
            resolve(true);
          }
        });
        resolve(false);
      }).unsubscribe();
    });
  }

  addBookRef(bookId) {
    this.userDoc.collection('books').doc(bookId).set({lastChanges: Date.now()});
  }

  deleteBookRef(bookId) {
    this.userDoc.collection('books').doc(bookId).delete();
  }

  addBookListRef(bookId) {
    this.userDoc.collection('list').doc(bookId).set({lastChanges: Date.now()});
  }

  deleteBookListRef(bookId) {
    this.userDoc.collection('list').doc(bookId).delete();
  }

  async addSave(bookId: string, data: any) {
    await this.userDoc.collection('saves').doc(bookId).set(data);
    this.popupService.toast(this.USER.readingSaved);
  }

  loadSave(bookId: string): Promise<any> {
    return new Promise(res => {
      this.saves.forEach(save => {
        const doc = save.payload.doc;
        if (doc.id === bookId) {
          res(doc.data());
        }
      });
    });
  }

  async deleteSave(bookId): Promise<any> {
    await this.userDoc.collection('saves').doc(bookId).delete();
    return new Promise((res) => res());
  }

  haveSave(bookId) {
    return this.savesId.includes(bookId);
  }

  uploadAvatar(file) {
    const path = 'users/' + this.userId + '/avatar.png';
    this.firestorage.ref(path).putString(file, 'data_url').then( () => {
      this.firestorage.ref(path).getDownloadURL().subscribe((ref) => {
        this.firestore.collection('users').doc(this.userId).update({avatar: ref});
      });
    }).catch((err) => this.popupService.error(err));
  }

  // addToList(bookId) {
  //   const list = this.userData.list;
  //   list.push(bookId);
  //   this.firestore.collection('users').doc(this.userId).update({list});
  // }

  // removeFromList(bookId) {
  //   const list: any[] = this.userData.list;
  //   const index = list.indexOf(bookId);
  //   if (index > -1) {
  //     list.splice(index, 1);
  //   }
  //   this.firestore.collection('users').doc(this.userId).update({list});
  // }

  haveFromList(bookId) {
    const list: any[] = this.list;
    const index = list.indexOf(bookId);
    if (index > -1) {
      return true;
    } else {
      return false;
    }
  }

  // getUsersByName(userName): Observable<any> {
  //   return this.firestore.collection('users', ref => ref.where('name', '==', userName)).get();
  // }

  getAvatar(userId: string) {
    const path = 'users/' + userId + '/avatar.png';
    return this.firestorage.ref(path).getDownloadURL();
  }

  shareUser(userId: string) {
    const userURL = 'https://app.noetic.site/user/' + userId;
    this.share(this.USER.shareProfileMsg, this.USER.shareProfileSubject, userURL);
  }

  shareApp() {
    let userURL: string;
    if (!this.plt.is('cordova')) {
      userURL = 'https://app.noetic.site';
    } else {
      userURL = 'https://play.google.com/store/apps/details?id=com.blockup.noetic';
    }
    this.share(
      this.USER.shareAppMsg, this.USER.shareAppSubject, userURL);
  }

  haveTuto(): boolean {
    return this.userData.tuto;
  }

  async addTuto() {
    await this.firestore.collection('users').doc(this.userId).update({tuto: true});
  }

  async deleteTuto() {
    await this.firestore.collection('users').doc(this.userId).update({tuto: firebase.firestore.FieldValue.delete()});
  }

  share(msg: string, subject: string, url: string, ) {
    if (!this.plt.is('cordova')) {
      const selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = url;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      this.popupService.toast(this.USER.copiedLink);
    } else {
      this.popupService.loading();
      this.socialSharing.share(msg, subject, [], url)
        .catch((err) => this.popupService.error(err))
        .finally(() => this.popupService.loadingDismiss());
    }
  }

  async report(type: string, id: string = '') {
    let header = this.USER.report;
    if (type === 'user') {
      header = this.USER.reportUser;
    } else if (type === 'book') {
      header = this.USER.reportBook;
    }
    const alert = await this.popupService.alertObj({
      header,
      message: this.USER.reportMsg,
      inputs: [
        {
          name: 'msg',
          type: 'textarea',
          placeholder: this.USER.reportPlaceholder
        }
      ],
      buttons: [
        this.COMMON.cancel,
        {
          text: this.COMMON.send,
          handler: (data) => {
            if (this.connected) {
              if (type === 'app') {
                this.firestore.collection('reports').add({type: 'app', from: this.userId, msg: data.msg});
              } else if (type === 'user') {
                this.firestore.collection('reports').add({type: 'user', from: this.userId, msg: data.msg, toUser: id});
              } else if (type === 'book') {
                this.firestore.collection('reports').add({type: 'book', from: this.userId, msg: data.msg, toBook: id});
              }
              this.popupService.toast(this.USER.reportSent);
            }
          }
        }
      ],
    });
  }

  selectLanguages(type = 'checkbox'): Promise<string[]> {
    return new Promise(async (res) => {
      let inputs: any;
      if (type === 'checkbox') {
        inputs = this.languages;
      }
      if (type === 'radio') {
        inputs = this.tradLanguages;
      }
      inputs.forEach(lang => {
        lang.type = type;
        lang.label = lang.name;
        if (type === 'checkbox') {
          lang.checked = false;
          if (this.userData.searchlangs.includes(lang.value)) {
            lang.checked = true;
          }
        }
        if (type === 'radio') {
          lang.checked = false;
          if (this.userData.lang === lang.value) {
            lang.checked = true;
          }
        }
      });
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: this.USER.avaibleLanguages,
        inputs,
        buttons: [
          {
            text: this.COMMON.cancel,
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {}
          }, {
            text: this.COMMON.ok,
            handler: (data) => {
              if (data.length <= 10) {
                res(data);
              } else {
                res(this.userData.searchlangs);
                this.popupService.toast(this.USER.languagesMax);
              }
            }
          }
        ]
      });
      await alert.present();

    });
  }

  async chooseSpeakingLanguages() {
    const searchlangs = await this.selectLanguages();
    this.firestore.collection('users').doc(this.userId).update({searchlangs});
  }

  async chooseAppLanguage() {
    const lang = await this.selectLanguages('radio');
    this.firestore.collection('users').doc(this.userId).update({lang});
    this.traductionService.setLanguage(lang);
  }

  alertRestart() {
    this.popupService.alert(this.USER.restartApp);
  }

  async getMenuBooks() {
    if (this.mostRecentSub) {
      if (!this.mostRecentSub.closed) {
        this.mostRecentSub.unsubscribe();
        this.mostVueSub.unsubscribe();
        this.topRatedSub.unsubscribe();
      }
    }
    // await this.getTopRated();
    // await this.getMostVue();
    // await this.getMostRecent();
  }

  // async getMostVue(): Promise<any> {
  //   return new Promise(res => {
  //     this.mostVueSub = this.firestore.collection(
  //     'books', ref => ref.where('public', '==', true).where('lang', 'in', this.langs).orderBy('views', 'desc').limit(20)
  //     ).valueChanges().subscribe((values) => {
  //       this.mostVueBooks = [];
  //       values.forEach((val) => {
  //         this.mostVueBooks.push(new Book(val));
  //       });
  //       res();
  //     });
  //   });
  // }

  // async getTopRated(): Promise<any> {
  //   return new Promise(res => {
  //     this.topRatedSub = this.firestore.collection(
  //     'books', ref => ref.where('public', '==', true).where('lang', 'in', this.langs).orderBy('likes', 'desc').limit(20)
  //     ).valueChanges().subscribe((val) => {
  //       this.topRatedBooks = val;
  //       res();
  //     });
  //   });
  // }

  // async getMostRecent(): Promise<any> {
  //   return new Promise(res => {
  //     this.mostRecentSub = this.firestore.collection(
  //     'books', ref => ref.where('public', '==', true).where('lang', 'in', this.langs).orderBy('date', 'desc').limit(20)
  //     ).valueChanges().subscribe((val) => {
  //       this.mostRecentBooks = val;
  //       res();
  //     });
  //   });
  // }

  uploadBanner(file, userId = this.curUserId): Promise<void> {
    return new Promise((resolve, reject) => {
      const path = 'users/' + userId + '/banner.png';
      this.firestorage.ref(path).putString(file, 'data_url').then(async () => {
        const ref = await this.firestorage.ref(path).getDownloadURL().toPromise();
        await this.firestore.collection('users').doc(userId).update({banner: ref});
        resolve();
      }).catch((err) => {
        this.popupService.error(err);
        reject();
      });
    });
  }
}
