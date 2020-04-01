import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin,Observable } from 'rxjs';  // RxJS 6 syntax\
import { TableData } from './table-data';


@Injectable({
  providedIn: 'root'
})


export class PredectionService {
  
 
  constructor(private http: HttpClient) { }

  public requestDataFromMultipleSources(): Observable<any[]> {
    let response1 = this.http.get('https://api.covid19india.org/state_district_wise.json');
    let response2 = this.http.get('assets/masks_district.json');
    let response3 = this.http.get('assets/vent_district.json');
    return forkJoin([response1, response2,response3]);
  }
public getTableData(np:number,ilist){
  let rVal =[];

  for (let i=0;i<ilist.length;i++) {
   
    for(let j=0;j<ilist[i].map.length;j++){
  
      ilist[i].map[j].estimate =   ilist[i].map[j].efun(np) ;
     
    }
   
    rVal[i] = ilist[i].map
  }

  return rVal
}

public ppe(){
  return [
   new TableData("Doctors", function(n){ return Math.ceil(n/10*4);},"per day"),
   new TableData("Nurses", function(n){ return n;},"per day"),
   new TableData("Gowns, Splash Guard", function(n){ return Math.ceil(n*14/5);},"per day"),
   new TableData("Masks, Gloves", function(n){ return 70*n;}, "per day")
 
   ];
 }
 public med_equ(){
   return [
     new TableData("Ventilators", function(n){ return n;}),
     new TableData("ET Tube", function(n){ return n;}),
     new TableData("Laryngoscopes", function(n){ return Math.ceil(n/20);}),
     new TableData("Ambu Bags", function(n){ return n;}),
     new TableData("Glass case", function(n){ return n;}),
     new TableData("Infusion pump", function(n){ return n;})
   ];
 
 }
 public med_con(){
   return [
     new TableData("Sanitizer", function(n){ return Math.ceil(n*14/10000);}, " lt / day"),
     new TableData("Oxygen (medium)",function(n){ return n*4;}, "cylinders / day"),
     new TableData("Central, Peripheral lines",function(n){ return Math.ceil(n/3);}, "per day"),
     new TableData("IV sugar, saline",function(n){ return Math.ceil(n*2*500/1000);}, "l / day"),
     new TableData("Suction catheter",function(n){ return n;})
   ];
   
 }
}
