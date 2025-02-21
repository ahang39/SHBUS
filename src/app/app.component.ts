import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {TabsPage} from '../pages/tabs/tabs';
import {WelcomePage} from "../pages/welcome/welcome";

@Component({templateUrl: 'app.html'})
export class MyApp {
  rootPage : any = WelcomePage;

  constructor(platform : Platform, statusBar : StatusBar, splashScreen : SplashScreen) {
    platform
      .ready()
      .then(() => {
        statusBar.styleDefault();
        statusBar.overlaysWebView(false);
        splashScreen.hide();
      });
  }
}
