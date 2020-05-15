import { Injectable } from '@angular/core';
import { Observable, Subscription, merge } from 'rxjs';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreCollection, AngularFirestoreDocument, DocumentChangeAction } from '@angular/fire/firestore/public_api';
import { PopupService } from './popup.service';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';

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

  usersCollection: AngularFirestoreCollection<any>;
  userDoc: AngularFirestoreDocument;

  constructor(
    private firestore: AngularFirestore,
    private firestorage: AngularFireStorage,

    private navCtrl: NavController,
    private popupService: PopupService,
    private fireauth: AngularFireAuth,
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
          this.navCtrl.navigateBack(['/']);
          this.popupService.toast('Bonjour ' + this.userData.name, 'middle');
          this.popupService.loadingDismiss('sync');
          this.getBooks();
          this.getList();
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
    this.bookSub.unsubscribe();
    this.listSub.unsubscribe();
    this.followListSub.unsubscribe();
    this.userNotifsSub.unsubscribe();
    this.connected = false;
    this.fireauth.signOut().then(() => this.navCtrl.navigateForward(['/login'])).catch((err) => this.popupService.error(err));
  }

  setCurUser(curUserId: string = this.userId): void {
    this.curUserId = curUserId;
    if (this.isOwnProfile()) {
      this.curUser = this.user;
    } else {
      this.curUser = this.getUser(curUserId);
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
    for (const notif of this.userNotifs) {
      if (!notif.read) {
        return true;
      }
    }
    return false;
  }

  getUserBooks(userId) {
    this.curUserBooksSub = this.usersCollection.doc(userId).collection('books').snapshotChanges().subscribe((val) => {
      const res = [];
      val.forEach(doc => {
        res.push(doc.payload.doc.id);
      });
      this.curUserBooks = res;
    });
  }

  getBooks() {
    this.bookSub = this.userDoc.collection('books').snapshotChanges().subscribe((val) => {
      const res = [];
      val.forEach(doc => {
        res.push(doc.payload.doc.id);
      });
      this.books = res;
    });
  }

  getList() {
    this.listSub = this.userDoc.collection('list').snapshotChanges().subscribe((val) => {
      const res = [];
      val.forEach(doc => {
        res.push(doc.payload.doc.id);
      });
      this.list = res;
    });
  }

  async getFollowList() {
    this.followListSub = this.getFollows(this.userId).subscribe((value) => {
      const follows = [];
      value.forEach(user => follows.push(user.payload.doc.id));
      const listTen = []; // Listes de liste de 10 user Id max;
      let subList = [];
      let cpt = 0;
      console.log(follows);
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
      console.log(listTen);
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
    console.log(filter);
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

  // syncFollowBooks() {
  //   this.followSub = this.userDoc.collection('list').snapshotChanges().subscribe((val) => {
  //     const res = [];
  //     val.forEach(doc => {
  //       res.push(doc.payload.doc.id);
  //     });
  //     this.list = res;
  //   });
  //   return this.firestore.collection(
  //     'books', ref => {ref.where('public', '==', true); ref.where('public', '==', true).where('lang', '==', lang).orderBy('views', 'desc').limit(10)}
  //     ).valueChanges();
  // }

  openUser(curUserId: string) {
    if (curUserId  !== this.userId) {
      this.setCurUser(curUserId);
      this.getUserBooks(curUserId);
      this.navCtrl.navigateForward('profile');

    } else {
      this.popupService.toast('c\'est votre propre profil!');
    }
  }

  updateUserData(data, curUserId: string = this.userId) {
    this.usersCollection.doc(curUserId).update(data);
  }

  followUser(curUserId: string = this.curUserId) {
    this.usersCollection.doc(this.userId).collection('follows').doc(curUserId).set({});
    this.usersCollection.doc(curUserId).collection('followers').doc(this.userId).set({});
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
    this.userDoc.collection('books').doc(bookId).set({});
  }

  deleteBookRef(bookId) {
    this.userDoc.collection('books').doc(bookId).delete();
  }

  addBookListRef(bookId) {
    this.userDoc.collection('list').doc(bookId).set({});
  }

  deleteBookListRef(bookId) {
    this.userDoc.collection('list').doc(bookId).delete();
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
}
