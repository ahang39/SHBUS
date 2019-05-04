import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {Appconst} from "../../../common/constants";
import {Resources} from "../../../common/resources";
declare var BMap;
@Component({selector: 'page-enquireNearby', templateUrl: 'enquireNearby.html'})
export class EnquireNearbyPage {
    //MAP properties
    private map : any;
    city : string;
    searchRadius : number;
    locationPin : any = new BMap.Icon("assets/icon/location.png", new BMap.Size(15, 15));
    mapPin : any = new BMap.Icon("assets/icon/pin.png", new BMap.Size(20, 20));
    gpsPin : any = new BMap.Icon("assets/icon/gps.png", new BMap.Size(20, 20));
    geolocation : any = new BMap.Geolocation();
    @ViewChild('container')mapElement : ElementRef;
    @ViewChild('result')resultElement : ElementRef;

    //MAP Component
    circle : any;
    locationMarker : any;
    currentLocation : any;
    //APP
    locator : any;
    selectedItem : any;
    Resources = Resources.getInstance();
    searchResultsList = [];

    constructor(public navCtrl : NavController, private navParams : NavParams, public toastCtrl : ToastController) {
        this.circle = new BMap.Circle(new BMap.Point(0, 0), 0, {
            fillColor: "blue",
            strokeWeight: 1,
            fillOpacity: 0.1,
            strokeOpacity: 0.2,
            enableMassClear: false
        });
    }
    ngOnInit() {
        let that = this;
        this.city = this
            .navParams
            .get("city");
        this.searchRadius = this
            .navParams
            .get("radius");
        this.loadMap(this.city);
        this.locate();
        this.locator = setInterval(this.locate.bind(this), 20000);
        this.searchNearby();
    }
    ngOnDestroy() {
        if (this.locator) {
            clearInterval(this.locator);
        }
    }

    //MAP
    loadMap(city : string) {
        this.map = new BMap.Map(this.mapElement.nativeElement);
        this
            .map
            .setMapStyle({features: ["road"]});
        this
            .map
            .centerAndZoom(city, 12);
        this
            .map
            .addOverlay(this.circle);
    }
    locate() {
        let that = this;
        that.getCurrentLocation((result) => {
            if (that.locationMarker) {
                that
                    .map
                    .removeOverlay(that.locationMarker);
            }
            this.locationMarker = this.addMarkerToMap(result.point, this.locationPin, Appconst.MY_LOCATION, false, null);
        });
    }
    getCurrentLocation(callback : Function) {
        let that = this;
        this
            .geolocation
            .getCurrentPosition(function (result) {
                if (this.getStatus() === Appconst.BMAP_STATUS_SUCCESS) {
                    that.currentLocation = result.point;
                    callback(result);
                } else {
                    that.presentToast(that.Resources.GEO_LOCATION_FAILED, 3000);
                    clearInterval(that.locator);
                    that.locator = null;
                }
            }, {enableHighAccuracy: true})
    }
    searchNearby() {
        let that = this;
        this.getCurrentLocation(function (result) {
            var local = new BMap.LocalSearch(result.point, {
                pageCapacity: 100,
                onSearchComplete: function (localResult : any) {
                    //Update Circle & List
                    that
                        .map
                        .clearOverlays();
                    that
                        .circle
                        .setCenter(result.point);
                    that
                        .circle
                        .setRadius(that.searchRadius);
                    that.searchResultsList = [];

                    //Add result to List
                    for (let i = 0; i < localResult.getCurrentNumPois(); i++) {
                        let item = localResult.getPoi(i);
                        item.active = false;
                        that
                            .searchResultsList
                            .push(item);
                        that.addMarkerToMap(localResult.getPoi(i).point, that.mapPin, Appconst.BUS_STOP, true, 2);
                    }
                    that.resultElement.nativeElement.scrollTop = 0;
                    //Focus
                    that
                        .map
                        .centerAndZoom(result.point, 15);
                }
            });
            local.searchNearby(Appconst.SEARCH_KEYWORD, result.point, that.searchRadius);
        });
    }
    addMarkerToMap(point : any, icon : any, title : string, massClear : boolean, animation : number) {
        let marker = new BMap.Marker(point, {
            icon: icon,
            enableMassClear: massClear
        });
        this
            .map
            .addOverlay(marker);
        marker.setTitle(title);
        if (animation) {
            marker.setAnimation(animation);
        }
        return marker;

    }
    //APP
    presentToast(message : string, duration : number) {
        let toast = this
            .toastCtrl
            .create({message: message, duration: duration});
        toast.present();
    }
    onTapResfresher(event) {
        if (this.locator) {
            this.locator = setInterval(this.locate.bind(this), 2000);
        }
        this.searchNearby();
        this.searchResultsList = [];
    }
    onTapListItem(item, event) {
        let that = this;
        //Clear the mass
        this
            .map
            .clearOverlays();

        //Set active to selected item
        this
            .searchResultsList
            .forEach(listItem => {
                listItem.active = false;
            });
        item.active = true;

        // BMAP_ANIMATION_BOUNCE=2
        this.addMarkerToMap(item.point, this.mapPin, Appconst.BUS_STOP, true, 1);

        //Enquire the walking route
        let walkingRoute = new BMap.WalkingRoute(this.city, {
            renderOptions: {
                map: that.map,
                autoViewport: true
            },
            onMarkersSet: (pois) => {
                pois.forEach(poi => {
                    that
                        .map
                        .removeOverlay(poi.marker);
                });
            }
        });
        if (this.currentLocation) {
            walkingRoute.search(this.currentLocation, item.point);
        } else {
            this.presentToast(this.Resources.GEO_LOCATION_FAILED, 3000);
        }
    }
}