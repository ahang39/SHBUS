import {Resources} from "../common/resources";

export class BusStationList {
    public stations : Array < BusStation >= [];
    public success : boolean = false;
    public length() {
        return this.stations.length;
    }
    public addStation(title : string, point : any, marker : any) {
        let station = new BusStation();
        station.title = title;
        station.point = point;
        station.marker = marker;
        station.setTimer(-1);
        station.setDistance(-1);
        station.setStopRemain(-1);
        this
            .stations
            .push(station);
    }
    public getPoints() : Array < any > {
        let points: Array < any >= [];
        this
            .stations
            .forEach(station => {
                points.push(station.point);
            });
        return points;
    }
}

export class BusStation {
    public title : string = "";
    public point : any = null;
    public marker : any = null;
    public distance : number = null;
    public distanceText : string = "";
    public timer : number = 0;
    public timerText : string = Resources
        .getInstance()
        .GETTING_DATA;
    public stopRemain : number = 0;
    public stopRemainText : string = "";
    public terminal : string = "";

    setTimer(time : number) {
        this.timer = time;
        this.timerText = this.getTimeStr(time);
    }
    getTimeStr(time : number) : string {
        if(time === -1) {
            return Resources
                .getInstance()
                .GETTING_TIMER;
        } else if (time === -2) {
            return Resources
                .getInstance()
                .NOT_YET_STARTED;
        } else if (time < 0) {
            return Resources
                .getInstance()
                .TIME_ERROR;
        }
        let second: number = time % 60;
        let minute: number = Math.floor(time / 60);
        let secondText: string = second >= 10
            ? second.toString()
            : "0" + second.toString();
        let minuteText: string = minute >= 10
            ? minute.toString()
            : "0" + minute.toString();
        return Resources
            .getInstance()
            .TIME_LABEL + minuteText + ":" + secondText;
    }

    setDistance(distance : number) {
        this.distance = distance;
        this.distanceText = this.getDistanceStr(distance);
    }
    getDistanceStr(distance : number) : string {
        if(distance < 0) {
            return Resources
                .getInstance()
                .GETTING_DISTANCE;
        }
        let Resource = Resources.getInstance();
        let text: string = "";
        if (distance >= 1000) {
            text = Resource.DISTANCE_FROM_ME + Math.floor(distance / 100) / 10 + Resource.KILOMETER;
        } else if (distance >= 0 && distance < 1000) {
            text = Resource.DISTANCE_FROM_ME + distance + Resource.METER;
        } else {
            text = Resource.DISTANCE_ERROR;
        }
        return text;
    }

    setStopRemain(stopRemain : number) {
        this.stopRemain = stopRemain;
        this.stopRemainText = this.getStopRemainStr(stopRemain);

    }
    getStopRemainStr(stopRemain : number) : string {
        if(stopRemain === -1) {
            return Resources
                .getInstance()
                .GETTING_STOP_REMAIN;
        } else if (stopRemain === -2) {
            return "";
        } else if (stopRemain < 0) {
            return Resources
                .getInstance()
                .STOP_REMAIN_ERROR;
        }
        return Resources
            .getInstance()
            .STOPDIS_LABEL + stopRemain;
    }

    setTerminal(terminal : string) {
        if (terminal === null) {
            this.terminal = "";
        } else {
            this.terminal = Resources
                .getInstance()
                .TERMINAL_LABEL + terminal;
        }
    }
}