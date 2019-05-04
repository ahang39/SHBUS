import {Component, ViewChild, ElementRef, ChangeDetectorRef, Input} from '@angular/core';
import {NavController, NavParams, ToastController, Slides} from 'ionic-angular';
import {Appconst} from "../../common/constants";
import {Resources} from "../../common/resources";
import {BusLineService, EnquireBusDto, EnquireBusResultDto} from "../../services/busLine.service";
import {LocalStorage} from "../../common/localStorage/localStorage";
import {BusStationList, BusStation} from "../../model/busStationList";
import {FavouriteList} from "../../model/favourites";
declare var BMap;
@Component({selector: "page-line", templateUrl: 'line.html'})
export class LinePage {

  //MAP
  map : any;
  buslineSearch : any;
  geoLocation : any;
  nearestLabel : any;
  currentMarker : any;
  currentStation : BusStation = new BusStation();
  locationPin : any = new BMap.Icon("assets/icon/location.png", new BMap.Size(15, 15));
  gpsPin : any = new BMap.Icon("assets/icon/gps.png", new BMap.Size(20, 20));
  @ViewChild('map')mapElement : ElementRef;
  @ViewChild('popInfo')popInfoElement : ElementRef;

  //APP
  city : string;
  stationList : BusStationList = new BusStationList();
  counterHandler : number;
  Resources = Resources.getInstance();
  @ViewChild(Slides)slides : Slides;

  //SCOPE
  busLine : any;
  busNo : string;
  startStation : any;
  endStation : any;

  constructor(private navCtrl : NavController, private navParams : NavParams, private toastCtrl : ToastController, private change : ChangeDetectorRef, private storage : LocalStorage, private busLineServ : BusLineService) {}
  ngOnInit() {
    let that = this;
    //Set timer
    this.counterHandler = setInterval(this.countDown.bind(this), 1000);
    //Get Params
    this.city = this
      .navParams
      .get("city")
    this.busLine = this
      .navParams
      .get("busLine");
    this.parseBusLineInfo();
    //Load Map
    this.loadMap(this.city);
    //Bus Line Search
    this.buslineSearch = new BMap.BusLineSearch(that.map, {
      renderOptions: {
        map: that.map,
        autoViewport: true
      },
      onGetBusLineComplete: (result) => {},
      onGetBusListComplete: (result) => {
        that
          .buslineSearch
          .getBusLine(result.getBusListItem(0));
        console.log(result);

      },
      onMarkersSet: (result : Array < any >) => {
        result.forEach(item => {
          item.enableClicking = false
          item.setZIndex(100);
          //Add stations to list
          that
            .stationList
            .addStation(item.getTitle(), item.getPosition(), item);
          //Add Events
          item.addEventListener('click', (event) => {
            that.setCurrentStation(result.indexOf(item), true);
          });
          item.addEventListener('infowindowopen', (event) => {
            event
              .target
              .closeInfoWindow();

          });
        });
        that.getBusLine();
        setTimeout(() => {
          that.setCurrentStation(0, false);
        }, 500);
      }
    });
    this.searchLine(this.busNo);
    //Add Control
    this.currentMarker = new BMap.Marker(new BMap.Point(0, 0), {icon: this.gpsPin});
    this
      .currentMarker
      .setZIndex(500);
    this.nearestLabel = new BMap.Label(this.Resources.NEAREST_STATION_LABEL, {
      offset: new BMap.Size(20, -10)
    });
    this.geoLocation = new BMap.GeolocationControl({anchor: 1, locationIcon: this.locationPin, showAddressBar: true});
    this
      .geoLocation
      .addEventListener('locationSuccess', (result) => {
        setTimeout(() => {
          if (that.stationList.stations.length === 0) {
            that.presentToast(that.Resources.BUSLINE_SEARCH_FAILED, 3000);
            return;
          }
        }, 3000);
        let nearest : number = Number.MAX_SAFE_INTEGER;
        let nearestStation : BusStation = null;
        that
          .stationList
          .stations
          .forEach(station => {
            //Caculate distance
            let distance = that
              .map
              .getDistance(result.point, station.point);
            station.setDistance(Math.floor(distance));
            //Find nearest
            if (distance < nearest) {
              nearest = distance;
              nearestStation = station;
            }
            nearestStation
              .marker
              .setLabel(that.nearestLabel);
          });
        setTimeout(() => {
          that
            .map
            .setViewport(that.stationList.getPoints().concat(result.point));
        }, 2000)

      });
    this
      .map
      .addControl(this.geoLocation);
    this
      .geoLocation
      .location();
  }
  ngOnDestroy() {
    if (this.counterHandler) {
      clearInterval(this.counterHandler);
    }
  }
  parseBusLineInfo() {
    let name : string = this.busLine.name;
    this.busNo = name.split('(')[0];
    this.startStation = this
      .busLine
      .getBusStation(0);
    this.endStation = this
      .busLine
      .getBusStation(this.busLine.getNumBusStations() - 1);
  }
  loadMap(city : string) {
    this.map = new BMap.Map(this.mapElement.nativeElement);
    this
      .map
      .setMapStyle({features: ["road"]});
    this
      .map
      .centerAndZoom(city, 12);
  }
  searchLine(busName) {
    this
      .buslineSearch
      .setLocation(this.city);
    this
      .buslineSearch
      .getBusList(busName);
  }
  getBusLine() {
    let that = this;
    this
      .stationList
      .stations
      .forEach(station => {
        let dto = new EnquireBusDto();
        dto.setDto(that.busNo, that.stationList.stations.indexOf(station).toString(), station.title);
        that
          .busLineServ
          .getBusLine(dto)
          .subscribe((data) => {
            let result : EnquireBusResultDto = new EnquireBusResultDto;
            try {
              result = data.json();
              if (result.code != "1" || result.msg != "成功") {
                station.setTimer(-2);
                station.setStopRemain(-2);
                station.setTerminal(null);
                return;
              }
              if (result.data.distance === "null" && result.data.stopdis === "null" && result.data.terminal === "null" && result.data.time === "null") {
                station.setTimer(-2);
                station.setStopRemain(-2);
                station.setTerminal(null);
                return;
              }
              station.setTimer(Number.parseInt(result.data.time));
              station.setStopRemain(Number.parseInt(result.data.stopdis));
              station.setTerminal(result.data.terminal);
            } catch (err) {
              station.setTimer(-2);
              station.setStopRemain(-2);
              station.setTerminal(null);
              console.log(err);
              console.log(result);
              return;
            }
          }, //For Success Response
              err => {
            console.error(err)
          } //For Error Response
          );
      });
    this.stationList.success = true;
  }
  presentToast(message : string, duration : number) {
    let toast = this
      .toastCtrl
      .create({message: message, duration: duration});
    toast.present();
  }
  countDown() {
    this
      .stationList
      .stations
      .forEach(station => {
        if (station.timer > 0) {
          station.setTimer(station.timer - 1);
        }
        // if (station.timer === 0) {   this.getBusLine();   return; }
      });
  }
  setCurrentStation(index : number, zoom : boolean) {
    if (index >= this.stationList.stations.length) {
      return;
    }
    this
      .slides
      .slideTo(index, 500);
    let point : any = this
      .stationList
      .stations[index]
      .marker
      .getPosition();
    this
      .map
      .addOverlay(this.currentMarker);
    this
      .currentMarker
      .setPosition(point);
    this.currentStation = this.stationList.stations[index];
    if (zoom) {
      this
        .map
        .panTo(this.stationList.stations[index].point);
    }
  }
  onTapStarBtn(busName : string, stationName : string, stopid : number) {
    if (FavouriteList.inList(busName, stationName, stopid)) {
      FavouriteList.removeFav(busName, stationName, stopid);
    } else {
      FavouriteList.insertFav(busName, stationName, stopid);
    }
  }
  isFavourite(station : BusStation) {
    return FavouriteList.inList(this.busNo, station.title, this.stationList.stations.indexOf(station));
  }
}
