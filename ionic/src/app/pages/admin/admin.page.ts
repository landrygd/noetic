import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Book, Entity, Role } from 'src/app/classes/book';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  bookId: string;

  constructor(
    private firestore: AngularFirestore,
    private firestorage: AngularFireStorage
    ) { }

  ngOnInit() {
  }

  updateAllBook() {
    this.firestore.collection('/books').get().toPromise().then(async (collection) => {
      collection.docs.forEach((doc) => {
        const id = doc.id;
        if (doc.data().cat) {
          this.updateBook(id);
        }
      });
    });
  }

   updateBook(bookId: string) {
    return new Promise(async (resolve) => {
      console.log('BOOK ' + bookId);
      // Rechargement des données sauvegardées
      let data = (await this.firestore.collection('books').doc(bookId).get().toPromise()).data();
      // Filtre données
      if (data.cat) {
        data.category = data.cat;
      }
      if (data.desc) {
        data.description = data.desc;
      }
      if (data.date) {
        data.creationDate = data.date;
      }
      if (data.lang) {
        data.language = data.lang;
      }
      if (data.authors) {
        data.author = data.authors[0];
      }
      // On supprime les médias
      if (data.cover) {
        if (data.cover.charAt(0) === 'h') {
          data.cover = await this.getBase64(data.cover);
          await this.firestorage.ref('books/' + data.id + '/cover.png').delete().toPromise();
        } else {
          delete data.cover;
        }
      }
      if (data.banner) {
        if (data.banner.charAt(0) === 'h') {
          data.banner = await this.getBase64(data.banner);
          await this.firestorage.ref('books/' + data.id + '/banner.png').delete().toPromise();
        } else {
          delete data.banner;
        }
      }
      if (data.downloadURL) {
        data = await this.getBook(data.downloadURL);
        console.log(data);
      }
      const book = new Book(data);
      console.log('Données filtrées');
      console.log('Titre du livre:' + book.title);
      // Entités
      const entities: any[] = [];
      for (const type of ['actor', 'item', 'place']) {
        (await this.firestore.collection('books').doc(bookId).collection(type + 's').get().toPromise()).forEach(async (val) => {
          const value = val.data();
          if (value.id) {
            delete value.id;
          }
          const entity = new Entity(value);
          entity.type = type;
          if (val.data().avatar) {
            entity.img = await this.getBase64(val.data().avatar);
          }
          book.addEntity(entity);
          Object.assign(value, entity);
          entities.push(value);
        });
      }
      console.log(book.title + ': ' + 'Entités maj');
      // Roles
      (await this.firestore.collection('books').doc(bookId).collection('roles').get().toPromise()).forEach(async (val: any) => {
        const value = val.data();
        if (value.target) {
          value.key = value.target;
          delete value.target;
        }
        if (value.id) {
          delete value.id;
        }
        const role: Role = new Role(value);
        book.addRole(role.name, role);
      });
      console.log(book.title + ': ' + 'Roles maj');
      // Scripts
      let scripts: any[] = [];
      (await this.firestore.collection('books').doc(bookId).collection('chats').get().toPromise()).docs.forEach((doc) => {
        scripts.push(doc.data());
      });
      const resultBooks = [];
      if (scripts.length === 0) {
        scripts = book.scripts.slice();
        for (const script of scripts) {
          const logs = [];
          const content = script.content.split('\n');
          for (const msg of content) {
            logs.push({msg});
          }
          const res = script;
          res.logs = logs;
          resultBooks.push(res);
        }
        scripts = resultBooks;
      }
      book.scripts = [];
      scripts.forEach(async (value: any) => {
        if (value.id) {
          delete value.id;
        }
        value.content = '';
        for (const log of value.logs) {
          if (log.actor) {
            const actor =  entities.filter((act) => act.id = log.actor)[0];
            value.content += '@' + actor.key + ': ';
          }
          let msg: string = log.msg;
          if (['/endanswers', '/endif'].includes(msg)) {
            msg = '/end';
          }
          if (msg.includes('/question') && msg.includes(';')) {
            msg = '/question';
          }
          if (msg.includes('/if $answer ==')) {
            msg = msg.replace('/if $answer ==', '/answer');
          }
          value.content += msg + '\n';
        }
        delete value.logs;
        book.addScript(value);
      });
      console.log(book.title + ': ' + 'Script maj');
      // Upload
      const blob = new Blob([JSON.stringify(book, null, 2)], {type: 'application/json'});
      const reference = this.firestorage.ref('books/' + bookId + '.json');
      await reference.put(blob);
      const downloadURL = await reference.getDownloadURL().toPromise();
      book.downloadURL = downloadURL;
      console.log(book.title + ': ' + 'Upload effectué');
      // Update Cover
      await this.firestore.collection('books').doc(bookId).set(book.getCover());
      console.log(book.title + ': ' + 'Cover mis à jour');
      console.log(book);
      // On supprime les sous-collections sauf comments et medias
      const subCollections = ['chats', 'actors', 'places', 'items', 'roles'];
      for (const subCollection of subCollections) {
        const data3 = await this.firestore.collection('books').doc(book.id).collection(subCollection).get().toPromise();
        for (const doc of data3.docs) {
          if (doc.exists) {
            await doc.ref.delete();
          }
        }
      }
      console.log(book.title + ': ' + 'Sous collections supprimés');
      this.firestore.collection('books').doc(book.id).collection('medias').get().toPromise().then((data2) => {
        data2.docs.forEach(async (doc) => {
          // On supprime le média associé à la référence
          const ref = doc.data().ref;
          await this.firestorage.ref(ref).delete();
          doc.ref.delete();
        });
      });
      console.log(book.title + ': ' + 'Médias supprimés');
      resolve();
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
