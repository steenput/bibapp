import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Page } from '../page-interface';

/**
 * Generated class for the ReviewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-reviews',
  templateUrl: 'reviews.html',
})
export class ReviewsPage {
  page: Page;
    
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.page = this.navParams.get('page');
  }

}
