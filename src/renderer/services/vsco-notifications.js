import axios from 'axios';
import qs from 'querystring';

export default class VscoNotifications {

    constructor(vscoSession){
        this.vscoSession = vscoSession;
    }

    async getNotifications(max_size){
        params.max_size = max_size || 50;
        params.site_id = this.vscoSession.userId;
        headers.Authorization = 'Bearer ' + this.vscoSession.authToken;
        const url = 'https://vsco.co/ghapi/2.0/notifications?' + qs.stringify(params);
        const resp = await axios.get(url, { headers });
        return resp.data.items;
    }

}

const params = {
    site_id: '',
    max_size: 50,
    app_id: '63897ba9-db13-4287-8881-306499769c53',
    app_version: 163
};

const headers = {
    'Accept-Language': 'en-US',
    'x-client-platform': 'android',
    'x-client-build': '3612',
    'x-client-locale': 'en-US',
    'Authorization': ''
}