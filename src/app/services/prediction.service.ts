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

public getTableData(dp:number,sn,cn,ilist){
  let rVal:any= [];
 
  for (let i=0;i<ilist.length;i++) {
    rVal[i] = []
    for(let j=0;j<ilist[i].map.length;j++){
  
      ilist[i].map[j].district =   ilist[i].map[j].efun(dp) ;
      ilist[i].map[j].state    =   ilist[i].map[j].efun(sn) ;
      ilist[i].map[j].country  =   ilist[i].map[j].efun(cn) ;
     
    }
   
    rVal[i] = ilist[i].map
  }

  return rVal;
}


fc:any = 0.05;
fs:any = 0.15
fi:any = 0.4;
ff:any = this.fc+this.fs+this.fi/2;
fd:any = 0.03;

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
      new TableData("Doctors (Anes./Intensv.)", function(n){
	return Math.ceil(8*n*fc/10)},  "on duty   per day"), 
      new TableData("Nurses and Paramedics", function(n){
	return Math.ceil(4*n*fc/10)},  "on duty   per day"), 

 
   ];
 }
 public acu(){

  let fs = this.fs
  let fc = this.fc
  let fi = this.fi
  let ff = this.ff
  let fd = this.fd

   return [
      new TableData("Acute care patients", function(n){
	        return Math.ceil(n*fs);}),
      new TableData("20-bed Dedicated COVID Health Centers", function(n){
	        return Math.ceil(n*fs/20);}),
     //   new TableData("Laryngoscopes, Defibrillator", function(n){
	   // return Math.ceil(n*fc*0.30);}), // 3 per 10
     //   new TableData("ECG", function(n){
	   // return Math.ceil(n*fc/20);}),
     //   new TableData("Monitors (Arterial BP)", function(n){
	   // return Math.ceil(n*fc);}),
     //   new TableData("Arterial blood gas machine", function(n){
	   // return Math.ceil(n*fc/30);}),
     //   new TableData("Bedside X-ray", function(n){
	   // return Math.ceil(n*fc/20);}),
     //   new TableData("Infusion pumps", function(n){
	   // return Math.ceil(3*n*fc);}),
     //   new TableData("Oxymeter", function(n){
	   // return Math.ceil(n*fs/20);}),
     //   new TableData("High flow nasal canula", function(n){
	   // return Math.ceil(n*fs);}), //severe
     //   new TableData("Nebuliser", function(n){
	   // return Math.ceil(n*fs);}), // for severe
     //   new TableData("Non-contact Thermometer", function(n){
	   // return Math.ceil(n*(1-fs-fc-fi)/20);}), // for 1 for 20 outpatients
     //   new TableData("Patient cot", function(n){
	   // return Math.ceil(n*(fs+fi)/10)*10;}),
     //   new TableData("Wheel chair", function(n){
	   // return Math.ceil(n*(fs/20));}),
     //   new TableData("Stretcher", function(n){
	   // return Math.ceil(n*(3*fs/20 + fc));}),
     //   new TableData("Ambulance", function(n){
	   // return Math.ceil(n*3/20);}) // 3 times n and 20 trips per day
   ];
 
 }
 public scu(){

  let fi = this.fi

   return [
      new TableData("Supportive care patients", function(n){
	        return Math.ceil(n*fi);}),
      new TableData("40-bed COVID Care Centers", function(n){
	        return Math.ceil(n*fi/40);}),
       new TableData("Doctors", function(n){
	         return Math.ceil(2.*4/10*n*fi);},"on duty in a day"),
       new TableData("Nurses", function(n){
	         return Math.ceil(3.*4/10*n*fi);},"on duty in a day"),
       new TableData("Sanitizer", function(n){
	   return Math.ceil(n*(fi)*0.25/10)*10;}, " lt / day"),
     //   new TableData("Needles", function(n){
	   // return Math.ceil(n*(10*fc + 5*fs+  2*fi)/50)*50 ;}, "per day"),
     //   new TableData("Disposable bags", function(n){
	   // return Math.ceil(n*(3*fc + 2*fs + 0.25*fi)/10)*10 ;}, "per day"),
     //   new TableData("ET Tube", function(n){
	   // return Math.ceil(n*fc/3);},"per day"),
     //   new TableData("Oxygen (medium)",function(n){
	   // return Math.ceil(n*fc*4);}, "cylinders / day"),
     //   new TableData("Central, Peripheral lines",function(n){
	   // return Math.ceil(n*fc/3);}, "per day"),
     //   new TableData("IV fluids",function(n){
	   // return Math.ceil(n*fc*5*0.5);}, "lt / day"),
     //   new TableData("Suction catheter",function(n){
	   // return Math.ceil(n*fc);},"per day"),
     // new TableData("Test kits",function(n){ return Math.ceil(n*3/50)*50;}),
   ];
   
 }

 public sup() {

  let fi = this.fi

   return [
      new TableData("Supportive care patients", function(n){
	        return Math.ceil(n*fi);}),
      new TableData("40-bed COVID Care Centers", function(n){
	        return Math.ceil(n*fi/40);}),
       new TableData("Doctors", function(n){
	         return Math.ceil(2.*4/10*n*fi);},"on duty in a day"),
       new TableData("Nurses", function(n){
	         return Math.ceil(3.*4/10*n*fi);},"on duty in a day"),
       new TableData("Sanitizer", function(n){
	   return Math.ceil(n*(fi)*0.25/10)*10;}, " lt / day"),
   ];
 } 

 public Tdata(){
   return [
    {id:"icu", name: 'Intensive Care', type: '',map: this.icu()},
    {id:"acu", name: 'Acute Care',     type: '',map: this.acu()},
    {id:"scu", name: 'Supportive Care',type: '',map: this.scu()},
    {id:"sup", name: 'Key Medical Supplies',type: '',map: this.sup()},
  ];

 }
}
