import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore/public_api';
import { Observable, Subscription } from 'rxjs';
import { NavController, AlertController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/storage';
import { UserService } from './user.service';
import { PopupService } from './popup.service';
import { TranslateService } from '@ngx-translate/core';
import { Book, Script } from '../classes/book';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class BookService implements OnDestroy {
  booksCollection: AngularFirestoreCollection<any>;

  curBookId: string;
  curChatId: string;
  langs: string[];
  book: Book;
  debug = false;
  isAuthor: boolean;

  // bookSub: Subscription;
  // bookChatSub: Subscription;
  // bookActorSub: Subscription;
  // bookPlaceSub: Subscription;
  // bookItemSub: Subscription;
  // bookRoleSub: Subscription;

  // chats: any[] = [];
  // actors: any[] = [];
  // places: any[] = [];
  // items: any[] = [];
  // roles: any[] = [];

  BOOK: any;
  COMMON: any;
  ERRORS: any;
  bookTradSub: Subscription;
  commonSub: Subscription;

  script: Script;

  actorsById: any = {};
  entities: {} = {}; // by id
  // entitiesList: {
  //   id: string,
  //   name: string,
  //   type: string,
  //   roles: string[],
  //   keys: string[],
  //   color: string,
  //   pos: string,
  //   var: {
  //     type: string,
  //     value: any
  //   }[]
  // }[] = [];
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

  constructor(
    private firestore: AngularFirestore,
    private firestorage: AngularFireStorage,
    private alertController: AlertController,
    private navCtrl: NavController,
    public userService: UserService,
    private popupService: PopupService,
    private translator: TranslateService,
    private storage: Storage
  ) {
    this.booksCollection = this.firestore.collection('books');
    this.getTraduction();
  }

  getTraduction() {
    this.bookTradSub = this.translator.get('SERVICES.BOOK').subscribe((val) => {
      this.BOOK = val;
    });
    this.commonSub = this.translator.get('COMMON').subscribe((val) => {
      this.COMMON = val;
    });
    this.translator.get('ERRORS').subscribe((val) => {
      this.ERRORS = val;
    });
  }

  ngOnDestroy() {
    this.bookTradSub.unsubscribe();
    this.commonSub.unsubscribe();
  }

  getBooks(bookIdArray: any[]): Observable<any> {
    if (bookIdArray.length > 0 ) {
      return this.firestore.collection('books', ref => ref.where('id', 'in', bookIdArray)).valueChanges();
    } else {
      return new Observable<any>();
    }
  }

  generateBookId(): string {
    return this.firestore.createId();
  }

  async openBook(bookId) {
    await this.popupService.loading();
    this.curBookId = bookId;
    this.popupService.loadingDismiss();
    this.navCtrl.navigateForward('/tabs-book');
  }

  async showBook(book: Book) {
    this.book = book;
    this.isAuthor = this.book.author === this.userService.userId;
    if (this.isAuthor) {
      this.book = await this.loadBook();
    }
    this.navCtrl.navigateForward('book/' + book.id);
  }

  openScript(scriptName) {
    this.script = this.book.getScript(scriptName);
    this.navCtrl.navigateForward('chat');
  }

  // async newBook(book: Book) {
  //   await this.popupService.loading(this.COMMON.loading, 'creation');
  //   // Ajouter l'id référant dans user
  //   this.userService.addBookRef(book.id);
  //   // Créer le livre, l'ouvir et y ajouter un chat
  //   this.firestore.collection('/books').doc(book.id).set(book.getCover()).then(async () => {
  //     // Upload le cover si une image est chargée
  //     await this.navCtrl.pop().then( async () => {
  //       await this.showBook(book);
  //       await this.openBook(book.id);
  //       await this.popupService.loadingDismiss('creation');
  //       this.addChat('main', true);
  //     }).catch((err) => this.popupService.error(err));
  //     }
  //   ).catch((err) => this.popupService.error(err));
  // }

  // async newChat() {
  //   await this.popupService.loading();
  //   await this.popupService.loadingDismiss();
  //   const alert = await this.alertController.create({
  //     header: this.BOOK.addChat,
  //     inputs: [
  //       {
  //         name: 'name',
  //         type: 'text',
  //         placeholder: this.BOOK.chatName
  //       }
  //     ],
  //     buttons: [
  //       {
  //         text: this.COMMON.cancel,
  //         role: 'cancel',
  //         cssClass: 'secondary'
  //       }, {
  //         text: this.COMMON.create,
  //         handler: (data) => {
  //           if (data.name) {
  //             this.addChat(data.name);
  //           } else {
  //             this.popupService.toast(this.BOOK.chatNameError);
  //           }
  //         }
  //       }
  //     ]
  //   });
  //   await alert.present();
  // }

  getEntitiesCollection(collection) {
    const res = {};
    for (const id of Object.keys(this.entities)) {
      const entity = this.entities[id];
      if (entity.collection === collection) {

        res[id] = entity;
      }
    }
    return res;
  }

  objectToList(object, exclude: string[] = []) {
    const res = [];
    Object.keys(object).forEach((item) => {
      if (!exclude.includes(item)) {
        res.push(object[item]);
      }
    });

    return res;
  }

  // addScript(scriptName , main = false) {
  //   if (scriptName.toUpperCase() === 'MAIN' && !main) {
  //     this.popupService.toast(this.BOOK.chatReservedNameError);
  //     return;
  //   }
  //   if (this.book.haveScript(scriptName)) {
  //     this.popupService.toast(this.BOOK.chatUsedNameError);
  //     return;
  //   }
  //   let id = 'main';
  //   if (!main) {
  //     id = this.firestore.createId();
  //   }
  //   if (!this.book.haveScript(scriptName)) {
  //     // TODO
  //   }
  // }

  uploadCover(file: string) {
    return new Promise((resolve, reject) => {
      const path = 'books/' + this.book.id + '/cover.jpeg';
      this.firestorage.ref(path).putString(file, 'data_url').then(async () => {
        const ref = await this.firestorage.ref(path).getDownloadURL().toPromise();
        console.log(ref);
        this.book.cover = ref;
        this.uploadBook();
        resolve();
      }).catch((err) => {
        this.popupService.error(err);
        reject();
      });
    });
  }

  uploadBanner(file): Promise<void> {
    return new Promise((resolve, reject) => {
      const path = 'books/' + this.book.id + '/banner.jpeg';
      this.firestorage.ref(path).putString(file, 'data_url').then(async () => {
        const ref = await this.firestorage.ref(path).getDownloadURL().toPromise();
        this.book.banner = ref;
        this.uploadBook();
        resolve();
      }).catch((err) => {
        this.popupService.error(err);
        reject();
      });
    });
  }

  async changeWallpaper(bookId, url: string) {
    await this.firestore.collection('books').doc(bookId).update({wallpaper: url});
    this.popupService.toast(this.BOOK.backgroundChanged);
  }

  searchByName(filter: string): Observable<any> {
    const queryByName = this.firestore.collection(
       'books', ref => ref.where('public', '==', true)
                          .where('lang', 'in', this.userService.langs)
                          .orderBy('titleLower')
                          .startAt(filter.toLowerCase())
                          .endAt(filter.toLowerCase() + '\uf8ff')
                          .limit(20)
      ).valueChanges();
    return queryByName;
  }

  searchByTag(filter: string): Observable<any> {
    const filterArray: string[] = filter.split(' ');
    const res = [];
    filterArray.forEach((val) => {
      res.push(val.toLowerCase());
    });
    const queryByTag = this.firestore.collection(
       'books', ref => ref.where('public', '==', true)
                          .where('tags', 'array-contains-any', res)
                          .limit(20)
      ).valueChanges();
    return queryByTag;
  }

  // TODO
  // async deleteBook(bookId = this.curBookId) {
  //   await this.popupService.loading();
  //   this.navCtrl.navigateRoot('/tabs/profile');
  //   // retirer book de la liste
  //   this.userService.deleteBookRef(bookId);
  //   // supprimer book
  //   const bookRef = this.firestore.collection('/books').doc(bookId);
  //   // S'il n'y a plus d'autheur, le livre est supprimé
  //   this.unsyncBook();
  //   // On supprime les sous-collections
  //   const subCollections = ['chats', 'actors', 'comments', 'places', 'items', 'roles'];
  //   for (const subCollection of subCollections) {
  //     const data = await this.firestore.collection('books').doc(bookId).collection(subCollection).get().toPromise();
  //     for (const doc of data.docs) {
  //       if (doc.exists) {
  //         await doc.ref.delete();
  //       }
  //     }
  //   }
  //   // On supprime les médias
  //   if (this.haveCover()) {
  //     this.firestorage.ref('books/' + bookId + '/cover.jpeg').delete();
  //   }
  //   if (this.haveBanner()) {
  //     this.firestorage.ref('books/' + bookId + '/banner.jpeg').delete();
  //   }
  //   this.firestore.collection('books').doc(bookId).collection('medias').get().subscribe((data) => {
  //     data.docs.forEach((doc) => {
  //       // On supprime le média associé à la référence
  //       const ref = doc.data().ref;
  //       this.firestorage.ref(ref).delete();
  //       doc.ref.delete();
  //     });
  //   });
  //   // On supprime le document du livre
  //   bookRef.delete();
  //   this.popupService.loadingDismiss();
  // }

  addMediaRef(url: string, ref: string, type: string, tag: string) {
    this.firestore.collection('books').doc(this.curBookId).collection('medias').add({url, ref, type, tag});
  }

  // deleteMedia(url: string) {
  //   this.firestore.collection('books').doc(this.curBookId)
  //                 .collection('medias', ref => ref.where('url', '==', url)).get().subscribe((val) => {
  //     val.docs.forEach(doc => {
  //       const ref = doc.data().ref;
  //       this.firestorage.ref(ref).delete();
  //       doc.ref.delete();
  //     });
  //   });
  // }

  addAuthor(bookId, userId = this.userService.userId) {
    const bookRef = this.firestore.collection('books').doc(bookId);
    const bookSub = bookRef.get().subscribe((val) => {
      const authors: string[] = val.data().authors;
      if (!authors.includes(userId)) {
        if (authors.length < 10) {
          authors.push(userId);
          bookRef.update({authors});
        } else {
          this.popupService.alert(this.BOOK.authorMaxError);
        }
      } else {
        this.popupService.alert(this.BOOK.authorAlreadyError);
      }
      bookSub.unsubscribe();
    });
  }

  haveCover(): boolean {
    return this.book.cover.charAt(0) !== '.';
  }

  haveBanner(): boolean {
    return this.book.banner !== undefined;
  }

  // getBook(bookId) {
  //   return this.firestore.collection('books').doc(bookId).valueChanges();
  // }

  updateBookData(data, curBookId: string = this.curBookId) {
    this.booksCollection.doc(curBookId).update(data);
  }

  loadBook(book = this.book): Promise<Book> {
    return new Promise(async (resolve) => {
      let result: Book;
      this.storage.get(book.id).then(async (res) => {
        const savedBook = new Book(res);
        if (book.version <= savedBook.version) {
          result = new Book(savedBook);
        } else {
          result = await this.downloadBook();
        }
        resolve(result);
      }).catch(async () => {
        result = await this.downloadBook();
        resolve(result);
      });
    });
  }

  async downloadBook(url = this.book.downloadURL): Promise<Book> {

    const book: Book = new Book(await this.getBook(url));
    this.saveBook(book);
    return book;
  }

  async getBook(url: string): Promise<Book> {
    return new Promise (async (resolve) => {
      const blob = await this.getBlob(url);
      // Conversion du blob en json
      const reader = new FileReader();
      reader.readAsText(blob);
      reader.onloadend = () => {
          const jsonString = reader.result.toString();
          const book: Book = new Book(JSON.parse(jsonString));
          resolve(book);
      };
    });
  }

  async getBlob(url: string): Promise<Blob> {
    return new Promise (async (resolve) => {
      // Téléchargement du blob
      const blob = await fetch(url).then(r => r.blob());
      resolve(blob);
    });
  }

  async saveBook(book: Book = this.book) {
    if (book.scripts.length === 0) {
      this.book = await this.loadBook();
      book = this.book;
    }
    this.storage.set(book.id, book);
  }

  async getMostBooks(attribute): Promise<any[]> {
    if (!this.langs) {
      this.langs = this.translator.getLangs();
    }
    return new Promise(res => {
      this.firestore.collection(
      'books', ref => ref.where('public', '==', true).where('language', 'in', this.langs).orderBy(attribute, 'desc').limit(20)
      ).get().toPromise().then((collection) => {
        const values = collection.docs;
        const mostBooks = [];
        values.forEach((val) => {
          mostBooks.push(new Book(val.data()));
        });
        res(mostBooks);
      });
    });
  }

  async uploadBook() {
    // Sauvegarde
    this.book.version += 1;
    console.log(this.book);
    await this.saveBook();
    // Upload
    const reference = this.firestorage.ref('books/' + this.book.id + '/book.json');
    const blob = new Blob([JSON.stringify(this.book, null, 2)], {type: 'application/json'});
    await reference.put(blob);
    const downloadURL = await reference.getDownloadURL().toPromise();
    this.book.downloadURL = downloadURL;
    console.log(this.book.title + ': ' + 'Upload effectué');
    // Update Cover
    await this.firestore.collection('books').doc(this.book.id).set(this.book.getCover());
  }

  // async syncBook2(curBookId = this.curBookId, cover: boolean = false): Promise<any> {
  //   let bookPromise: Promise<any>;
  //   bookPromise = new Promise((res, reject) => {
  //     this.bookSub = this.firestore.collection('books').doc(curBookId).valueChanges().subscribe((value: any) => {
  //       if (value) {
  //         this.book = value;
  //         this.book.starsArray = new Array(Math.round(this.book.starsAvg));
  //         this.isAuthor = this.book.authors.includes(this.userService.userId) && this.userService.connected;
  //         res();
  //       } else {
  //         reject(this.BOOK.bookNotExistError);
  //       }
  //     });
  //   });
  //   let bookChatPromise: Promise<any>;
  //   let bookActorPromise: Promise<any>;
  //   let bookPlacePromise: Promise<any>;
  //   let bookItemPromise: Promise<any>;
  //   let bookRolePromise: Promise<any>;
  //   if (!cover) {
  //     bookChatPromise = new Promise(resolve => {
  //       this.bookChatSub = this.firestore.collection('books').doc(curBookId).collection('chats').valueChanges().subscribe((value) => {
  //         this.chats = value;
  //         // Remove all places
  //         const res = {};
  //         Object.values(this.entities).forEach((entity: any) => {
  //           if (entity.collection !== 'chats') {
  //             res[entity.id] = entity;
  //           }
  //         });
  //         this.entities = res;
  //         value.forEach(entity => {
  //           entity.collection = 'chats';
  //           this.entities[entity.id] = entity;
  //         });
  //         resolve();
  //       });
  //     });
  //     bookActorPromise = new Promise(resolve => {
  //       this.bookActorSub = this.firestore.collection('books').doc(curBookId)
  //                                         .collection('actors').valueChanges().subscribe((value: any) => {
  //         this.actorsById = {};
  //         this.actors = value;
  //         value.forEach(actor => {
  //           this.actorsById[actor.id] = actor;
  //         });
  //         // Remove all actors
  //         const res = {};
  //         Object.values(this.entities).forEach((entity: any) => {
  //           if (entity.collection !== 'actors') {
  //             res[entity.id] = entity;
  //           }
  //         });
  //         this.entities = res;
  //         value.forEach(entity => {
  //           entity.collection = 'actors';
  //           this.entities[entity.id] = entity;
  //         });
  //         resolve();
  //       });
  //     });
  //     bookPlacePromise = new Promise(resolve => {
  //       this.bookPlaceSub = this.firestore.collection('books').doc(curBookId)
  //                                         .collection('places').valueChanges().subscribe((value: any) => {
  //         this.places = value;

  //         // Remove all places
  //         const res = {};
  //         Object.values(this.entities).forEach((entity: any) => {
  //           if (entity.collection !== 'places') {
  //             res[entity.id] = entity;
  //           }
  //         });
  //         this.entities = res;
  //         value.forEach(entity => {
  //           entity.collection = 'places';
  //           this.entities[entity.id] = entity;
  //         });
  //         resolve();
  //       });
  //     });
  //     bookItemPromise = new Promise(resolve => {
  //       this.bookItemSub = this.firestore.collection('books')
  //                          .doc(curBookId).collection('items').valueChanges().subscribe((value: any) => {
  //         this.items = value;

  //         // Remove all items
  //         const res = {};
  //         Object.values(this.entities).forEach((entity: any) => {
  //           if (entity.collection !== 'items') {
  //             res[entity.id] = entity;
  //           }
  //         });
  //         this.entities = res;
  //         // Replace all items
  //         value.forEach(entity => {
  //           entity.collection = 'items';
  //           this.entities[entity.id] = entity;
  //         });
  //         resolve();
  //       });
  //     });
  //     bookRolePromise = new Promise(resolve => {
  //       this.bookRoleSub = this.firestore.collection('books').doc(curBookId).collection('roles').valueChanges().subscribe((value) => {
  //         this.roles = value;

  //         // Remove all items
  //         const res = {};
  //         Object.values(this.entities).forEach((entity: any) => {
  //           if (entity.collection !== 'roles') {
  //             res[entity.id] = entity;
  //           }
  //         });
  //         this.entities = res;
  //         // Replace all items
  //         value.forEach(entity => {
  //           entity.collection = 'roles';
  //           this.entities[entity.id] = entity;
  //         });
  //         resolve();
  //       });
  //     });
  //   }
  //   return new Promise((res, reject) => {
  //     bookPromise.then(async () => {
  //       if (!cover) {
  //         await bookChatPromise;
  //         await bookActorPromise;
  //         await bookPlacePromise;
  //         await bookItemPromise;
  //         await bookRolePromise;
  //       }
  //       res();
  //     }).catch(err => reject(err));
  //   });
  // }

  // unsyncBook(cover = false) {
  //   this.bookSub.unsubscribe();
  //   if (!cover) {
  //     this.bookChatSub.unsubscribe();
  //     this.bookActorSub.unsubscribe();
  //     this.bookPlaceSub.unsubscribe();
  //     this.bookItemSub.unsubscribe();
  //     this.bookRoleSub.unsubscribe();
  //   }
  // }

  setMainChat(chatId: string) {
    this.firestore.collection('/books').doc(this.curBookId).update({main: chatId})
    .catch((err) => this.popupService.error(err));
  }

  // uploadFile(type: string, file: any, id= this.userId) {
  //   let path = '';
  //   if (type == 'userAvatar') {
  //     path = 'users/'+ id +'/avatar.jpeg';
  //   }
  //   if (type === 'cover') {
  //     path = 'books/'+ id +'/cover.jpeg';
  //   }
  //   this.firestorage.ref(path).putString(file, 'data_url').then( () => {
  //     if (type === 'userAvatar') {
  //       this.firestorage.ref(path).getDownloadURL().subscribe((ref) => {
  //         this.firestore.collection('users').doc(id).update({avatar: ref});
  //       });
  //     }
  //     if (type === 'cover') {
  //       this.firestorage.ref(path).getDownloadURL().subscribe((ref) => {
  //         this.firestore.collection('books').doc(id).update({cover: ref});
  //       });
  //     }
  //   }
  //   );
  // }

  async publishBook() {
    await this.firestore.collection('/books').doc(this.curBookId).update({public: true});
    await this.firestore.collection('/users').doc(this.userService.userId).collection('books').doc(this.curBookId).update({public: true});
    this.popupService.toast(this.BOOK.bookPublished);
  }

  unpublishBook() {
    this.firestore.collection('/books').doc(this.curBookId).update({public: false});
    this.firestore.collection('/users').doc(this.userService.userId).collection('books').doc(this.curBookId).update({public: false});
  }

  getCategory(category) {
    const res = [];
    const langs = this.userService.userData.searchlangs;
    this.firestore.collection(
      'books',
       ref => ref.where('public', '==', true).where('lang', 'in', langs).where('cat', '==', category).orderBy('views', 'desc').limit(10)
      ).get().subscribe((data) => {
      data.docs.forEach((doc) => {
        res.push(doc.data());
      });
      if (res.length === 0) {
        this.popupService.toast(this.BOOK.emptyCategory);
      }
    });
    return res;
  }

  async play(chatId = 'main', debug = false) {
    await this.popupService.loading();
    this.debug = debug;
    this.curChatId = chatId;
    this.firestore.collection('books').doc(this.book.id).update({
      views: this.book.views + 1,
    });
    this.book = await this.loadBook();
    this.popupService.loadingDismiss();
    this.navCtrl.navigateForward('/game');
  }

  getUserById(userId): Observable<any> {
    return this.firestore.collection('users').doc(userId).get();
  }

  getBookById(bookId): Observable<any> {
    return this.firestore.collection('books').doc(bookId).get();
  }

  shareBook(bookId: string) {
    const bookUrl = 'https://app.noetic.site/book/' + bookId;
    this.userService.share(this.BOOK.shareMsg, this.BOOK.shareSubject, bookUrl);
  }

  newEntity(collection: string, extraData = {}, id = '', target = '', targetCollection = ''): Promise<any> {
    return new Promise(async (res, rej) => {
      const alert = await this.alertController.create({
        header: this.BOOK.header[collection],
        inputs: [
          {
            name: 'name',
            type: 'text',
            placeholder: this.COMMON.name,
          },
        ],
        buttons: [
          {
            text: this.COMMON.cancel,
            role: 'cancel',
            cssClass: 'secondary'
          }, {
            text: this.COMMON.confirm,
            handler: (data: {id: string, places: [], name: string, key: string,
              color: string, roles: string[], variables: {}, actions: {}}) => {
              if (data.name) {
                data.id = id;
                const role = data.name.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                  .replace(/[^\w\s]/gi, '').replace(/\s/g, '-');
                data.color = 'medium';
                if (collection === 'roles') {
                  data.variables = {};
                  data.actions = {};
                  data.id = role;
                  data.roles = [];
                  const roles: string[] = this.entities[target].roles;
                  if (!roles.includes(role)) {
                    roles.push(role);
                    this.firestore.collection('/books').doc(this.curBookId).collection(targetCollection).doc(target).update({roles});
                    if (!this.entities[data.id]) {
                      this.firestore.collection('/books').doc(this.curBookId).collection('roles').doc(data.id).set({
                        id: data.id,
                        name: data.id,
                        color: 'medium',
                        variables: {},
                        actions: {}
                      });
                    }
                  }
                } else {
                  if (id === '') {
                    data.id = this.firestore.createId();
                  }
                  if (collection === 'places') {
                    data.places = [];
                  }
                  data.roles = [role];
                  data.key = role;
                  data.variables = {};
                  this.firestore.collection('/books').doc(this.curBookId).collection('roles').doc(role).set({
                    id: role,
                    name: role,
                    target: data.id,
                    color: 'medium',
                    variables: {},
                    actions: {}
                  });
                }
                Object.keys(extraData)
                  .forEach(key => data[key] = extraData[key]);
                this.firestore.collection('/books').doc(this.curBookId).collection(collection).doc(data.id).set(data);
                res();
              } else {
                this.popupService.toast(this.ERRORS.fieldMissing);
                rej();
              }
            }
          }
        ]
      });
      await alert.present();
    });
  }

  removeRole(roleId): Promise<any> {
    return new Promise(async (resolve) => {
      for (const entityId of Object.keys(this.entities)) {
        const entity: {roles: string[], collection: string} = this.entities[entityId];
        if (entity.roles) {
          for (let i = 0; i < entity.roles.length; i++) {
            if (roleId === entity.roles[i]) {
              entity.roles.splice(i, 1);
              await this.firestore.collection('/books').doc(this.curBookId).collection(entity.collection)
                                                       .doc(entityId).update({roles: entity.roles});
              break;
            }
          }
        }
      }
      await this.firestore.collection('/books').doc(this.curBookId).collection('roles').doc(roleId).delete();
      resolve();
    });
  }

  async updateFieldEntity(id, collection, fields: string[]) {
    const inputs = [];
    for (const field of fields) {
      inputs.push({
        name: field,
        type: 'text',
        placeholder: this.COMMON[field],
      }, );
    }
    const alert = await this.alertController.create({
      header: this.COMMON.update,
      inputs,
      buttons: [
        {
          text: this.COMMON.cancel,
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: this.COMMON.confirm,
          handler: (data) => {
            if (data) {
              this.updateEntity(id, collection, data);
            } else {
              this.popupService.toast(this.ERRORS.fieldMissing);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  updateEntity(id, collection, data): Promise<any> {
    return new Promise((res, rej) => {
      this.firestore.collection('/books').doc(this.curBookId).collection(collection)
                                         .doc(id).update(data).then(() => res()).catch(() => rej());
    });
  }

  // uploadAvatar(file, id, collection) {
  //   const path = 'books/' + this.curBookId + '/' + collection + '/' + id + '/avatar.jpeg';
  //   this.firestorage.ref(path).putString(file, 'data_url').then( () => {
  //     this.firestorage.ref(path).getDownloadURL().subscribe((ref) => {
  //       this.addMediaRef(ref, path, 'image', 'avatar');
  //       this.firestore.collection('books').doc(this.curBookId).collection(collection).doc(id).update({avatar: ref});
  //     });
  //   }).catch((err) => this.popupService.error(err));
  // }

  getEntitiesByValues(values: {}): any[] {
    const res = [];
    Object.values(this.entities).forEach(entity => {
      let valid = true;
      Object.keys(values).forEach(variable => {
        if (entity[variable] !== values[variable]) {
          valid = false;
        }
      });
      if (valid) {
        res.push(entity);
      }
    });

    return res;
  }

  getRoles(roleList: string[]) {

    const res = [];
    Object.values(this.entities).forEach((entity: any) => {
      if (entity.collection === 'roles' && roleList.includes(entity.name)) {
        res.push(entity);
      }
    });
    return res;
  }

  // async deleteEntity(id: string, collection: string) {
  //   const entity = this.entities[id];
  //   if (entity) {



  //     if (entity.avatar) {
  //       this.deleteMedia(entity.avatar);
  //     }
  //     switch (collection) {
  //       case 'places':
  //         if (entity.items) {
  //           for (const idItem of entity.items) {
  //             this.deleteEntity(idItem, 'items');
  //           }
  //         }
  //         if (entity.places) {
  //           for (const idPlace of entity.places) {
  //             const places: string[] = this.entities[idPlace].places;
  //             for (let i = 0; i < places.length; i++) {
  //               const p = places[i];
  //               if (p === id) {
  //                 places.splice(i, 1);
  //                 break;
  //               }
  //             }
  //             this.updateEntity(idPlace, 'places', {places});
  //           }
  //         }
  //         break;
  //       case 'items':
  //         const place = this.entities[entity.pos];
  //         const items: string[] = place.items;
  //         while (items.indexOf(place) !== -1) {
  //           const itemIndex = items.indexOf(place);
  //           items.splice(itemIndex, 1);
  //         }
  //         this.updateEntity(place.id, 'places', {items});
  //         break;
  //       case 'actor':
  //         this.eraseActorMessages(id);
  //     }
  //     if (entity.key) {
  //       this.firestore.collection('/books').doc(this.curBookId).collection('roles').doc(entity.key).delete();
  //     }
  //     this.firestore.collection('/books').doc(this.curBookId).collection(collection).doc(id).delete();
  //   }
  // }

  // async eraseActorMessages(actorId: string) {
  //   await this.popupService.loading();
  //   const actor = this.entities[actorId];
  //   const avatar = actor.avatar;
  //   if (avatar) {
  //     this.deleteMedia(avatar);
  //   }
  //   // On supprime tout ses messages
  //   const chatSub = this.firestore.collection('/books').doc(this.curBookId).collection('chats').get().subscribe((val) => {
  //     val.forEach(chat => {
  //       const logs = [];
  //       chat.data().logs.forEach(log => {
  //         if (log.actor !== actorId) {
  //           logs.push(log);
  //         }
  //       });
  //       if (logs !== chat.data().logs) {
  //         this.firestore.collection('/books').doc(this.curBookId).collection('chats').doc(chat.id).update({logs});
  //       }
  //     });
  //     this.popupService.loadingDismiss();
  //     chatSub.unsubscribe();
  //   });
  // }
}
