import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin,Observable } from 'rxjs';  // RxJS 6 syntax\
import { TableData } from './table-data';


@Injectable({
  providedIn: 'root'
})


export class PredectionService {
 
 
  constructor(private http: HttpClient) { 



}

  public requestDataFromMultipleSources(): Observable<any[]> {
    let response1 = this.http.get('https://api.covid19india.org/state_district_wise.json');
    let response2 = this.http.get('assets/masks_district.json');
    let response3 = this.http.get('assets/vent_district.json');
    return forkJoin([response1, response2,response3]);
  }
public getTableData(np:number,ilist){
  let rVal:any= [];
 
  for (let i=0;i<ilist.length;i++) {
    rVal[i] = []
    for(let j=0;j<ilist[i].map.length;j++){
  
      ilist[i].map[j].estimate =   ilist[i].map[j].efun(np) ;
     
    }
   
    rVal[i] = ilist[i].map
  }

  return rVal;
}



public ppe(){

  let fs = 0.15;
  let fc = 0.05;
  let fi = 0.4;
  let ff = fc+fs+fi/1.5;

  return [
   new TableData("Doctors", function(n){ return Math.ceil(2./5*n*ff);},"per day"),
   new TableData("Nurses", function(n){ return Math.ceil(n*ff);},"per day"),
   new TableData("Gowns, Masks, etc.", function(n){ return Math.ceil(14./5*n*ff);},"per day"),
   new TableData("Gloves (sterile)", function(n){ return Math.ceil(n*(10*fc + 5*(fs+fi))) ;}, "per day"),
   new TableData("Gloves (non-sterile)", function(n){ return Math.ceil(n*(5*fc + 2.5*(fs+fi))) ;}, "per day"),
   new TableData("Towels, Needles, Bags", function(n){ return Math.ceil(n*(5*fc + 2.5*(fs+fi))) ;}, "per day")
 
   ];
 }
 public med_equ(){

  let fs = 0.15;
  let fc = 0.05;
  let fi = 0.4;

   return [
     new TableData("Ventilators", function(n){ return Math.ceil(n*fc);}),
     new TableData("ET Tube", function(n){ return Math.ceil(n*fc/2);},"per day"),
     new TableData("Laryngoscopes", function(n){ return Math.ceil(n*fc/20);}),
     new TableData("Ambu Bags", function(n){ return Math.ceil(n*fc);}),
     new TableData("Glass case", function(n){ return Math.ceil(n*fc);}),
     new TableData("Bedside X-ray", function(n){ return Math.ceil(n*fc/20);}),
     new TableData("Arterial blood gas line", function(n){ return Math.ceil(n*fc/30);}),
     new TableData("Infusion pump", function(n){ return Math.ceil(n*fc);})
   ];
 
 }
 public med_con(){
  let fs = 0.15;
  let fc = 0.05;
  let fi = 0.4;

   return [
     new TableData("Sanitizer", function(n){ return Math.ceil(n*14/10000);}, " lt / day"),
     new TableData("Oxygen (medium)",function(n){ return Math.ceil(n*fc*4);}, "cylinders / day"),
     new TableData("Central, Peripheral lines",function(n){ return Math.ceil(n*fc/3);}, "per day"),
     new TableData("IV sugar, saline",function(n){ return Math.ceil(n*fc*2*500/1000);}, "lt / day"),
     new TableData("Suction catheter",function(n){ return Math.ceil(n*fc);})
   ];
   
 }

 public Tdata(){
   return [
    {id:"ppe", name: 'Persons and Protective Equipment', type: '',map: this.ppe()} ,
    {id:"med_eqt", name: 'Medical Equipment',  type: '',map:this.med_equ()},
    {id:"med_consu", name: 'Medical Consumables',  type: '',map: this.med_con()},
  ];

 }
}
