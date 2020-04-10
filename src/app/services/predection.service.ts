import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin,Observable } from 'rxjs'; 
import { TableData } from '../models/table-data';


@Injectable({
  providedIn: 'root'
})


export class PredectionService {
 

  constructor(private http: HttpClient) { 



}

  public requestDataFromMultipleSources(): Observable<any[]> {
    // let response1 = this.http.get('https://api.covid19india.org/state_district_wise.json');
    // let response2 = this.http.get('assets/masks_district.json');
    // let response3 = this.http.get('assets/vent_district.json');
			let urls = [];
			let responses = [];
			
			urls.push("https://api.covid19india.org/states_daily.json");
			urls.push("https://api.covid19india.org/raw_data.json");
    
			// let hget = this.http.get
			// urls.forEach(function(url,i,responses) {
			// 		responses[i] = hget(url);
			// 		// overwrite urls by responses
			// 		//responses[i] = this.http.get(url);
			// })
			// urls.forEach(urls, function(url,i,responses) {
			// 		this.push(hget(url));
			// }, responses)
      
			for (let i=0; i<urls.length; i++)
					responses.push(this.http.get(urls[i]));
			
			return forkJoin(responses);

			
    //return forkJoin([response1, response2,response3]);
  }

public getTableData(dp:number,cn,sn,ilist){
  let rVal:any= [];
 
  for (let i=0;i<ilist.length;i++) {
    rVal[i] = []
    for(let j=0;j<ilist[i].map.length;j++){
  
      ilist[i].map[j].district =   ilist[i].map[j].efun(dp) ;
      ilist[i].map[j].state =   ilist[i].map[j].efun(sn) ;
      ilist[i].map[j].country =   ilist[i].map[j].efun(cn) ;
     
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
      new TableData("Critical patients (ICU Beds)", function(n){
	  return Math.ceil(n*fc);}),
      new TableData("Doctors", function(n){
	  return Math.ceil(2./5*n*ff/10)*10;},"on duty in a day"),
      new TableData("Nurses", function(n){
	  return Math.ceil(n*ff/10)*10;},"on duty in a day"),
      new TableData("Staff PPE: Gowns, Masks, Goggles", function(n){
	  return Math.ceil(14./5*n*ff/50)*50;},"per day"),
      new TableData("Patient PPE: Masks", function(n){
	  return Math.ceil(4*n*(fs+fi)/50)*50;},"per day"),
      new TableData("Gloves (sterile)", function(n){
	  return Math.ceil(n*(12*fc + 6*(fs+fi))/50)*50 ;}, "per day"),
      new TableData("Gloves (non-sterile)", function(n){
	  return Math.ceil(n*(24*fc + 12*(fs+fi))/50)*50 ;}, "per day"),
      new TableData("Dead body bags", function(n){
	  return Math.ceil(n*fc/2)} )
 
   ];
 }
 public med_equ(){

  let fs = 0.15;
  let fc = 0.05;
  let fi = 0.4;

   return [
       new TableData("Ventilators, Ambu bags, Glass case", function(n){
	   return Math.ceil(n*fc);}),
       new TableData("Laryngoscopes, Defibrillator", function(n){
	   return Math.ceil(n*fc*0.30);}), // 3 per 10
       new TableData("ECG", function(n){
	   return Math.ceil(n*fc/20);}),
       new TableData("Monitors (Arterial BP)", function(n){
	   return Math.ceil(n*fc);}),
       new TableData("Arterial blood gas machine", function(n){
	   return Math.ceil(n*fc/30);}),
       new TableData("Bedside X-ray", function(n){
	   return Math.ceil(n*fc/20);}),
       new TableData("Infusion pumps", function(n){
	   return Math.ceil(3*n*fc);}),
       new TableData("Oxymeter", function(n){
	   return Math.ceil(n*fs/20);}),
       new TableData("High flow nasal canula", function(n){
	   return Math.ceil(n*fs);}), //severe
       new TableData("Nebuliser", function(n){
	   return Math.ceil(n*fs);}), // for severe
       new TableData("Non-contact Thermometer", function(n){
	   return Math.ceil(n*(1-fs-fc-fi)/20);}), // for 1 for 20 outpatients
       new TableData("Patient cot", function(n){
	   return Math.ceil(n*(fs+fi)/10)*10;}),
       new TableData("Wheel chair", function(n){
	   return Math.ceil(n*(fs/20));}),
       new TableData("Stretcher", function(n){
	   return Math.ceil(n*(3*fs/20 + fc));}),
       new TableData("Ambulance", function(n){
	   return Math.ceil(n*3/20);}) // 3 times n and 20 trips per day
   ];
 
 }
 public med_con(){
  let fs = 0.15;
  let fc = 0.05;
  let fi = 0.4;

   return [
       new TableData("Needles", function(n){
	   return Math.ceil(n*(10*fc + 5*fs+  2*fi)/50)*50 ;}, "per day"),
       new TableData("Disposable bags", function(n){
	   return Math.ceil(n*(3*fc + 2*fs + 0.25*fi)/10)*10 ;}, "per day"),
       new TableData("Sanitizer", function(n){
	   return Math.ceil(n*(fc+fs+fi)*0.25/10)*10;}, " lt / day"),
       new TableData("ET Tube", function(n){
	   return Math.ceil(n*fc/3);},"per day"),
       new TableData("Oxygen (medium)",function(n){
	   return Math.ceil(n*fc*4);}, "cylinders / day"),
       new TableData("Central, Peripheral lines",function(n){
	   return Math.ceil(n*fc/3);}, "per day"),
       new TableData("IV fluids",function(n){
	   return Math.ceil(n*fc*5*0.5);}, "lt / day"),
       new TableData("Suction catheter",function(n){
	   return Math.ceil(n*fc);},"per day"),
     new TableData("Test kits",function(n){ return Math.ceil(n*3/50)*50;}),
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
