import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-manage-favourite',
  templateUrl: 'manage-favourite.html',
})
export class ManageFavouritePage {
  id: string;
  favourite: string;

  constructor(public view: ViewController, params: NavParams) {
    this.id = params.get('id');
  }

  saveFavourite() {
    let data = {id: this.id, favourite: this.favourite};
    this.view.dismiss(data);
  }
    
  close() {
    this.view.dismiss();
  }
}
