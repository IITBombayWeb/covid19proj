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
  sname: string;
  dname:string
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
  mapCol:any = 3
  tabCol:any=6;
  displayedColumns: string[] = ['name', 'estimate', 'units'];
  Thead:TableHead[] =[];
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
  public responseData:any=[];
  public responseData1: any;
  public responseData2: any;
  breakpoint: number;
  def_list:number=100;
  max_number:any=[];
  max_number2:any=[];
  constructor(private http: HttpClient,private ps: PredectionService) { }
  ngOnInit(): void {
    this.DataMp= [
      {id:"week_0", name: 'As on ' , type: 'week0',map: this.getDate(0)},
      {id:"week_1", name: 'Week 1 ', type: 'week1',map: this.getDate(7)},
      {id:"week_2", name: 'Week 2 ',  type: 'week2',map:this.getDate(14)},
      {id:"week_3", name: 'Week 3 ',  type: 'week3',map:this.getDate(21)},
    ];

  
    
    this.breakpoint = (window.innerWidth <= 784) ? 6: 9;
    this.mapCol = (window.innerWidth <= 784) ?6: 3;
    this.tabCol = (window.innerWidth <= 784) ? 6: 6;
    this.ps.requestDataFromMultipleSources().subscribe(responseList => {
      this.responseData['data'] = responseList[0];
      this.getMAx()
      const data =  d3.json("assets/india-districts.json");
      const  data2 =   d3.json("assets/ne_10m_admin_0_Kashmir_Occupied.json");
     
     this.renderView(data,data2);
 
  });
   
    
  }
  getMAx(){
    for(let i =0;i< this.DataMp.length;i++){
      this.max_number[this.DataMp[i].id] = this.maxcalculate(this.objCOn(this.responseData['data']));
    }
   
  }
  getDate(n){
    var date = new Date('28 March 2020');
    date.setDate(date.getDate() + n);
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
    this.Thead[this.DataMp[i].id] =[];
    svg.call(d3.zoom()
      .extent([[0, 0], [this.width, this.height]])
      .scaleExtent([1, 8])
      .on("zoom", zoomed));

  function zoomed() {
    g.attr("transform", d3.event.transform);
  }
  
    let aread = this.responseData['data'];
    let maxConfirmed = 0;
    this.DataTBL[this.DataMp[i].id] = this.ps.Tdata();
    this.dataSource[this.DataMp[i].id] =  this.ps.getTableData(this.def_list,this.DataTBL[this.DataMp[i].id]);
    const tData = this.DataTBL[this.DataMp[i].id]
    let pService =  this.ps
    var dSource =[]
    dSource=  this.dataSource[this.DataMp[i].id]
    let c_id = "main-"+this.DataMp[i].id
  
    let Ddate = this.DataMp[i].map
	      //const max_d =[170,170,170,170]
    let index = i
    let headD =[]
    headD =  this.Thead;
    const in_id = this.DataMp[i].id;



	      //var max_d[index] = maxd;



    data.then(function (topology) {
      
    var model = new Covid19ModelIndia();
    var maxd = model.districtStatMax("carriers", model.lowParams, Ddate);
	      console.log('date maxd: ' + Ddate + maxd.toString())
    var maxInterpolation = (i+1.)/4.;
	      console.log('maxInterp' + i + ' ' + maxInterpolation);


        g.selectAll('path')
       
          .data(t.feature(topology,topology.objects.IND_adm2).features)
        
          .enter()
          .append('path')
          .attr('stroke', '#ff073a20')

          .attr('fill', function (d) {
            const n1 = d.properties.st_nm;
            const n2 =  d.properties.district
            var numCritical = 0
               var model = new Covid19ModelIndia()
               const dist_id = n2+"."+n1
               var districtIndex = model.indexDistrictNameKey(dist_id);
              if(districtIndex)
                 numCritical = model.districtStat("carriers", districtIndex, model.lowParams, Ddate);
                //  if(numCritical >  maxConfirmed)
                //      maxConfirmed = numCritical
            


            const color =
            numCritical === 0
                ? '#ffffff'
                : d3.interpolateReds(
                    (maxInterpolation * numCritical) / ( maxd )
                  );
	      //console.log('dist: ' + dist_id  + ' ' + numCritical + ', ' + maxd , ', ', maxInterpolation*numCritical/maxd);
            return color;
	      //(maxInterpolation * numCritical) / ( max_d[index] || 0.001)
          })
         
      
          .attr('stroke-width', 1)
          .attr('d', path)
          .on('mouseover', (d) => {
          
            const n1 = d.properties.st_nm;
            const n2 =  d.properties.district;
            var numCritical = 0
            var model = new Covid19ModelIndia()
            const dist_id = n2+"."+n1
            var districtIndex = model.indexDistrictNameKey(dist_id);
           if(districtIndex)
              numCritical = model.districtStat("carriers", districtIndex, model.lowParams, Ddate);
            tooltip
            .html(d.properties.st_nm + "<br>" + "District: " + d.properties.district + "<br>" + "Qty: " + numCritical)
            .style("left", (d3.event.pageX-document.getElementById(c_id).offsetLeft - 120 )+ "px")
            .style("top", (d3.event.pageY-document.getElementById(c_id).offsetTop - 80) + "px")
          })
          .on("click", function(d){
          
            const n1 = d.properties.st_nm;
            const n2 =  d.properties.district;
            var numCritical = 0
            var model = new Covid19ModelIndia()
            const dist_id = n2+"."+n1
            var districtIndex = model.indexDistrictNameKey(dist_id);
           if(districtIndex)
              numCritical = model.districtStat("carriers", districtIndex, model.lowParams, Ddate);
			    //console.log(headD)
            headD[in_id] = {sname:"State : "+n1,dname:"District : "+n2}
       
              dSource = pService.getTableData(numCritical,tData);
           
          }).on('mouseleave',(d)=>{
           
            tooltip
            .html("");
          })
    
          const color = d3
          .scaleSequential(d3.interpolateReds)
          .domain([0, maxd / maxInterpolation || 10]);
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
      
        const numCells = 10;
        const delta = Math.floor(
			    (maxd < numCells ? numCells : maxd ) / (numCells - 1)
        );
			    //(max_d[index] < numCells ? numCells : max_d[index]) /
      
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
    
        
			    //console.log(maxConfirmed)
       
  });
  
 
  //   data2.then(function (topology) {
  //       g.selectAll('path')
       
  //         .data(t.feature(topology,topology.objects.ne_10m_admin_0_Kashmir_Occupied).features)
        
  //         .enter()
  //         .append('path')
  //         .attr('stroke', '#ff073a20')
  //         .attr('fill',"#ffffff")
      
  //         .attr('stroke-width', 1)
  //         .attr('d', path)
         
    
    
    
 
  
  // });
    }
}
 renderData(ids,svg) {
  
			    //console.log(this.max_number2[ids])

  
};
onResize(event) {
  this.breakpoint = (event.target.innerWidth <= 784) ? 6 :9;
    this.mapCol = (event.target.innerWidth <= 748) ? 6: 3;
    this.tabCol = (event.target.innerWidth <= 748) ? 6: 6;
}


 stylestate( feature ) {
  //STATE STYLES

  //var c_count = counter("State", feature);
  return {
    weight: 1,
    opacity: 0.9,
    color: "#000",
    fill: false
  };
}


}
