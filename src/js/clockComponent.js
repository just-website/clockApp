import { TimeAPI } from './timeAPI';

export class Clock {
    constructor(data) {
        this.digitalMode = true;
        this.fullForamt = true;
        this.timezone = data.timezone;
        this.startTime = data.datetime.slice(0, 19);
        this.currentTime = new Date(this.startTime);
        this.template = this.getTemplate();
        this.timer;
        this.init();
        this.syncTimer(5);
    }

    init() {
        this.timer = setInterval(() => {
            this.setNewTime(null);
            this.template.dispatchEvent(new CustomEvent('update', { detail: this.currentTime }));
        }, 1000);
    }

    async syncTime() {
        const syncTime = await TimeAPI.getCurrentTime(this.timezone);
        this.startTime = syncTime.datetime.slice(0, 19);
        this.currentTime = new Date(this.startTime);
        this.removeTimer();
        this.init();
    }

    syncTimer(minutes) {
        setInterval(() => {
            this.syncTime();
        }, 1000 * 60 * minutes);
    }

    removeTimer() {
        clearInterval(this.timer);
    }

    setNewTime(time) {
        if (!time) {
            this.currentTime.setSeconds(this.currentTime.getSeconds() + 1);
        }
    }

    getTemplate() {
        const template = this.digitalMode ?
            this.digitalTemplate
            : this.analogTemplate;
        return template;
    }

    get hours() {
        if (this.fullForamt) {
            return this.parseTime(this.currentTime.getHours());
        } else {
            return this.currentTime.getHours() >= 12 ? this.parseTime(this.currentTime.getHours() - 12) : this.parseTime(this.currentTime.getHours());
        }
    }

    get minutes() {
        return this.parseTime(this.currentTime.getMinutes());
    }

    get seconds() {
        return this.parseTime(this.currentTime.getSeconds());
    }

    get city() {
        return this.timezone ? this.timezone.split('/')[1].replace('_', ' ') : '';
    }

    get timeFormat() {
        if (!this.fullForamt) {
            return this.currentTime.getHours() <= 12 ? 'am' : 'pm'
        } else {
            return ''
        }
    }

    get analogHours() {
        return (this.currentTime.getHours() * 360 / 12) + (this.currentTime.getMinutes() * (360 / 60) / 12)
    }

    get analogMinutes() {
        return (this.currentTime.getMinutes() * 360 / 60) + (this.currentTime.getSeconds() * (360 / 60) / 60);
    }

    get analogSeconds() {
        return this.currentTime.getSeconds() * 360 / 60;
    }

    parseTime(number) {
        let string = String(number);
        if (string.length === 1) {
            string = '0' + string;
        }
        return string;
    }

    get digitalTemplate() {
        const wrapper = document.createElement('div');
        wrapper.classList.add('clock-wrapper');
        wrapper.innerHTML = `
            <div class="clock">
                <div class="clock-format">${this.timeFormat}</div>
                <div class="clock-hours">${this.hours}</div>
                :
                <div class="clock-minutes">${this.minutes}</div>
                :
                <div class="clock-seconds">${this.seconds}</div>
            </div>
            <div class="clock-name">
                ${this.city}
            </div>
        `;
        return wrapper;
    }

    get analogTemplate() {
        const wrapper = document.createElement('div');
        wrapper.classList.add('clock-wrapper');
        wrapper.innerHTML = `
            <div class="analog-clock">
                <div class="hour_hand" style="transform: rotateZ(${this.analogHours}deg)"></div>
                <div class="minute_hand" style="transform: rotateZ(${this.analogMinutes}deg)"></div>
                <div class="second_hand" style="transform: rotateZ(${this.analogSeconds}deg)"></div>
            </div>
            <div class="clock-name">
                ${this.city}
            </div>
        `;
        return wrapper;
    }
}