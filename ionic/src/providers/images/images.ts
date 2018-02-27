import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { AuthProvider } from '../auth/auth';

@Injectable()
export class ImagesProvider {
  url: string;

  constructor(public http: Http, public authService: AuthProvider, private transfer: FileTransfer) {
    this.url = 'http://localhost:8082/images/';
  }

  getImage(id: string) {
    return new Promise(resolve => {
      this.http.get(this.url + id)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        });
    });
  }

  saveImage(id, image) {
    let options: FileUploadOptions = {
      fileKey: 'image',
      chunkedMode: false,
      mimeType: 'multipart/form-data',
      params: { 'id': id }
    };
    const fileTransfer: FileTransferObject = this.transfer.create();

    // Use the FileTransfer to upload the image
    return fileTransfer.upload(image, this.url, options);
  }

  deleteImage(id) {

  }
}
