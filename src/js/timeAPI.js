const url = 'http://worldtimeapi.org/api/timezone';
let timeZones = [];

export class TimeAPI {

    static getTimeZones() { //все таймзоны
        if (!timeZones.length) {
            return fetch(url).then(data => data.json())
                .then(data => {
                    timeZones = data;
                    return timeZones;
                })
                .catch(err => reject(err));
        } else {
            return Promise.resolve(timeZones)
        }
    }

    static filterTimeZones(string) { // 5 таймзон для вывода в подсказке
        const filtredZones = TimeAPI.getTimeZones().then(zones => {
            return zones.filter(zone => zone.toLowerCase().includes(string)).slice(0, 5);
        })
        return filtredZones;
    }

    static getCurrentTime(timezone) {
        return fetch(`${url}/${timezone}`).then(data => data.json()).catch(error => console.log(error));
    }
}