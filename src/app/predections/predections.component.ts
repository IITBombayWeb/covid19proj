import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import * as t from 'topojson'
import { HttpClient } from '@angular/common/http';
import { PredectionService } from '../predection.service';
import { TableData } from '../table-data';
import {legendColor} from 'd3-svg-legend';
declare var Covid19ModelIndia : any; 

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

export interface TableElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
export interface DataMap{
  id: string
  name: string;
  type: any;
  map:any;
}
export interface TableHead{
  sname: string;
  dname:string
}

@Component({
  selector: 'app-predections',
  templateUrl: './predections.component.html',
  styleUrls: ['./predections.component.css']
})

export class PredectionsComponent implements OnInit{
  @ViewChild('buttonToggle') buttonToggle: ElementRef;
  @ViewChild('buttonToggle2') buttonToggle2: ElementRef;
  title = 'CWR';
  height = 700;
  width = 800;
  maxInterpolation = 0.8;
  propertyFieldMap = {
    state: 'NAME_1',
    district: 'NAME_2',
  };
  Gsvg:any;
  displayedColumns: string[] = ['item', 'district','state','country', 'units'];
  displayedTypes: DataMap[] = [{id:'lowParams',name:'Modrate',type:'',map:''},
                                {id:'highParams',name:'Critical',type:'',map:''}];
  Thead:TableHead ={sname:'India',dname:''};
  tiles: Tile[] = [
    {text: '0', cols: 1, rows: 1, color: ' rgb(246, 238, 234)'},
    {text: '1 - 10', cols: 1, rows: 1, color: 'rgb(253, 213, 195)'},
    {text: '11-30', cols: 1, rows: 1, color: 'rgb(252, 164, 135)'},
    {text: '31 - 50', cols: 1, rows: 1, color: 'rgb(250, 112, 81)'},
    {text: '51 -70', cols: 1, rows: 1, color: 'rgb(232, 56, 44)'},
    {text: '> 71', cols: 1, rows: 1, color: 'rgb(187, 21, 26)'},
  ];

  ELEMENT_DATA: TableData[] = [];
  dataSource = this.ELEMENT_DATA;
  DataMp: DataMap[];
  DataTBL:any[]=[];
  ctx:any;
  // public responseData:any=[];
  // public responseData1: any;
  // public responseData2: any;
  def_list:number=100;
  cn_list:number=100
  sa_list:number=100
  max_number:any=[];
  paramsType:any=this.displayedTypes[0].id
  constructor(private http: HttpClient,private ps: PredectionService) { }
  ngOnInit(): void {
    this.DataMp=this.getTdata();
  
    this.ps.requestDataFromMultipleSources().subscribe(responseList => {
      const data =  d3.json("assets/india-districts.json");//Fetch India Map JSON
    this.renderView(data);
   //  console.log(this.getstime())

    //  this.responseData['data'] = responseList[0];  
    //  this.getMAx() 
     // const  data2 =   d3.json("assets/ne_10m_admin_0_Kashmir_Occupied.json");
  });

  } 
  // Render India Map
  renderView(data){
         // for(let i=0 ; i< this.DataMp.length;i++){
        //  let aread = this.responseData['data'];
       //  let maxConfirmed = 0;
      //var max_d[index] = maxd;
     //const max_d =[170,170,170,170]
    //console.log('date maxd: ' + Ddate + maxd.toString())

    let svgEle = this.createSvgElement();
    this.DataTBL = this.ps.Tdata();
   
    const tData = this.DataTBL
    let pService =  this.ps
    var dSource =[]
    dSource=  this.dataSource
    let MapFill = this.setMapColor
    let FunCrtical = this.getDistricCrtical
    let SFunCrtical = this.getSateCrtical
    let CFunCrtical = this.getCountryCrtical
    let resetToggel = this.resetToggel
    let maxd =  this.getMaxd;
    let headD  = this.Thead;
    let btn = this.buttonToggle.nativeElement;
    let btn2 = this.buttonToggle2.nativeElement;
    let date = btn.getElementsByTagName('input')[0].value
    let def_list = this.def_list
    this.cn_list = this.getCountryCrtical(data,this.paramsType)
    let cn_list = this.cn_list
    let sa_list = this.sa_list
    this.dataSource =  this.ps.getTableData(this.def_list,this.cn_list,this.sa_list,this.DataTBL);
    let Legend = this.createLegend;
    data.then(function (topology) {
        Legend(svgEle[0],maxd(date,btn2.querySelector('.active').getElementsByTagName('input')[0].value));
        svgEle[1].selectAll('path')
          .data(t.feature(topology,topology.objects.IND_adm2).features)
          .enter()
          .append('path')
          .attr('stroke', '#ff073a20')
          .attr('stroke-width', 1)
          .attr('d', svgEle[2])
          .on('mouseover', (d) => {
            const n1 = d.properties.st_nm;
            const n2 =  d.properties.district;
            const index_key = n2+"."+n1
            var numCritical = FunCrtical(index_key,btn.querySelector('.active').getElementsByTagName('input')[0].value,btn2.querySelector('.active').getElementsByTagName('input')[0].value)
              svgEle[3]
            .html(d.properties.st_nm + "<br>" + "District: " + d.properties.district + "<br>" + "Qty: " + numCritical)
            .style("left", (d3.event.pageX-document.getElementById("main").offsetLeft - 120 )+ "px")
            .style("top", (d3.event.pageY-document.getElementById("main").offsetTop - 80) + "px")
          })
          .on("click", function(d){
            resetToggel(btn)
            const n1 = d.properties.st_nm;
            const n2 =  d.properties.district;
            const index_key = n2+"."+n1
            let numCritical = FunCrtical(index_key,date,btn2.querySelector('.active').getElementsByTagName('input')[0].value)
            let Scritical = SFunCrtical(n1,date,btn2.querySelector('.active').getElementsByTagName('input')[0].value)
            let Ccritical = CFunCrtical(date,btn2.querySelector('.active').getElementsByTagName('input')[0].value)
            def_list =  numCritical
            cn_list = Ccritical
            sa_list = Scritical
            headD.sname =n1; headD.dname = n2
            dSource = pService.getTableData(numCritical,cn_list,sa_list,tData);
           console.log(btn2.querySelector('.active').getElementsByTagName('input')[0].value)
          }).on('mouseleave',(d)=>{
            svgEle[3]
            .html("");
          })
          MapFill(FunCrtical,maxd,date,btn2.querySelector('.active').getElementsByTagName('input')[0].value);
       
  });
  
 

}
// Create color Bar Range
createLegend(svg,maxd){
  const color = d3
  .scaleSequential(d3.interpolateReds)
  .domain([0, maxd / 0.8 || 10]);
  //.domain([0, max_d[index] / 0.8 || 10]);

let cells = null;
let label = null;

label = ({i, genLength, generatedLabels, labelDelimiter}) => {
  if (i === genLength - 1) {
    const n = Math.floor(generatedLabels[i]);
    return `${n}+`;
  } else {
    const n1 = 1 + Math.floor(generatedLabels[i]);
    const n2 = Math.floor(generatedLabels[i + 1]);
    return `${n1} - ${n2}`;
  }
};

const numCells = 6;
const delta = Math.floor(
  (maxd < numCells ? numCells : maxd) /
    (numCells - 1)
);
  //(max_d[index] < numCells ? numCells : max_d[index]) /

cells = Array.from(Array(numCells).keys()).map((i) => i * delta);

svg
  .append('g')
  .attr('class', 'legendLinear')
  .attr('fill','white')
  .attr('transform', 'translate(-20, -60)');

const legendLinear = legendColor()
  .shapeWidth(50)
  .cells(cells)
  .titleWidth(4)
  
  .labels(label)
  .orient('vertical')
  .scale(color);
  svg.select('.legendLinear').call(legendLinear);     
}
// Create Svg Element
createSvgElement(){
  let projection = d3.geoMercator().center([88, 18])
    .scale(1050)
    .translate([this.width / 2,this.height / 2]);;
    
     
    
    let svg = d3.select("div.svg-parent")
   
    .append("svg")
  
    .attr('id','chart')
    // Responsive SVG needs these 2 attributes and no width and height attr.
   
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("viewBox", "-50 -50 800 600")
    // Class to make it responsive.
    // Fill with a rectangle for visualization.
 
    .attr("width", this.width)
    .attr("height", this.height);
    this.Gsvg =svg
    let path = d3.geoPath()
      .projection(projection);

    let g = svg.append('g')
   
    g.attr('class', 'map');
    
    // create a tooltip
    const tooltip = d3.select("#tooltip");
    svg.call(d3.zoom()
      .extent([[0, 0], [this.width, this.height]])
      .scaleExtent([1, 8])
      .on("zoom", zoomed));

  function zoomed() {
    g.attr("transform", d3.event.transform);
  }
  return [svg,g,path,tooltip];
}
// Handle Change Of toggelButton
handleChange(data){
  //If it has district name then
  const btn = this.buttonToggle.nativeElement
  if(this.Thead.dname !==''){
    const date = btn.querySelector("#"+data.id).getElementsByTagName('input')[0].value
    this.def_list = this.getDistricCrtical(this.Thead.dname+"."+this.Thead.sname,this.buttonToggle.nativeElement,this.paramsType)
    this.sa_list = this.getSateCrtical(this.Thead.sname,this.buttonToggle.nativeElement,this.paramsType)
    this.cn_list = this.getCountryCrtical(this.buttonToggle.nativeElement,this.paramsType)
    this.dataSource =  this.ps.getTableData(this.def_list,this.cn_list,this.sa_list,this.DataTBL);
    this.removeColorLegend()
    this.createLegend(this.Gsvg,this.getMaxd(date,this.paramsType));
    this.setMapColor(this.getDistricCrtical,this.getMaxd,date,this.paramsType)
  }else{
    this.resetToggel(btn) // reset Toggel Button if district name doesn't exists
  }
} 
// Handel Modrate and crtical
handleChangeParam(data){
  this.paramsType = data.id;
  //If it has district name then
  if(this.Thead.dname !==''){
    this.def_list = this.getDistricCrtical(this.Thead.dname+"."+this.Thead.sname,this.buttonToggle.nativeElement,this.paramsType) 
    this.sa_list = this.getSateCrtical(this.Thead.sname,this.buttonToggle.nativeElement,this.paramsType)
    this.cn_list = this.getCountryCrtical(this.buttonToggle.nativeElement,this.paramsType)
    this.dataSource =  this.ps.getTableData(this.def_list,this.cn_list,this.sa_list,this.DataTBL);
  }
}

resetToggel(btn){
  btn.querySelector(".active").classList.remove('active') // Select all DOM Element From Element
  btn.children[0].classList.add('active') // Set Active to first DOM Element
}

getDistricCrtical(key,date,params){
  let model = new Covid19ModelIndia()
  const index =  model.indexDistrictNameKey(key)
  return index?model.districtStat("carriers",index , params==="lowParams"?model.lowParams:model.highParams, new Date(date)):0; // Get District Critical
}
getSateCrtical(key,date,params){
  let model = new Covid19ModelIndia()
  const index =  model.indexStateName(key)
  return index?model.stateStat("carriers",index , params==="lowParams"?model.lowParams:model.highParams, new Date(date)):0; // Get  State Critical
}
getCountryCrtical(date,params){
  let model = new Covid19ModelIndia()
  return model.countryStat("carriers",  params==="lowParams"?model.lowParams:model.highParams, new Date(date)); // Get Country Critical
}
getMaxd(date,params){

  let model = new Covid19ModelIndia()
 
  return model.districtStatMax("carriers",   params==="lowParams"?model.lowParams:model.highParams, new Date(date)) // Get Maximum Number Of affected People
}

removeColorLegend(){
  d3.select('.legendLinear').remove() // Removes Color Bar From the Map
}

getstime(){
  return new Date(this.buttonToggle.nativeElement.getElementsByTagName('input')[0].value) // Return time from Toggel Button
}

// This function will set color to district in the map
setMapColor(funcrtical,funmaxd,date,params){
  const maxd = funmaxd(date,params) // Get Maximum Number from Model
 
  d3.select('.map').selectAll('path') // Select all paths of the maps
  .style("fill", (d)=>{  // Set Color function 
    const n1 = d.properties.st_nm; // Select State name
    const n2 =  d.properties.district // Select District name
    const dist_id = n2+"."+n1 // Create district and state key  
    let numCritical = funcrtical(dist_id,date,params) // Initializing and set default number of critical
   
    const color = // Color Function to set color
    numCritical === 0 
        ? '#ffffff' // White Color if its Zero
        : d3.interpolateReds(
            (0.8 * numCritical) / ( maxd ) // Color calculation
          ); // Return RGB Value
        return color; // Return Color
  })
}

// Return Toggel Button
getTdata(){
  return [
     {id:"week_0", name: 'Current ' , type: true,map: this.getDate(0)},
     {id:"week_1", name: 'Week 1 ', type: '',map: this.getDate(7)},
     {id:"week_2", name: 'Week 2 ',  type: '',map:this.getDate(14)},
     {id:"week_3", name: 'Week 3 ',  type: '',map:this.getDate(21)},
   ]
 }
 //Create Date Object
getDate(n){
    var date = new Date('28 March 2020'); // Set Date Object
    date.setDate(date.getDate() + n); // Add Date with n days
    return date;// return date object
  }

 













// getMAx(){
  //   for(let i =0;i< this.DataMp.length;i++){
  //     this.max_number[this.DataMp[i].id] = this.maxcalculate(this.objCOn(this.responseData['data']));
  //   }
   
  // }

  // objCOn(obj){
  //   return Object.keys(obj).map((key)=>{ return obj[key]});
  // }
  // maxcalculate(d){
  //  let data:any=[];
  //    for(let i=0;i < d.length;i++){
     
  //     data[i] = this.objCOn(d[i].districtData);
        
      
  //    }
  //    let max =0
  //    for(let j=0;j<data.length;j++){
     
  //     for(let k=0;k<data[j].length;k++){
  //       var curr_val = this.objCOn(data[j][k])[0];
  //       if(curr_val > max){
  //         max = curr_val;
  //       }
  //     }
  //    } 
  //   return max;
  // }
}
