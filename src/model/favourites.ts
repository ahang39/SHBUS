import {LocalStorage} from "../common/localStorage/localStorage";
import {Appconst} from "../common/constants";
import {BusStation} from "./busStationList";

export class FavouriteList {
    static favourites : Array < Favourite >= [];
    static getList(callback) {
        let result = LocalStorage.getItem(Appconst.FAVOURITES);
        result.then(data => {
            if (data === null) {
                this.favourites = [];
            } else {
                let favs : Array < Favourite > = [];
                try {
                    favs = JSON.parse(data);
                } catch (err) {
                    console.log(err);
                }
                this.favourites = favs;
            }
            callback();
        });
    }
    static saveList() {
        let json = JSON.stringify(this.favourites);
        LocalStorage.setItem(Appconst.FAVOURITES, json);
    }
    static removeFav(busName : string, stationName : string, stopid : number) {
        let index : number = this
            .favourites
            .findIndex(fav => fav.busName === busName && fav.stationName === stationName && fav.stopid === stopid);
        if (index !== -1) {
            this
                .favourites
                .splice(index, 1);
            this.saveList();
        }
    }
    static insertFav(busName : string, stationName : string, stopid : number) {
        let index : number = this
            .favourites
            .findIndex(fav => fav.busName === busName && fav.stationName === stationName && fav.stopid === stopid);
        if (index === -1) {
            this
                .favourites
                .push({busName: busName, stationName: stationName, stopid: stopid});
            this.saveList();
        }
    }
    static inList(busName : string, stationName : string, stopid : number) {
        return FavouriteList
            .favourites
            .find(fav => fav.busName === busName && fav.stationName === stationName && fav.stopid === stopid) !== undefined;
    }
    static reorderFav(origin : number, after : number) {
        let fav = this.favourites[origin];
        let pre = this
            .favourites
            .slice(0, after);
        let suf = this
            .favourites
            .slice(after + 1, this.favourites.length);
        this.favourites = pre.concat(fav, suf);
        this.saveList();
    }
}

export class Favourite {
    busName : string;
    stationName : string;
    stopid : number;
}
