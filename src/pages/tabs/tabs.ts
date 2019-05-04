import {Component} from '@angular/core';

import {HomePage} from '../home/home';
import {EnquirePage} from '../enquire/enquire';
import {PersonalCenterPage} from '../personalCenter/personalCenter';

import {Appconst} from "../../common/constants";
import {Resources} from "../../common/resources";

@Component({templateUrl: 'tabs.html'})
export class TabsPage {

  Resources = Resources.getInstance();
  
  homeRoot : any = HomePage;
  enquireRoot : any = EnquirePage;
  personalCenterRoot : any = PersonalCenterPage;

  constructor() {}
}
