export class TableData {
    name: string;
    estimate: any;
    country:any
    state:any
    efun: any;
    units: string;
    constructor(name ,efunc, units="",estimate="",state="",country=""){
        this.name = name;
        this.efun = efunc;
        this.estimate = estimate;
        this.state = state;
        this.country = country;
        this.units = units
    }
}

