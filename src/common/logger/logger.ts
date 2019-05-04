import {Injectable} from "@angular/core";

@Injectable()
export class Logger {
    private datetime : string="";
    private description : string="";
    private page : string="app";
    construct() {}
    public log(description : string, page ? : string) {
        let date = new Date();
        this.datetime = date.toLocaleDateString()+" "+date.toLocaleTimeString();
        this.description = description;
        if (page) {
            this.page = page;
        }
        console.log(`
        `+this.datetime+`
        `+this.description+`
        `+this.page
        );
    }
}
