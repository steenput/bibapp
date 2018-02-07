import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-add-news',
  templateUrl: 'add-news.html',
})
export class AddNewsPage {
  id: string;
  comment: string;

  constructor(public view: ViewController, params: NavParams) {
    this.id = params.get('id');
  }

  saveComment() {
    this.view.dismiss({id : this.id, comment : this.comment});
  }
    
  close() {
    this.view.dismiss();
  }

}
