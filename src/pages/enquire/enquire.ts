import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Appconst} from "../../common/constants";
import {Resources} from "../../common/resources";
import {EnquireNearbyPage} from "./enquireNearby/enquireNearby";

declare var BMap;
@Component({selector: 'page-enquire', templateUrl: 'enquire.html'})
export class EnquirePage {
  //APP
  city : string = "上海";
  Resources : Resources = Resources.getInstance();
  //SCOPE
  radius : number = 500;
  availableRadius : Array < number >= [250, 500, 800, 1000];
  constructor(public navCtrl : NavController) {}
  ngOnInit() {}
  onTapSearchNearby() {
    this
      .navCtrl
      .push(EnquireNearbyPage, {
        city: this.city,
        radius: this.radius
      });
  }

}
