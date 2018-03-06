import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Page } from '../page-interface';
import { BooksPage } from '../books/books';
import { LoginPage } from '../login/login';
import { AuthProvider } from '../../providers/auth/auth';
import { SearchPage } from '../search/search';
import { RegisterPage } from '../register/register';
import { TypeList } from "../typeList";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  pages: Array<Page>;
  logText: string;

  constructor(public navCtrl: NavController, public authService: AuthProvider) {
    this.logText = this.authService.isConnected() ? 'log-out' : 'log-in';
    this.pages = [
      { title: 'Nouveautés', type: TypeList.News, component: BooksPage },
      { title: 'Coups de coeur', type: TypeList.Favourites, component: BooksPage },      
      { title: 'Revue de presse', type: TypeList.Reviews, component: BooksPage }
    ];
  }

  openPage(page: Page) {
    this.navCtrl.push(page.component, {
      page: page
    });
  }

  log() {
    if (this.authService.isConnected()) {
      this.authService.logout();
      this.logText = 'log-in';
      this.navCtrl.setRoot(HomePage);
    }
    else {
      this.navCtrl.push(LoginPage);
    }
  }

  register() {
    this.navCtrl.push(RegisterPage);
  }

  search(val: string) {
    let page: Page = { title: 'Recherche', type: TypeList.Search, component: SearchPage }
    this.navCtrl.push(page.component, {
      page: page,
      val: val
    });
  }
}
