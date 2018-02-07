import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class DataProvider {

  constructor(private storage: Storage) {}

  listComments() {
    let comments = [];
    this.storage.forEach((v, k) => {
      comments.push({key: k, value: v});
    });
    return comments;
  }

  getComment(key: string) {
    return this.storage.get(key);
  }
 
  saveComment(key: string, data: string) {
    this.storage.set(key, data);
  }

}
