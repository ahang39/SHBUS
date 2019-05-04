import {Component, ChangeDetectorRef, ViewChild, ElementRef, Renderer} from '@angular/core';
import {trigger, state, style, transition, animate} from '@angular/animations';
import {
  NavController,
  NavParams,
  ModalController,
  Content,
  Alert,
  AlertController,
  DomController
} from 'ionic-angular';

import {Appconst} from "../../common/constants";
import {Resources} from "../../common/resources";
import {FavouriteList, Favourite} from "../../model/favourites";
import {LocalStorage} from "../../common/localStorage/localStorage";
import {SearchBarComponent} from "./common/components/searchBar/searchBar.component"
import {LinePage} from "../line/line";
import {SearchModalPage} from "../search/searchModal";
import {EnquireBusDto, EnquireBusResultDto, BusLineService} from "../../services/busLine.service";
import {Timer} from "../../model/timer";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [
    trigger('contentState', [
      state('inactive', style({height: 0})),
      state('active', style({}))
    ]),
    trigger('arrowState', [
      state('inactive', style({})),
      state('active', style({transform: 'rotate(90deg)'}))
    ]),
    trigger('scrolling', [state("true", style({transform: 'scale(0.95, 0.95)'}))]),
    trigger('stickState', [
      state('inactive', style({display: 'none'})),
      state('closing', style({transform: 'scale(0, 0)', transition: "0.3s"})),
      state('active', style({}))
    ])
  ]
})
export class HomePage {
  //APP
  Resources = Resources.getInstance();
  timer : Timer = new Timer();
  timerHandle : any;
  timeAlert : Alert;
  refreshHandle : number;
  activeStation : number = -1;
  scrollingState : string = "false";
  stickState : string = "inactive";
  @ViewChild('content')content : Content;
  @ViewChild('stickStation')stickStation : ElementRef;;
  //SCOPE
  city : string = "上海";
  stickTimeIndex : number;
  stickStationName : String;
  stickBusNo : String;

  pullingText : string = this.Resources.PULLING_TEXT;
  refreshingText : string = this.Resources.REFRESHING_TEXT;
  label : string = this.Resources.SEARCH_BUTTON_LABEL;
  placeholder : string = this.Resources.SEARCH_BUTTON_PLACEHOLDER;

  get favourites() {
    return FavouriteList.favourites;
  }

  constructor(private navCtrl : NavController, public modalCtrl : ModalController, private busLineServ : BusLineService, private change : ChangeDetectorRef, private alertCtrl : AlertController, public renderer : Renderer, public domCtrl : DomController) {}

  ngOnInit() {
    let that = this;
    this.refreshFavouriteList();
    this.timeAlert = this
      .alertCtrl
      .create({
        title: "",
        subTitle: "",
        buttons: [this.Resources.CLOSE]
      });
    // this.refreshHandle = setInterval(() => {   that.refreshFavouriteList(); },
    // 20000);
    this.timerHandle = setInterval(() => {
      that
        .timer
        .countDown();
    }, 1000);
  }
  ngOnDestroy() {
    if (this.timerHandle) {
      clearInterval(this.timerHandle);
    }
  }
  ngAfterViewInit() {
    this
      .content
      .ionScrollStart
      .subscribe(() => {
        this.scrollingState = "true";
        if (this.activeStation !== this.timer.time.length - 1) {
          this.activeStation = -1;
        }
        this
          .change
          .detectChanges();
      });
    this
      .content
      .ionScrollEnd
      .subscribe(() => {
        this.scrollingState = "false";
        this
          .change
          .detectChanges();
      });
  }
  onTapSearchBtn(event) {
    let that = this;
    let searchModal = this
      .modalCtrl
      .create(SearchModalPage);
    searchModal.onDidDismiss((params) => {
      if (params.success) {
        that.navToLinePage(params.busLine, params.city);
      }
    });
    searchModal.present();
  }
  navToLinePage(busLine : any, city : string) {
    this
      .navCtrl
      .push(LinePage, {
        busLine: busLine,
        city: city
      });
  }
  doRefresh(event) {
    this.refreshFavouriteList();
    this.activeStation = -1;
    event.complete();
  }
  refreshFavouriteList() {
    FavouriteList.getList(this.setTimerByFavourites.bind(this));
  }
  setTimerByFavourites() {
    this
      .timer
      .newTimer(FavouriteList.favourites.length);
    FavouriteList
      .favourites
      .forEach(fav => {
        let dto = new EnquireBusDto();
        dto.setDto(fav.busName, fav.stopid.toString(), fav.stationName);
        this
          .busLineServ
          .getBusLine(dto)
          .subscribe((data) => {
            try {
              let result : EnquireBusResultDto = data.json();
              this
                .timer
                .setTimer(FavouriteList.favourites.indexOf(fav), Number.parseInt(result.data.time));
            } catch (ex) {
              console.log(data);
              this
                .timer
                .setTimer(FavouriteList.favourites.indexOf(fav), -2);
            }
          }, err => {
            console.error(err)
          });
      });

  }
  onTapArrow(index : number) {
    this.activeStation = this.activeStation === index
      ? -1
      : index;
  }
  onTapDeleteBtn(busName : string, stationName : string, stopid : number) {
    if (FavouriteList.inList(busName, stationName, stopid)) {
      FavouriteList.removeFav(busName, stationName, stopid);
    }
    this.activeStation = -1;
    this.refreshFavouriteList();
  }
  onTapUpBtn(index : number) {
    FavouriteList.reorderFav(index, 0);
    this
      .timer
      .reorderTimer(index, 0);
    this.activeStation = 0;
    this
      .content
      .scrollToTop();
    this
      .change
      .detectChanges();
  }
  onTapStickBtn(index : number) {
    this.stickTimeIndex = index;
    this.stickBusNo = FavouriteList.favourites[index].busName;
    this.stickStationName = FavouriteList.favourites[index].stationName;
    this.activeStation = -1;
    this.stickState = "active";
  }
  onTapCloseStickBtn() {
    this.stickState = "closing";
    setTimeout(() => {
      this.stickState = "inactive";
    }, 300)
  }
  log(anything) {
    console.log(anything);
  }
  onDragStick(ev) {
    console.log(ev);
    let newLeft = ev.center.x - ev.target.clientWidth / 2;
    let newTop = ev.center.y - ev.target.clientHeight / 2;
    newLeft = newLeft >= 0
      ? newLeft
      : 0;
    newTop = newTop >= 0
      ? newTop
      : 0;

    this
      .domCtrl
      .write(() => {
        this
          .renderer
          .setElementStyle(this.stickStation.nativeElement, 'left', newLeft + 'px');
        this
          .renderer
          .setElementStyle(this.stickStation.nativeElement, 'top', newTop + 'px');
      });

  }
}