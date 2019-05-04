import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {TabsPage} from '../tabs/tabs';
import {FavouriteList, Favourite} from "../../model/favourites";
import {LocalStorage} from "../../common/localStorage/localStorage";

@Component({selector: 'page-welcome', templateUrl: 'welcome.html'})
export class WelcomePage {

    sliderOptions : any;

    constructor(public navCtrl : NavController) {}

    initializeApp() {
        FavouriteList.getList(null);
    }

    ionViewDidLoad() {
        let that = this;
        setTimeout(() => {
            that.goToHome();
        }, 5000);
    }

    goToHome() {
        this
            .navCtrl
            .setRoot(TabsPage);
    }
}