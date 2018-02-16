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

import { AddNewsPage } from '../pages/add-news/add-news';
import { NewsProvider } from '../providers/news/news';
import { AuthProvider } from '../providers/auth/auth';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    NewsPage,
    HeartsPage,
    ReviewsPage,
    AddNewsPage,
    LoginPage,
    RegisterPage
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
    AddNewsPage,
    LoginPage,
    RegisterPage
  ],
  providers: [
    IonicStorageModule,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    NewsProvider,
    AuthProvider
  ]
})
export class AppModule {}
