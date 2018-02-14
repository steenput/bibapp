import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-add-news',
  templateUrl: 'add-news.html',
})
export class AddNewsPage {
  id: string;
  abstract: string;

  constructor(public view: ViewController, params: NavParams) {
    this.id = params.get('id');
  }

  saveAbstract() {
    let data = {id: this.id, abstract: this.abstract};
    this.view.dismiss(data);
  }
    
  close() {
    this.view.dismiss();
  }
}
