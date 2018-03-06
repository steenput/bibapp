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

  constructor(private view: ViewController, private params: NavParams) {
    this.id = params.get('id');
    this.content = params.get('content');
    this.title = params.get('title');
  }

  saveContent() {
    let data = { id: this.id, content: this.content };
    this.view.dismiss(data);
  }
    
  close() {
    this.view.dismiss();
  }
}
