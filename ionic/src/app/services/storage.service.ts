import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) { }

  loadProject(id: string): Promise<string> {
    const res = this.storage.get(id);
    return res;
  }

  save(bookId) {
    // set a key/value
    this.storage.set('name', 'Max');
  }

}
