import { TimeAPI } from './timeAPI';

export class Input {
    constructor() {
        this.inputElement = document.querySelector('.js-input');
        this.promptElement = document.querySelector('.js-prompt');
        this.locationsList = [];
        this.promptElement.style.display = 'none';
        this.init();
    }

    init() {
        this.inputElement.addEventListener('input', this.inputListener(event));
        this.promptElement.addEventListener('click', (event) => {
            this.inputElement.value = event.target.dataset.value;
            this.emitEvent(this.inputElement.value);
        });
        this.inputElement.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && this.locationsList.length) {
                [this.inputElement.value] = this.locationsList;
                this.emitEvent(this.inputElement.value);
            }
        });
    }

    setPromt(locations) {
        if (locations.length) {
            this.promptElement.innerHTML = '';
            locations.forEach(location => {
                this.promptElement.innerHTML += this.setLocationItem(location);
            })
        }
    }

    setLocationItem(string) {
        const template = `
            <div class="input__field-item" data-value="${string}">${string}</div>
        `;
        return template;
    }

    emitEvent(value) {
        this.inputElement.dispatchEvent(new CustomEvent('setLocation', { 'detail': value }));
        this.promptElement.style.display = 'none';
    }

    inputListener() {
        return (event) => {
            if (event.target.value) {
                TimeAPI.filterTimeZones(event.target.value).then((locations) => {
                    if (locations.length) {
                        this.locationsList = locations;
                        this.setPromt(this.locationsList);
                        this.promptElement.style.display = 'block';
                    } else {
                        this.promptElement.style.display = 'none';
                        this.locationsList = [];
                    }
                })
            } else {
                this.promptElement.style.display = 'none';
            }
        }
    }
}
