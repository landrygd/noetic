import { Injectable } from '@angular/core';
import { Observable, Subscription, merge } from 'rxjs';
import { NavController, Platform } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreCollection, AngularFirestoreDocument, DocumentChangeAction } from '@angular/fire/firestore/public_api';
import { PopupService } from './popup.service';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  curUser: Observable<unknown>;
  curUserId: string;
  connected = false;

  userId: string;
  user: Observable<unknown>;
  books: any[] = [];
  bookSub: Subscription;
  list: any[] = [];
  listSub: Subscription;
  userData: any;
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

  usersCollection: AngularFirestoreCollection<any>;
  userDoc: AngularFirestoreDocument;

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
    ) {
    this.usersCollection = this.firestore.collection('users');
  }

  async syncUserData(userId: string) {
    this.userId = userId;
    this.user = this.getUser();
    this.userDoc = this.usersCollection.doc(this.userId);
    await this.popupService.loading('Synchronisation...', 'sync');
    this.userSub = this.firestore.collection('users').doc(this.userId).valueChanges().subscribe((value) => {
      if (value) {
        this.userData = value;
        if (!this.connected) {
          this.connected = true;
          this.popupService.loadingDismiss('sync');
          this.getBooks();
          this.getList();
          this.getSaves();
          this.syncNotifs();
          this.getFollowList();
        }
        if (this.userData.first) {
          this.navCtrl.navigateRoot('presentation');
          this.firestore.collection('/users').doc(this.userId).update({first: firebase.firestore.FieldValue.delete()});
        }
      } else {
        setTimeout(() => {
          if (!this.userData && !this.userSub.closed) {
            this.popupService.loadingDismiss('sync');
            this.popupService.alert('Erreur de synchronisation');
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
          this.curUser = this.getUser(curUserId);
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
      this.curUserBooksSub = this.usersCollection.doc(userId).collection('books').snapshotChanges().subscribe((val) => {
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
                    .where('lang', '==', this.userData.lang).orderBy('date', 'desc').limit(10)
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

  getUser(curUserId: string = this.userId): Observable<unknown> {
    return this.usersCollection.doc(curUserId).valueChanges();
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
          this.popupService.alert('Utilisateur inexistant');
          reject();
        });
      } else {
        await this.popupService.toast('c\'est votre propre profil!');
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
      } else {
        this.popupService.toast('Vous ne pouvez pas vous suivre vous-même');
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
    this.popupService.toast('Lecture sauvegardée');
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
    const userURL = 'https://app.noetic.site';
    this.share('Voici mon profil sur Noetic: ', 'Partage de profil', userURL);
  }

  shareApp() {
    let userURL: string;
    if (!this.plt.is('cordova')) {
      userURL = 'https://app.noetic.site';
    } else {
      userURL = 'https://play.google.com/store/apps/details?id=com.blockup.noetic';
    }
    this.share(
      'Voici Noetic, une appli pour créer ses propres histoires sous forme de chats ', 'Noetic, une app pour créer des histoires', userURL);
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
      this.popupService.toast('Lien copié dans le presse papier');
    } else {
      this.popupService.loading();
      this.socialSharing.share(msg, subject, [], url)
        .catch((err) => this.popupService.error(err))
        .finally(() => this.popupService.loadingDismiss());
    }
  }

  async report(type: string, id: string = '') {
    let header = 'Signaler un problème';
    if (type === 'user') {
      header = 'Signaler un utilisateur';
    } else if (type === 'book') {
      header = 'Signaler un livre';
    }
    const alert = await this.popupService.alertObj({
      header,
      message: 'Nous ferons de notre mieux pour le corriger dans les plus brefs délais. Tout spams est sanctionnable de bannissement.',
      inputs: [
        {
          name: 'msg',
          type: 'textarea',
          placeholder: 'Votre problème'
        }
      ],
      buttons: [
        'Annuler',
        {
          text: 'Envoyer',
          handler: (data) => {
            if (this.connected) {
              if (type === 'app') {
                this.firestore.collection('reports').add({type: 'app', from: this.userId, msg: data.msg});
              } else if (type === 'user') {
                this.firestore.collection('reports').add({type: 'user', from: this.userId, msg: data.msg, toUser: id});
              } else if (type === 'book') {
                this.firestore.collection('reports').add({type: 'book', from: this.userId, msg: data.msg, toBook: id});
              }
              this.popupService.toast('Report envoyé');
            } else {
              this.popupService.error('Vous devez vous connecter pour signaler un problème.');
            }
          }
        }
      ],
    });
  }
}
