import util from '../util';

export default class {
    id: string;
    name: string;
    tel: string;
    companyName: string;
    email: string;
    leaveMessage: string;
    timestamp: number;
    constructor(value?: any) {
        if (!value) return;
        this.id = value.id || util.uuid();

        this.name = value.name || '';

        this.tel = value.tel || '';

        this.companyName = value.companyName || '';

        this.email = value.email || '';
        
        this.leaveMessage = value.leaveMessage || '';
        
        this.timestamp = value.timestamp || Date.now();
    }
}