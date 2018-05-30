import { BaseServices } from './baseServices';
import company from '../model/company';

export class CompanyService extends BaseServices<company> {
    constructor() {
        super('collaborators');
    }

}

export default new CompanyService();