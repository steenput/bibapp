import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Page } from '../page-interface';

import { NewsPage } from '../news/news';
import { HeartsPage } from '../hearts/hearts';
import { ReviewsPage } from '../reviews/reviews';

import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  pages: Array<Page>;

  constructor(public navCtrl: NavController) {
    this.pages = [
      { title: 'Nouveautés', component: NewsPage },
      { title: 'Coups de coeur', component: HeartsPage },      
      { title: 'Revue de presse', component: ReviewsPage }
    ];
  }

  openPage(page: Page) {
    this.navCtrl.push(page.component, {
      page: page
    });
  }

  login() {
    this.navCtrl.push(LoginPage);
  }

}
