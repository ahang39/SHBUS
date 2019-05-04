import {Component, ViewChild, ElementRef, ChangeDetectorRef} from '@angular/core';
import {ViewController, NavController, Searchbar} from 'ionic-angular';
import {LinePage} from '../line/line';
declare var BMap;

@Component({templateUrl: "./searchModal.html"})
export class SearchModalPage {
    param : string = "";
    cancelButtonText : string = "取消";
    placeholder : string = "线路";

    city : string = "上海";

    busLineSearch : any = null;

    busList : Array < busItem >= [];
    test : Array < string >= ["123", '3123', '123'];

    @ViewChild('searchBar')
    private searchbar : Searchbar;

    constructor(private viewCtrl : ViewController, private navCtrl : NavController, private change : ChangeDetectorRef) {}

    ngOnInit() {
        let that = this;
        this.busLineSearch = new BMap.BusLineSearch(this.city, {
            onGetBusListComplete: function (result) {
                that.busList = [];
                for (let i = 0; i < result.getNumBusList(); i++) {
                    let busItem = {
                        busListItem: result.getBusListItem(i),
                        busLine: {}
                    };
                    that
                        .busList
                        .push(busItem);
                    that
                        .busLineSearch
                        .getBusLine(result.getBusListItem(i));
                }
            },
            onGetBusLineComplete: function (busLine) {
                for (let i = 0; i < that.busList.length; i++) {
                    if (that.busList[i].busListItem.name == busLine.name) {
                        that.busList[i].busLine = busLine;
                    }
                }
                that
                    .change
                    .detectChanges();
            }
        });
        setTimeout(() => {
            that
                .searchbar
                .setFocus();
        }, 400);
    }
    dismiss(params : any) {
        this
            .viewCtrl
            .dismiss(params);
    }
    onInput(event) {
        this.searchLine(event.target.value);
    }
    onBlur(event) {
        //No input
        if (event.target.value === "") {
            //this.dismiss({success: false});
        }
    }
    onTapCancelBtn(event) {
        this.dismiss({success: false});
    }
    onTapListItem(busLine) {
        this.dismiss({success: true, busLine: busLine.busLine, city: this.city});
    }
    searchLine(busName : string) {
        this
            .busLineSearch
            .getBusList(busName);
    }
}

class busItem {
    busListItem : any;
    busLine : any;
}