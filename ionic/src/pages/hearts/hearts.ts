import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Page } from '../page-interface';

/**
 * Generated class for the HeartsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-hearts',
  templateUrl: 'hearts.html',
})
export class HeartsPage {
  page: Page;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.page = this.navParams.get('page');
  }

}
