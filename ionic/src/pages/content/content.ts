import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-content',
  templateUrl: 'content.html',
})
export class ContentPage {
  private id: string;
  private content: string;
  private title: string;

  constructor(private view: ViewController, public params: NavParams) {
    console.log(this.params);
    this.id = this.params.get('id');
    this.content = this.params.get('content');
    this.title = this.params.get('title');
  }

  saveContent() {
    let data = { id: this.id, content: this.content };
    this.view.dismiss(data);
  }
    
  close() {
    this.view.dismiss();
  }
}
