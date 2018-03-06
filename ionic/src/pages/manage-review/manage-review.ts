import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-manage-review',
  templateUrl: 'manage-review.html',
})
export class ManageReviewPage {
  id: string;
  review: string;

  constructor(public view: ViewController, params: NavParams) {
    this.id = params.get('id');
  }

  saveReview() {
    let data = {id: this.id, content: this.review};
    this.view.dismiss(data);
  }
    
  close() {
    this.view.dismiss();
  }
}
