import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-manage-comment',
  templateUrl: 'manage-comment.html',
})
export class ManageCommentPage {
  id: string;
  comment: string;

  constructor(public view: ViewController, params: NavParams) {
    this.id = params.get('id');
  }

  saveComment() {
    let data = {id: this.id, comment: this.comment};
    this.view.dismiss(data);
  }
    
  close() {
    this.view.dismiss();
  }
}
