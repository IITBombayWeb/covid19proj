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
fi:any = 0.8;
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
      new TableData("Ventilators", function(n){
	        return Math.ceil(n*fc/10)*10;}),
      new TableData("Doctors (Anes./Intensv.)", function(n){
	return Math.ceil(8*n*fc/10)},  "on duty per day"), 
      new TableData("Nurses and Paramedics", function(n){
	return Math.ceil(4*n*fc/10)},  "on duty per day"), 
      new TableData("Full PPEs", function(n){
	return Math.ceil(70*n*fc/10)},  "per day"), 

 
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
	return Math.ceil(3*n*fs/20)},  "on duty per day"), 
      new TableData("Nurses and Paramedics", function(n){
	return Math.ceil(6*n*fs/20)},  "on duty per day"), 
      new TableData("Full PPEs", function(n){
	return Math.ceil(30*n*fs/20)},  "per day"), 
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
	return Math.ceil(3*n*fi/40)},  "on duty per day"), 
      new TableData("Nurses and Paramedics", function(n){
	return Math.ceil(6*n*fi/40)},  "on duty per day"), 
      new TableData("Full PPEs", function(n){
	return Math.ceil(30*n*fi/40)},  "per day"), 
   ];
   
 }

 public sup() {

  let fi = this.fi

   return [
       new TableData("Sanitizer", function(n){
	   return Math.ceil(5*n/100);}, " lt / day"),
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
