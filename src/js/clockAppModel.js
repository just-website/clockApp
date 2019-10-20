import { TimeAPI } from './timeAPI';
import { Input } from './inputComponent';
import { Clock } from './clockComponent';

export class ClockModel {
    constructor() {
        this.cityInput = new Input;
        this.location = '' //'Europe/Moscow';
        this.controls = document.querySelector('.js-controls');
        this.clockArea = document.querySelector('.js-clock-container');
        this.dateArea = document.querySelector('.js-date-day');
        this.titleArea = document.querySelector('title');
        this.clockList = [];
        this.titleTime = '';
        this.init();
    }

    init() {
        this.cityInput.inputElement.addEventListener('setLocation', (event) => {
            this.location = event.detail;
        });
        this.controls.addEventListener('click', (event) => {
            const target = event.target;
            this.controlEvent(target);
        })
    }

    controlEvent(elem) {
        if (elem.classList.contains('js-btn-add')) {
            this.addClock();
        } else if (elem.classList.contains('js-btn-sync')) {
            this.syncClock();
        } else if (elem.classList.contains('js-btn-format')) {
            if (this.clockList.length) {
                this.clockList.forEach(clock => {
                    clock.fullForamt = !clock.fullForamt;
                    // clock.syncTime();
                });
            }
        } else if (elem.classList.contains('js-btn-change')) {
            this.clockList.forEach(clock => clock.digitalMode = !clock.digitalMode)
        }
    }

    syncClock() {
        this.clockList.forEach(clock => clock.syncTime());
    }

    async addClock() {
        if (this.location) {
            const time = await TimeAPI.getCurrentTime(this.location);
            const clock = new Clock(time);
            clock.template.addEventListener('update', (event) => {
                this.render();
                this.titleTime = event.detail;
                this.setDateDay();
            });
            if (this.clockList.length) { // удалить, если несколько часов
                this.clockList.forEach(clock => clock.removeTimer());
            }
            this.clockList = [clock]; // поменять на push(clock) что бы отображать несколько часов
            this.render();
            this.cityInput.inputElement.value = '';
            this.location = '';

        }
    }

    render() {
        this.clockArea.innerHTML = '';
        this.clockList.forEach(clock => {
            this.clockArea.appendChild(clock.getTemplate());
        })
        this.setTitle();
    }

    setTitle() {
        const time = new Date(this.titleTime).toLocaleTimeString();
        if (time && time !== 'Invalid Date') {
            this.titleArea.innerHTML = time;
        }
    }

    setDateDay() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        this.dateArea.innerHTML = new Date(this.titleTime).toLocaleDateString('ru-RU', options);
    }
}

