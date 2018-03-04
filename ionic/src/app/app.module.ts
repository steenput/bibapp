import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { NewsPage } from '../pages/news/news';
import { HeartsPage } from '../pages/hearts/hearts';
import { ReviewsPage } from '../pages/reviews/reviews';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { BookPage } from '../pages/book/book';
import { ManageCommentPage } from '../pages/manage-comment/manage-comment';
import { ManageFavouritePage } from '../pages/manage-favourite/manage-favourite';
import { ManageReviewPage } from '../pages/manage-review/manage-review';
import { SearchPage } from "../pages/search/search";

import { AuthProvider } from '../providers/auth/auth';
import { ImagesProvider } from '../providers/images/images';
import { BookProvider } from '../providers/book/book';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    NewsPage,
    HeartsPage,
    ReviewsPage,
    ManageCommentPage,
    ManageFavouritePage,
    ManageReviewPage,
    LoginPage,
    RegisterPage,
    BookPage,
    SearchPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    NewsPage,
    HeartsPage,
    ReviewsPage,
    ManageCommentPage,
    ManageFavouritePage,
    ManageReviewPage,
    LoginPage,
    RegisterPage,
    BookPage,
    SearchPage
  ],
  providers: [
    IonicStorageModule,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    ImagesProvider,
    BookProvider
  ]
})
export class AppModule {}
