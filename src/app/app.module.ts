import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from "@angular/http";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';

import {MyApp} from './app.component';

import {TabsPage} from '../pages/tabs/tabs';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {WelcomePage} from "../pages/welcome/welcome";
import {HomePage} from '../pages/home/home';
import {SearchModalPage} from "../pages/search/searchModal";
import {LinePage} from "../pages/line/line";
import {EnquirePage} from "../pages/enquire/enquire";
import {EnquireNearbyPage} from "../pages/enquire/enquireNearby/enquireNearby";
import {PersonalCenterPage} from "../pages/personalCenter/personalCenter";

import {BusLineService} from "../services/busLine.service";
import {LocalStorage} from "../common/localStorage/localStorage";

@NgModule({
  declarations: [
    MyApp,
    WelcomePage,
    HomePage,
    SearchModalPage,
    LinePage,
    EnquirePage,
    EnquireNearbyPage,
    PersonalCenterPage,
    TabsPage
  ],
  imports: [
    BrowserModule, HttpModule, BrowserAnimationsModule, IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    WelcomePage,
    HomePage,
    SearchModalPage,
    LinePage,
    EnquirePage,
    EnquireNearbyPage,
    PersonalCenterPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    BusLineService,
    LocalStorage,
    SplashScreen, {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    }
  ]
})
export class AppModule {}