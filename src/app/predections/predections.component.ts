import { Component, OnInit } from '@angular/core';
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
  type: string;
  map:any;
}
export interface TableHead{
  name: string;
}

@Component({
  selector: 'app-predections',
  templateUrl: './predections.component.html',
  styleUrls: ['./predections.component.css']
})

export class PredectionsComponent implements OnInit{
  title = 'CWR';
  height = 600;
  width = 550;
  maxInterpolation = 0.8;
  propertyFieldMap = {
    state: 'NAME_1',
    district: 'NAME_2',
  };
  displayedColumns: string[] = ['name', 'estimate', 'units'];
  Ndistrict:TableHead ={name:''};
  Nstate:TableHead ={name:''};
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
  DataTBL: DataMap[];
  ctx:any;
  public responseData:any=[];
  public responseData1: any;
  public responseData2: any;
  breakpoint: number;
  def_list:number=100;
  max_number:any=[];
  constructor(private http: HttpClient,private ps: PredectionService) { }
  ngOnInit(): void {
    this.DataMp= [
      {id:"week_1", name: 'Week 1', type: 'week1',map: this.getDate(0)},
      {id:"week_2", name: 'Week 2',  type: 'week2',map:this.getDate(7)},
      {id:"week_3", name: 'Week 3',  type: 'week3',map:this.getDate(14)},
    ];

    this.DataTBL= [
      {id:"ppe", name: 'Persons and Protective Equipment', type: '',map: this.ps.ppe()} ,
      {id:"med_eqt", name: 'Medical Equipment',  type: '',map:this.ps.med_equ()},
      {id:"med_consu", name: 'Medical Consumables',  type: '',map: this.ps.med_con()},
    ];

   
    this.breakpoint = (window.innerWidth <= 900) ? 3 : this.DataTBL.length*2 + 3;
    
    this.ps.requestDataFromMultipleSources().subscribe(responseList => {
      this.responseData['data'] = responseList[0];
      this.getMAx()
      const data =  d3.json("assets/india-districts.json");
      const  data2 =   d3.json("assets/ne_10m_admin_0_Kashmir_Occupied.json");
      this.dataSource =  this.ps.getTableData(this.def_list, this.DataTBL);
      
     this.renderView(data,data2);
 
  });
   
    
  }
  getMAx(){
    for(let i =0;i< this.DataMp.length;i++){
      this.max_number[this.DataMp[i].id] = this.maxcalculate(this.objCOn(this.responseData['data']));
    }
   
  }
  getDate(n){
    var date = new Date();
     return date.setDate(date.getDate() +n);
      return date;
  }
  objCOn(obj){
    return Object.keys(obj).map((key)=>{ return obj[key]});
  }
  maxcalculate(d){
   let data:any=[];
     for(let i=0;i < d.length;i++){
     
      data[i] = this.objCOn(d[i].districtData);
        
      
     }
     let max =0
     for(let j=0;j<data.length;j++){
     
      for(let k=0;k<data[j].length;k++){
        var curr_val = this.objCOn(data[j][k])[0];
        if(curr_val > max){
          max = curr_val;
        }
      }
     } 
    return max;
  }
  renderView(data,data2){
    for(let i=0 ; i< this.DataMp.length;i++){
    let projection = d3.geoMercator().center([88, 18])
    .scale(1050)
    .translate([this.width / 2,this.height / 2]);;
    
   
    let svg = d3.select("div.svg-parent-"+this.DataMp[i].id)
    .append("svg")
  
    .attr('id','chart')
    // Responsive SVG needs these 2 attributes and no width and height attr.
   
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("viewBox", "-170 -200 700 800")
    // Class to make it responsive.
    // Fill with a rectangle for visualization.
 
    .attr("width", this.width)
    .attr("height", this.height);
    let path = d3.geoPath()
      .projection(projection);

    let g = svg.append('g')
   
    g.attr('class', 'map');
   
    // create a tooltip
    const t_id = "#"+this.DataMp[i].id
    const tooltip = d3.select(t_id);

    svg.call(d3.zoom()
      .extent([[0, 0], [this.width, this.height]])
      .scaleExtent([1, 8])
      .on("zoom", zoomed));

  function zoomed() {
    g.attr("transform", d3.event.transform);
  }
  
    let aread = this.responseData['data'];
    const maxInterpolation = 0.8;
    const maxConfirmed = this.max_number[this.DataMp[i].id]
   
    let m_list =  this.DataTBL
    let pService =  this.ps
    let dSource = this.dataSource
    let c_id = "main-"+this.DataMp[i].id
    let dist = this.Ndistrict
    let state = this.Nstate
    let Ddate = this.DataMp[i].map
    console.log(dist)
    data.then(function (topology) {
        g.selectAll('path')
       
          .data(t.feature(topology,topology.objects.IND_adm2).features)
        
          .enter()
          .append('path')
          .attr('stroke', '#ff073a20')
          .attr('fill', function (d) {
            const n1 = d.properties.NAME_1;
            const n2 =  d.properties.NAME_2;

      
          
            let n =  0;
            var numCritical = 0
             if(aread[n1]){
               if(aread[n1].districtData[n2]){
               n = aread[n1].districtData[n2].confirmed
               var model = new Covid19ModelIndia()
               const dist_id = n2+"."+n1
               var districtIndex = model.indexDistrictNameKey(dist_id);
              if(districtIndex)
                 numCritical = model.districtStat("carriers", districtIndex, model.lowParams, Ddate);
               
               }
              
             }
            
            const color =
            numCritical === 0
                ? '#ffffff'
                : d3.interpolateReds(
                    (maxInterpolation * numCritical) / ( maxConfirmed|| 0.001)
                  );
            return color;
          })
         
      
          .attr('stroke-width', 1)
          .attr('d', path)
          .text((d)=>{
           return "test"
          })
          .on('mouseover', (d) => {
           
            const n1 = d.properties.NAME_1;
            const n2 =  d.properties.NAME_2;
            let cnf =0;
            var numCritical = 0
            if(aread[n1]){
              if(aread[n1].districtData[n2]){
               cnf = aread[n1].districtData[n2].confirmed
               var model = new Covid19ModelIndia()
               const dist_id = n2+"."+n1
               var districtIndex = model.indexDistrictNameKey(dist_id);
              if(districtIndex)
                 numCritical = model.districtStat("carriers", districtIndex, model.lowParams, Ddate);
              }
            }
           dist.name = d.properties.NAME_2
           state.name =  d.properties.NAME_1
          
           dSource = pService.getTableData(cnf, m_list);
            tooltip
            .html(d.properties.NAME_1 + "<br>" + "District: " + d.properties.NAME_2 + "<br>" + "Qty: " + numCritical)
            .style("left", (d3.event.pageX-document.getElementById(c_id).offsetLeft - 120 )+ "px")
            .style("top", (d3.event.pageY-document.getElementById(c_id).offsetTop - 80) + "px")
          }).on('mouseleave',(d)=>{
           
            tooltip
            .html("");
          })
    
    
    
 
  
  });
  this.renderData(this.DataMp[i].id,svg)
    data2.then(function (topology) {
        g.selectAll('path')
       
          .data(t.feature(topology,topology.objects.ne_10m_admin_0_Kashmir_Occupied).features)
        
          .enter()
          .append('path')
          .attr('stroke', '#ff073a20')
          .attr('fill',"#ffffff")
      
          .attr('stroke-width', 1)
          .attr('d', path)
         
    
    
    
 
  
  });
    }
}
 renderData(ids,svg) {
  
console.log(this.max_number)

  const color = d3
    .scaleSequential(d3.interpolateReds)
    .domain([0, this.max_number[ids] / 0.8 || 10]);

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
    (this.max_number[ids] < numCells ? numCells : this.max_number[ids]) /
      (numCells - 1)
  );

  cells = Array.from(Array(numCells).keys()).map((i) => i * delta);

  svg
    .append('g')
    .attr('class', 'legendLinear')
    .attr('transform', 'translate(260, -200)');

  const legendLinear = legendColor()
    .shapeWidth(70)
    .cells(cells)
    .titleWidth(4)
    .labels(label)
    .orient('vertical')
    .scale(color);

  svg.select('.legendLinear').call(legendLinear);
};
onResize(event) {
  this.breakpoint = (event.target.innerWidth <= 784) ? 3 : this.DataTBL.length*2+3;
}





}