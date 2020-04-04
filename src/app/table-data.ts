export class TableData {
    item: string;
    district: any;
    country:any
    state:any
    efun: any;
    units: string;
    constructor(item ,efunc, units="",district="",state="",country=""){
        this.item = item;
        this.efun = efunc;
        this.district = district;
        this.state = state;
        this.country = country;
        this.units = units
    }
}

