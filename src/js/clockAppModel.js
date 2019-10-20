import { TimeAPI } from './timeAPI';
import { Input } from './inputComponent';
import { Clock } from './clock';

export class ClockModel {
    constructor() {
        this.cityInput = new Input;
        this.location = '' //'Europe/Moscow';
        this.controls = document.querySelector('.js-controls');
        this.clockList = [];
        this.clockArea = document.querySelector('.js-clock-container');
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
        }
    }

    async addClock() {
        if (this.location) {
            const time = await TimeAPI.getCurrentTime(this.location);
            const clock = new Clock(time);
            clock.template.addEventListener('update', () => this.render());
            this.clockList.push(clock);
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
    }
}

