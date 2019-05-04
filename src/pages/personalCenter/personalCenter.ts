import {Component} from '@angular/core';
import {Appconst} from "../../common/constants";
import {Resources} from "../../common/resources";
import {NavController} from 'ionic-angular';

@Component({selector: 'page-personal-center', templateUrl: 'personalCenter.html'})
export class PersonalCenterPage {

  Resources = Resources.getInstance();

  constructor(public navCtrl : NavController) {}

}
