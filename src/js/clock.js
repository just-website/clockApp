const analogTemplate = ``;

export class Clock {
    constructor(data) {
        this.timezone = data.timezone;
        this.startTime = data.datetime.slice(0, 19);
        this.currentTime = new Date(this.startTime);
        this.mode = 'digital';
        this.template = this.getTemplate();
        this.init();
    }

    init() {
        setInterval(() => {
            this.setNewTime(null);
            this.template.dispatchEvent(new Event('update'));
        }, 1000);
    }

    setNewTime(time) {
        if (!time) {
            this.currentTime.setSeconds(this.currentTime.getSeconds() + 1);
        }
    }

    getTemplate() {
        const template = this.mode === 'digital' ?
            this.digitalTemplate
            : analogTemplate;
        return template;
    }

    get hours() {
        return this.parseTime(this.currentTime.getHours());
    }

    get minutes() {
        return this.parseTime(this.currentTime.getMinutes());
    }

    get seconds() {
        return this.parseTime(this.currentTime.getSeconds());
    }

    get city() {
        return this.timezone.split('/')[1];
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
}