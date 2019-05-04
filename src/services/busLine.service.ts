import {Injectable} from '@angular/core';
import {Http, Jsonp, Response, Headers, RequestOptions} from '@angular/http';
import {Appconst} from "../common/constants";

@Injectable()
export class BusLineService {
    constructor(private http : Http) {}
    public getBusLine(dto : EnquireBusDto) {
        let headers = new Headers({'Content-Type': 'application/json'});
        let url = Appconst.URL + "Enquire/enquireBus.php";
        url += this.getParams(dto);
        // console.log(url);
        return this
            .http
            .get(url);
    }
    private getParams(dto : EnquireBusDto) : string {
        let params = "?";
        params += "name=";
        params += dto.name;
        params += "&";
        params += "lineid=";
        params += dto.lineid;
        params += "&";
        params += "stopid=";
        params += dto.stopid;
        params += "&";
        params += "stopname=";
        params += dto.stopname;
        return params;
    }
}
// localhost/shbus/Enquire/enquireBus.php?name=108路&lineid=108&stopid=8&stopname
// = 俞泾港路平型关路
// {"code":"1","msg":"成功","data":{"terminal":"沪B-86942","stopdis":"3","time":"41
// 3 ","distance":"1674"}}

export class EnquireBusDto {
    name : string = "";
    lineid : string = "";
    stopid : string = "";
    stopname : string = "";
    setDto(name : string, stopId : string, stopName : string, lineId
        ?
        : string) {
        this.name = name;
        this.stopid = stopId;
        this.stopname = stopName;
        if (lineId) {
            this.lineid = lineId;
        } else {
            this.lineid = name.replace(/[^0-9]/ig, "")
        }
    }
}
export class EnquireBusResultDto {
    code : string;
    msg : string;
    data : EnquireBusData;
    parseDto(dto : EnquireBusResultDto) {}
}
export class EnquireBusData {
    terminal : string;
    stopdis : string;
    time : string;
    distance : string;
}