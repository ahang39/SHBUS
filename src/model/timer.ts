import {FavouriteList} from "../model/favourites";
import {Resources} from "../common/resources";
import {Injectable} from "@angular/core";

export class Timer {
    time : Array < number >= [];
    timeText : Array < string >= [];
    getTime(index : number) {
        if (index >= this.timeText.length) {
            return this.getTimeStr(-1);
        } else {
            return this.timeText[index];
        }
    }
    newTimer(count : number) {
        this.time = new Array < number > (count);
        this.timeText = new Array < string > (count);
    }
    setTimer(index : number, time : number) {
        if (index >= this.time.length) {
            return;
        }
        if (isNaN(time)) {
            time = -2;
        }
        let timeStr = this.getTimeStr(time);
        this.time[index] = time;
        this.timeText[index] = timeStr;
    }
    countDown() : boolean {
        let countZero: boolean = false;
        for (let i = 0; i < this.time.length; i++) {
            if (this.time[i] > 0) {
                this.time[i] -= 1;
                this.timeText[i] = this.getTimeStr(this.time[i]);
            }
            if (this.time[i] === 0) {
                countZero = true;
            }
        }
        return countZero;
    }
    getTimeStr(time : number) : string {
        if(time === -1) {
            return "...";
        } else if (time === -2) {
            return "N : A";
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
        return minuteText + ":" + secondText;
    }
    reorderTimer(origin : number, after : number) {
        let time = this.time[origin];
        let timeText = this.timeText[origin];

        let preTime = this
            .time
            .slice(0, after);
        let sufTime = this
            .time
            .slice(after + 1, this.time.length);
        this.time = preTime.concat(time, sufTime);

        let preTimeText = this
            .timeText
            .slice(0, after);
        let sufTimeText = this
            .timeText
            .slice(after + 1, this.timeText.length);
        this.timeText = preTimeText.concat(timeText, sufTimeText);
    }
}