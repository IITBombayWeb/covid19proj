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
  title = 'CWR';
  height = 700;
  width = 800;
  maxInterpolation = 0.8;
  propertyFieldMap = {
    state: 'NAME_1',
    district: 'NAME_2',
  };
  mapCol:any = 3
  tabCol:any=6;
  
  displayedColumns: string[] = ['name', 'estimate', 'units'];
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
  public responseData:any=[];
  public responseData1: any;
  public responseData2: any;
  breakpoint: number;
  def_list:number=100;
  max_number:any=[];
  
  def_btn :any;
  constructor(private http: HttpClient,private ps: PredectionService) { }
  ngOnInit(): void {
    this.DataMp=this.getTdata();

  
    
    this.breakpoint = (window.innerWidth <= 784) ? 6: 9;
    this.mapCol = (window.innerWidth <= 784) ?6: 3;
    this.tabCol = (window.innerWidth <= 784) ? 6: 6;
    this.ps.requestDataFromMultipleSources().subscribe(responseList => {
      this.responseData['data'] = responseList[0];
      this.getMAx()
      const data =  d3.json("assets/india-districts.json");
      const  data2 =   d3.json("assets/ne_10m_admin_0_Kashmir_Occupied.json");
     
     this.renderView(data);
 
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

  
  renderView(data){
    // for(let i=0 ; i< this.DataMp.length;i++){

    
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
  
  //  let aread = this.responseData['data'];
    const maxInterpolation = 0.8;
  //  let maxConfirmed = 0;
    this.DataTBL = this.ps.Tdata();
    let def_list = this.def_list
    const tData = this.DataTBL
    let pService =  this.ps
    var dSource =[]
    dSource=  this.dataSource
    let DataMp = this.DataMp;
    let DefMpval = this.getTdata()
    let c_id = "main"
    let Ddate = this.getDate(0)
    let btn =  this.buttonToggle.nativeElement
	      //const max_d =[170,170,170,170]
    let headD  = this.Thead;
  
	      //var max_d[index] = maxd;

        this.dataSource =  this.ps.getTableData(this.def_list,this.DataTBL);

    data.then(function (topology) {
      
        var model = new Covid19ModelIndia();
        var maxd = model.districtStatMax("carriers", model.lowParams, Ddate);
        //console.log('date maxd: ' + Ddate + maxd.toString())
       
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
            btn.querySelector(".active").classList.remove('active')
            btn.children[0].classList.add('active')
            const n1 = d.properties.st_nm;
            const n2 =  d.properties.district;
            var numCritical = 0
            var model = new Covid19ModelIndia()
            const dist_id = n2+"."+n1
            //console.log(DefMpval)
            DataMp = DefMpval
           // console.log(DefMpval)
            var districtIndex = model.indexDistrictNameKey(dist_id);
           if(districtIndex)
              numCritical = model.districtStat("carriers", districtIndex, model.lowParams, Ddate);
            def_list =  numCritical
            headD.sname =n1; headD.dname = n2
            dSource = pService.getTableData(numCritical,tData);
           
          }).on('mouseleave',(d)=>{
           
            tooltip
            .html("");
          })
    
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
   // }
}
 renderData(ids,svg) {
  
			    //console.log(this.max_number2[ids])

  
};
onResize(event) {
  this.breakpoint = (event.target.innerWidth <= 784) ? 6 :9;
    this.mapCol = (event.target.innerWidth <= 748) ? 6: 3;
    this.tabCol = (event.target.innerWidth <= 748) ? 6: 6;
}


getTdata(){
 return [
    {id:"week_0", name: 'Current ' , type: true,map: this.getDate(0)},
    {id:"week_1", name: 'Week 1 ', type: '',map: this.getDate(7)},
    {id:"week_2", name: 'Week 2 ',  type: '',map:this.getDate(14)},
    {id:"week_3", name: 'Week 3 ',  type: '',map:this.getDate(21)},
  ]
}

handleChange(d){
  let numCritical ;
  var model = new Covid19ModelIndia()
  let index_key = 'India'
  if(this.Thead.dname !=='')
       index_key = this.Thead.dname+"."+this.Thead.sname
     
  var districtIndex = model.indexDistrictNameKey(index_key);
  numCritical = model.districtStat("carriers", districtIndex, model.lowParams, d.map);
  this.def_list = numCritical
  this.dataSource =  this.ps.getTableData(this.def_list,this.DataTBL);
} 
}
