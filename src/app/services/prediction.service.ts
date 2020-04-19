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
    urls.push("https://api.covid19india.org/raw_data.json");
    
    
    for (let i=0; i<urls.length; i++)
      responses.push(this.http.get(urls[i]));
    
    return forkJoin(responses);
  }

  //public getTableData(dp:number,sn,cn,ilist){
  public getTableData(dn,sn,cn,ilist){
    let rVal:any= [];

    console.log('dn,sn,cn: ', dn,sn,cn)
    
    for (let i=0;i<ilist.length;i++) {
      rVal[i] = []
      for(let j=0;j<ilist[i].map.length;j++){
        
        ilist[i].map[j].district =   ilist[i].map[j].efun(dn) ;
        ilist[i].map[j].state    =   ilist[i].map[j].efun(sn) ;
        ilist[i].map[j].country  =   ilist[i].map[j].efun(cn) ;
        
      }
      
      rVal[i] = ilist[i].map
    }

    return rVal;
  }


  // tau:any = 7; // mortality residence time in days
  // fc:any = 2*this.tau
  // fs:any = 15/2.5*this.tau
  // fi:any = 80/2.5*this.tau
  // fd:any = 1;

  fc:any = 0.05
  fs:any = 0.15
  fi:any = 0.8
  fd:any = 0.025
  
  public icu(){

    let fc = this.fc
    let fd = this.fd

    return [
      new TableData("ICU patients", function(n){
        return Math.ceil(n*fc);}),
      new TableData("COVID-19 related deaths", function(n){
        return Math.ceil(n*fd);}),
      new TableData("10-bed Dedicated COVID Hospitals", function(n){
        return Math.ceil(n*fc/10);}),
      new TableData("Doctors", function(n){
        return Math.ceil(n*fc/10)*8},  "on duty per day"), 
      new TableData("Nurses and Paramedics", function(n){
        return Math.ceil(n*fc/10)*16},  "on duty per day"), 
      new TableData("Ventilators", function(n){
        return Math.ceil(n*fc/10)*7;}),
      new TableData("Infusion pumps", function(n){
        return Math.ceil(n*fc/10)*40;}),
      new TableData("Full PPEs (for frontline staff)", function(n){
        return Math.ceil(n*fc/10)*60},  "per day"), 
      new TableData("PPEs (for supporting staff)", function(n){
        return Math.ceil(n*fc/10)*10},  "per day"), 

      
    ];
  }
  public acu(){

    let fs = this.fs

    return [
      new TableData("Acute care patients", function(n){
        return Math.ceil(n*fs);}),
      new TableData("20-bed Dedicated COVID Health Centers", function(n){
        return Math.ceil(n*fs/20);}),
      new TableData("Doctors (Anes./Intensv.)", function(n){
        return Math.ceil(n*fs/20)*4},  "on duty per day"), 
      new TableData("Nurses and Paramedics", function(n){
        return Math.ceil(n*fs/20)*16},  "on duty per day"), 
      new TableData("Infusion pumps", function(n){
        return Math.ceil(n*fs/20)*5;}),
      new TableData("Full PPEs (for frontline staff)", function(n){
        return Math.ceil(n*fs/20)*40},  "per day"), 
      new TableData("PPEs (for supporting staff)", function(n){
        return Math.ceil(n*fs/20)*10},  "per day"), 
    ];
    
  }
  public scu(){

    let fi = this.fi
    
    return [
      new TableData("Supportive care patients", function(n){
        return Math.ceil(n*fi);}),
      new TableData("40-bed COVID Care Centers", function(n){
        return Math.ceil(n*fi/40);}),
      new TableData("Doctors (Anes./Intensv.)", function(n){
        return Math.ceil(n*fi/40)*3},  "on duty per day"), 
      new TableData("Nurses and Paramedics", function(n){
        return Math.ceil(n*fi/40)*6},  "on duty per day"), 
      new TableData("PPEs", function(n){
        return Math.ceil(n*fi/40)*30},  "per day"), 
    ];
    
  }

  public sup() {

    let fc = this.fc
    let fs = this.fs
    let fi = this.fi

    return [
      new TableData("Sanitizer", function(n){
        return Math.ceil(n*(fc + 0.2*fs + 0.1*fi));}, "lt / day"),
      new TableData("Oxygen (6000 lt) cylinders", function(n){
        return Math.ceil(n*(5*fc + 10./15*fs + 5/80.*fi));}, "per day"),
      new TableData("Surgical gloves", function(n){
        return Math.ceil(n*(4*fc + 2*fs + 5./8*fi));}, "pairs per day"),
      new TableData("Nitrile gloves", function(n){
        return Math.ceil(n*(fc + 0.2*fs + 0.025*fi));}, "boxes of 100 per day"),
      new TableData("Tab HCQ", function(n){
        return Math.ceil(n*(40./5*fc + 2*(fs+fi)));}, "per day"),
      new TableData("Patient masks", function(n){
        return Math.ceil(n*(5*fc + 5*fs + 2.5*fi))},  "per day"), 
    ];
  } 

  public Tdata(){
    return [
      {id:"icu", name: 'Intensive Care', type: '',map: this.icu()},
      {id:"acu", name: 'Acute Care',     type: '',map: this.acu()},
      {id:"scu", name: 'Supportive Care',type: '',map: this.scu()},
      {id:"sup", name: 'Key Medical Supplies (total)',type: '',map: this.sup()},
    ];

  }
}
