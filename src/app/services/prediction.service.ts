import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin,Observable } from 'rxjs'; 
import { TableData } from '../models/table-data';


@Injectable({
  providedIn: 'root'
})


export class PredictionService {
  
  constructor(private http: HttpClient) { 

  }

  public requestDataFromMultipleSources(): Observable<any[]> {
    let urls = [];
    let responses = [];
    
    urls.push("https://api.covid19india.org/states_daily.json");
    urls.push("https://api.covid19india.org/raw_data1.json");
    urls.push("https://api.covid19india.org/raw_data2.json");
    urls.push("https://api.covid19india.org/raw_data3.json");
    
    
    for (let i=0; i<urls.length; i++)
      responses.push(this.http.get(urls[i]));
    
    return forkJoin(responses);
  }

  public getTableData(dn,sn,cn,ilist,retString){
    let rVal:any= [];

    if (retString != "") {
      for (let i=0;i<ilist.length;i++) {
        for(let j=0;j<ilist[i].itemCounts.length;j++){
          ilist[i].itemCounts[j].district =   retString ;
          ilist[i].itemCounts[j].state    =   retString;
          ilist[i].itemCounts[j].country  =   retString ;
        }
        rVal[i] = ilist[i].itemCounts
      }
      return  rVal
    }
  

    //console.log('dn,sn,cn: ', dn,sn,cn)
    
    for (let i=0;i<ilist.length;i++) {
      rVal[i] = []
      for(let j=0;j<ilist[i].itemCounts.length;j++){
        
        ilist[i].itemCounts[j].district =   ilist[i].itemCounts[j].efun(dn) ;
        ilist[i].itemCounts[j].state    =   ilist[i].itemCounts[j].efun(sn) ;
        ilist[i].itemCounts[j].country  =   ilist[i].itemCounts[j].efun(cn) ;
        
      }
      
      rVal[i] = ilist[i].itemCounts
    }

    return rVal;
  }


  // tau:any = 7; // mortality residence time in days
  // fc:any = 2*this.tau
  // fs:any = 15/2.5*this.tau
  // fi:any = 80/2.5*this.tau
  // fd:any = 1;

  fc:any = 0.05
  fs:any = 0.15*2 // twice residence time
  fi:any = 0.8*2 // twice residence time
  fd:any = 0.025


  public numformat(x,n=2) {
    //return x
    return Number(Number(x.toPrecision(n)).toFixed()).toLocaleString("en-IN")
  }

  
  public icu(){

    let fc = this.fc
    let fd = this.fd
    let numfmt = this.numformat 
    // otherwise this.numformat inside function refers to internal object

    return [
      new TableData("ICU patients", function(n){
        return numfmt(n*fc,2)}, "on this day"),
        //{return Math.round(n*fc);}, "on this day"),
      new TableData("COVID-19 mortality rate", function(n){
        return numfmt(n*fd/7);}, "per day"),
      new TableData("10-bed Dedicated COVID Hospitals", function(n){
        return numfmt(n*fc/10);}, "on this day"),
      new TableData("Doctors", function(n){
        return numfmt(n*fc/10*8)},  "on duty this day"), 
      new TableData("Nurses and Paramedics", function(n){
        return numfmt(n*fc/10*16)},  "on duty this day"), 
      new TableData("Ventilators", function(n){
        return numfmt(n*fc*0.7);}, "on this day"), // only 7 in 10 icu need
      new TableData("Infusion pumps", function(n){
        return numfmt(n*fc/10*40);}, "on this day"),
      new TableData("Full PPEs (for frontline staff)", function(n){
        return numfmt(n*fc/10*60)},  "per day"), 
      new TableData("PPEs (for supporting staff)", function(n){
        return numfmt(n*fc)},  "per day"), 
      new TableData("Body bags", function(n){
        return numfmt(n*fd/7*2)},  "per day"), 

      
    ];
  }
  public acu(){

    let fs = this.fs
    let numfmt = this.numformat 
    // otherwise this.numformat inside function refers to internal object

    return [
      new TableData("Acute care patients", function(n){
        return numfmt(n*fs);}, "on this day"),
      new TableData("20-bed Dedicated COVID Health Centers", function(n){
        return numfmt(n*fs/20);}, "on this day"),
      new TableData("Doctors (Anes./Intensv.)", function(n){
        return numfmt(n*fs/20*4)},  "on duty this day"), 
      new TableData("Nurses and Paramedics", function(n){
        return numfmt(n*fs/20*16)},  "on duty this day"), 
      new TableData("Infusion pumps", function(n){
        return numfmt(n*fs/20*5);}, "on this day"),
      new TableData("Full PPEs (for frontline staff)", function(n){
        return numfmt(n*fs/20*40)},  "per day"), 
      new TableData("PPEs (for supporting staff)", function(n){
        return numfmt(n*fs/20*10)},  "per day"), 
    ];
    
  }
  public scu(){

    let fi = this.fi
    let numfmt = this.numformat 
    // otherwise this.numformat inside function refers to internal object
    
    return [
      new TableData("Supportive care patients", function(n){
        return numfmt(n*fi);}, "on this day"),
      new TableData("40-bed COVID Care Centers", function(n){
        return numfmt(n*fi/40);}, "on this day"),
      new TableData("Doctors (Anes./Intensv.)", function(n){
        return numfmt(n*fi/40*3)},  "on this day"), 
      new TableData("Nurses and Paramedics", function(n){
        return numfmt(n*fi/40*6)},  "on this day"), 
      new TableData("PPEs", function(n){
        return numfmt(n*fi/40*30)},  "per day"), 
    ];
    
  }

  public sup() {

    let fc = this.fc
    let fs = this.fs
    let fi = this.fi
    let numfmt = this.numformat 
    // otherwise this.numformat inside function refers to internal object

    return [
      new TableData("Sanitizer", function(n){
        return numfmt(n*(fc + 0.2*fs + 0.1*fi));}, "lt / day"),
      new TableData("Oxygen (6000 lt) cylinders", function(n){
        return numfmt(n*(5*fc + 10./15*fs + 5/80.*fi));}, "per day"),
      new TableData("Surgical gloves", function(n){
        return numfmt(n*(4*fc + 2*fs + 5./8*fi));}, "pairs per day"),
      new TableData("Nitrile gloves", function(n){
        return numfmt(n*(fc + 0.2*fs + 0.025*fi));}, "boxes of 100 per day"),
      new TableData("Tab HCQ", function(n){
        return numfmt(n*(40./5*fc + 2*(fs+fi)));}, "per day"),
      new TableData("Patient masks", function(n){
        return numfmt(n*(5*fc + 5*fs + 2.5*fi))},  "per day"), 
    ];
  } 

  public Tdata(){
    return [
      {id:"icu", name: 'Intensive Care', type: '', itemCounts: this.icu()},
      {id:"acu", name: 'Acute Care',     type: '', itemCounts: this.acu()},
      {id:"scu", name: 'Supportive Care',type: '', itemCounts: this.scu()},
      {id:"sup", name: 'Key Medical Supplies (total)',type: '', itemCounts: this.sup()},
    ];

  }
}
