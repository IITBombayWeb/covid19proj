export class TableData {
    name: string;
    estimate: any;
    efun: any;
    units: string;
    constructor(name ,efunc, units="",estimate=""){
        this.name = name;
        this.efun = efunc;
        this.estimate = estimate;
        this.units = units
    }
}

