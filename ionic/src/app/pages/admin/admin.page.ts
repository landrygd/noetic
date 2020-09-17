import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Book, Entity, Role, Script } from 'src/app/classes/book';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  @ViewChild('myCanvas', { read: ElementRef, static: true}) canvas: ElementRef<HTMLCanvasElement>;
  bookId: string = 'tDQgOj0XWrEpSClmlzoX';
  base64: string;

  constructor(
    private firestore: AngularFirestore,
    private firestorage: AngularFireStorage
    ) { }

  ngOnInit() {
  }

  updateAllBook() {
    console.log('Cliqué');
    this.firestore.collection('/books').get().toPromise().then(async (collection) => {
      console.log('C\'est paaaarrrrtiiiiii!!');
      for (const doc of collection.docs) {
        const id = doc.id;
        await this.updateBook(id);
      }
    });
  }

   updateBook(bookId: string) {
    return new Promise(async (resolve) => {
      // Rechargement des données sauvegardées
      let data = (await this.firestore.collection('books').doc(bookId).get().toPromise()).data();
      // // Filtre données
      // if (data.cat) {
      //   data.category = data.cat;
      // }
      // if (data.desc) {
      //   data.description = data.desc;
      // }
      // if (data.date) {
      //   data.creationDate = data.date;
      // }
      // if (data.lang) {
      //   data.language = data.lang;
      // }
      // if (data.authors) {
      //   data.author = data.authors[0];
      // }
      // // On supprime les médias
      // if (data.cover) {
      //   if (data.cover.charAt(0) === 'h') {
      //     data.cover = await this.getBase64(data.cover);
      //   } else {
      //     delete data.cover;
      //   }
      // }
      // if (data.banner) {
      //   if (data.banner.charAt(0) === 'h') {
      //     data.banner = await this.getBase64(data.banner);
      //   } else {
      //     delete data.banner;
      //   }
      // }
      if (data.downloadURL) {
        data = await this.getBook(data.downloadURL);
      }
      const book = new Book(data);
      // // Entités
      // const entities: any[] = [];
      // for (const type of ['actor', 'item', 'place']) {
      //   (await this.firestore.collection('books').doc(bookId).collection(type + 's').get().toPromise()).forEach(async (val) => {
      //     const value = val.data();
      //     if (value.id) {
      //       delete value.id;
      //     }
      //     const entity = new Entity(value);
      //     entity.type = type;
      //     if (val.data().avatar) {
      //       entity.img = await this.getBase64(val.data().avatar);
      //     }
      //     book.addEntity(entity);
      //     Object.assign(value, entity);
      //     entities.push(value);
      //   });
      // }
      // console.log(book.title + ': ' + 'Entités maj');
      // // Roles
      // (await this.firestore.collection('books').doc(bookId).collection('roles').get().toPromise()).forEach(async (val: any) => {
      //   const value = val.data();
      //   if (value.target) {
      //     value.key = value.target;
      //     delete value.target;
      //   }
      //   if (value.id) {
      //     delete value.id;
      //   }
      //   const role: Role = new Role(value);
      //   book.addRole(role.name, role);
      // });
      // console.log(book.title + ': ' + 'Roles maj');
      // Scripts
      const scripts: any[] = book.scripts;
      // (await this.firestore.collection('books').doc(bookId).collection('chats').get().toPromise()).docs.forEach((doc) => {
      //   scripts.push(doc.data());
      // });
      const resultBooks = [];
      // if (scripts.length === 0) {
      //   scripts = book.scripts.slice();
      //   for (const script of scripts) {
      //     const logs = [];
      //     const content = script.content.split('\n');
      //     for (const msg of content) {
      //       logs.push({msg});
      //     }
      //     const res = script;
      //     res.logs = logs;
      //     resultBooks.push(res);
      //   }
      //   scripts = resultBooks;
      // }
      book.scripts = [];
      scripts.forEach(async (value: any) => {
        // tslint:disable-next-line: no-string-literal
        // for (const msg of value.content) {
        //   // if (log.actor) {
        //   //   const actor =  entities.filter((act) => act.id = log.actor)[0];
        //   //   value.content += '@' + actor.key + ': ';
        //   // }
        //   // if (['/endanswers', '/endif'].includes(msg)) {
        //   //   msg = '/end';
        //   // }
        //   // if (msg.includes('/question') && msg.includes(';')) {
        //   //   msg = '/question';
        //   // }
        //   // if (msg.includes('/if $answer ==')) {
        //   //   msg = msg.replace('/if $answer ==', '/answer');
        //   // }
        //   // if (msg.includes('/go -chat')) {
        //   //   msg = msg.replace('/go -chat', '/chat');
        //   // }
        //   value.messages.push(msg);
        // }
        let messages: string[] = [];
        if (value.messages) {
          messages = value.messages;
        } else {
          messages = value.content.split('\n');
        }
        value.messages = [];
        messages.forEach(msg => {
          if (msg !== '') {
            value.messages.push(msg);
          }
        });
        delete value.logs;
        delete value.content;
        book.addScript(value);
      });
      console.log(book.title + ': ' + 'Script maj');
      // // maj cover et banner
      // if (book.cover !== '' && book.cover.charAt(0) !== 'h') {
      //   book.cover = await this.uploadImage(book.cover, book.id, 'cover');
      // }
      // if (book.banner !== '' && book.banner.charAt(0) !== 'h') {
      //   book.banner = await this.uploadImage(book.banner, book.id, 'banner');
      // }
      // // maj img et banner des entitées
      // const bookEntities = book.entities;
      // for (const entity of bookEntities) {
      //   for (const att of ['img', 'banner']) {
      //     if (entity[att]) {
      //       if (entity[att] !== '' && entity[att].charAt(0) !== 'h') {
      //         const url: string = await this.uploadImage(entity[att], book.id, '@' + entity.key + '_' + att);
      //         const ent = entity;
      //         ent[att] = url;
      //         book.setEntity(ent);
      //       }
      //     }
      //   }
      // }
      // console.log(book);
      // console.log(book.title + ': ' + 'Médias uploadé et indexé');

      // Upload
      const reference = this.firestorage.ref('books/' + bookId + '/book.json');
      const blob = new Blob([JSON.stringify(book, null, 2)], {type: 'application/json'});
      await reference.put(blob);
      const downloadURL = await reference.getDownloadURL().toPromise();
      book.downloadURL = downloadURL;
      console.log(book.title + ': ' + 'Upload effectué');
      // Update Cover
      await this.firestore.collection('books').doc(bookId).set(book.getCover());
      console.log(book.title + ': ' + 'Cover mis à jour');
      console.log(book);

      // On supprime les sous-collections sauf comments et medias
      // const subCollections = ['chats', 'actors', 'places', 'items', 'roles'];
      // for (const subCollection of subCollections) {
      //   const data3 = await this.firestore.collection('books').doc(book.id).collection(subCollection).get().toPromise();
      //   for (const doc of data3.docs) {
      //     if (doc.exists) {
      //       await doc.ref.delete();
      //     }
      //   }
      // }
      // console.log(book.title + ': ' + 'Sous collections supprimés');
      // this.firestore.collection('books').doc(book.id).collection('medias').get().toPromise().then((data2) => {
      //   data2.docs.forEach(async (doc) => {
      //     // On supprime le média associé à la référence
      //     const ref = doc.data().ref;
      //     await this.firestorage.ref(ref).delete();
      //     doc.ref.delete();
      //   });
      // });
      // console.log(book.title + ': ' + 'Médias supprimés');
      resolve();
    });
  }

  async uploadImage(base64: string, bookId: string, imgName: string): Promise<string> {
    const mime = this.getBase64MimeType(base64);
    let jpegBase64 = base64;
    if (mime !== 'image/jpeg') {
      jpegBase64 = await this.pngToJpeg(base64);
    }
    console.log({jpegBase64, base64});
    const jpeg = this.b64toBlob(jpegBase64);
    const ref = this.firestorage.ref('books/' + bookId + '/' + imgName + '.jpeg');
    await ref.put(jpeg);
    return await ref.getDownloadURL().toPromise();
  }

  b64toBlob(dataURI, contentType = 'image/jpeg', sliceSize = 512): Blob {
    const byteCharacters = atob(dataURI.split(',')[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  getBase64MimeType(encoded): string {
    let result = null;
    if (typeof encoded !== 'string') {
      return result;
    }
    const mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    if (mime && mime.length) {
      result = mime[1];
    }
    return result;
  }

  pngToJpeg(base64: string = this.base64): Promise<string> {
    return new Promise((resolve) => {
      const canvas = this.canvas.nativeElement;
      console.log('Conversion png en jpeg...');
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const context = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
        const jpegBase64 = canvas.toDataURL('image/jpeg', 0.5);
        resolve(jpegBase64);
      };
      img.onerror = () => resolve(base64);
    });
  }

  async getBlob(url: string): Promise<Blob> {
    return new Promise (async (resolve) => {
      // Téléchargement du blob
      const blob = await fetch(url).then(r => r.blob());
      resolve(blob);
    });
  }

  async getBase64(url: string): Promise<string> {
    return new Promise (async (resolve) => {
      const blob = await this.getBlob(url);
      // Conversion du blob en base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
          const base64data = reader.result;
          resolve(base64data.toString());
      };
    });
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
}
