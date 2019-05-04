import {Injectable} from "@angular/core";
import {Storage} from "@ionic/storage";

@Injectable()
export class LocalStorage {
    static local : Storage = new Storage(null);
    constructor() {}
    static getItem(key : string) {
        let value = this
            .local
            .get(key);
        return value;
    }
    static setItem(key : string, value : string) {
        this
            .local
            .set(key, value);
    }
    static removeItem(key : string) {
        this
            .local
            .remove(key);
    }

}
