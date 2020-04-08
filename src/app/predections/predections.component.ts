import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import * as t from 'topojson'
import { PredectionService } from '../predection.service';
import { TableData } from '../table-data';
import {legendColor} from 'd3-svg-legend';
import { ThrowStmt } from '@angular/compiler';
declare var Covid19ModelIndia : any;

export interface Tile {
    color: string;
    cols: number;
    rows: number;
    text: string;
}
export interface DispDate {
    date: string;
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
    title = 'MedInv';
    height = 700;
    width = 800;
    propertyFieldMap = {
				state: 'NAME_1',
				district: 'NAME_2',
    };
    Gsvg:any;
    displayedColumns: string[] = ['item', 'district','state','country', 'units'];
    displayedTypes: DataMap[] = [{id:'lowParams',name:'Moderate',type:'',map:''},
                                 {id:'highParams',name:'Worst case',type:'',
																	map:''}];  
    Thead:TableHead ={sname:'India',dname:''};
    tiles: Tile[] = [
				{text: '0', cols: 1, rows: 1, color: ' rgb(246, 238, 234)'},
				{text: '1 - 10', cols: 1, rows: 1, color: 'rgb(253, 213, 195)'},
				{text: '11-30', cols: 1, rows: 1, color: 'rgb(252, 164, 135)'},
				{text: '31 - 50', cols: 1, rows: 1, color: 'rgb(250, 112, 81)'},
				{text: '51 -70', cols: 1, rows: 1, color: 'rgb(232, 56, 44)'},
				{text: '> 71', cols: 1, rows: 1, color: 'rgb(187, 21, 26)'},
    ];
	dropDownListState:any[]=[]
	dropDownListdata:any[]=[]
    ELEMENT_DATA: TableData[] = [];
    dataSource = this.ELEMENT_DATA;
    DataMp: DataMap[];
    DataTBL:any[]=[];
    ctx:any;
    def_list:number=0;
    cn_list:number=0
    sa_list:number=0
    max_number:any=[];

    //model:any = new Covid19ModelIndia();
		model:any = []
		inddist:any = []
    
    paramsType:any=this.displayedTypes[0].id
    Sdate:DispDate;
    constructor(private ps: PredectionService) { }
    ngOnInit(): void {
				
				this.DataMp=this.getTdata();
				this.ps.requestDataFromMultipleSources().subscribe(responseList => {
						this.inddist =  d3.json("assets/india-districts.json");//Fetch India Map JSON
						
						// responseList.forEach(function (resp,i) {
						// 		console.log(i + ' : ' + resp)
								
						// })
						let t0 = this.getBaseDate()
						console.log('baseDate = ' + t0)
								
						let statesSeries = responseList[0].states_daily;
						let caseSeries   = responseList[1].raw_data;
						this.model        = new Covid19ModelIndia(t0, statesSeries,caseSeries);
						

						//this.DataMp=this.getTdata(this.model);
				//this.DataMp=this.getTdata();
						this.renderView(this.model, this.inddist);

				});

    }

		resetView() {
				this.def_list = 0
				this.sa_list = 0
				this.Thead = {sname:'India', dname:''}
        d3.select('svg').remove()
        this.resetToggel(this.buttonToggle.nativeElement)
        this.resetToggel2(this.buttonToggle2.nativeElement)
				this.renderView(this.model, this.inddist)
				
		}
    // Render India Map
    renderView(model, mapdata){

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
				let fmaxd =  this.getMaxd;
				let fmaxinterp =  this.getMaxInterp;
				let maxd =  0;
				let paramstype = "lowParams";
				let maxInterpfactor = 1
				let headD  = this.Thead;
				let btn = this.buttonToggle.nativeElement;
				let btn2 = this.buttonToggle2.nativeElement;
				//let resetbtn = this.buttonReset.nativeElement;
				let def_list = this.def_list
				let cn_list = this.cn_list
				let sa_list = this.sa_list
				this.Sdate = {date: this.buttonToggle.nativeElement.querySelector('.active').getElementsByTagName('input')[0].value}
				let date = this.Sdate
				this.cn_list = this.getCountryCrtical(model, date.date,this.paramsType)

				let rmLegendFun = this.removeColorLegend
				let mkLegendFun = this.createLegend
				let gsvg = this.Gsvg

				//console.log("init:" + date.date + "cn: " + cn_list)

				this.dataSource =  this.ps.getTableData(this.def_list,
																								this.cn_list,
																								this.sa_list,
																								this.DataTBL);
				let Legend = this.createLegend;
				mapdata.then(function (topology) {
						paramstype = btn2.querySelector('.active')
								.getElementsByTagName('input')[0].value
						maxd = fmaxd(model, date.date,paramstype)
						maxInterpfactor = fmaxinterp(date.date,paramstype)
            Legend(svgEle[0],maxd,maxInterpfactor);
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
										var numCritical = FunCrtical(model, index_key,
																								 btn.querySelector('.active')
																								 .getElementsByTagName('input')[0]
																								 .value,
																								 btn2.querySelector('.active')
																								 .getElementsByTagName('input')[0]
																								 .value) 
										
										svgEle[3]
												.html(d.properties.st_nm + "<br>" + "District: "
															+ d.properties.district + "<br>" + "Qty: "
															+ numCritical)
												.style("left",
															 (d3.event.pageX-document
																.getElementById("main").offsetLeft - 120 )+ "px")
												.style("top",
															 (d3.event.pageY-document
																.getElementById("main").offsetTop - 80) + "px")
								})
								.on("click", function(d){
										resetToggel(btn)
										date.date = btn.querySelector('.active')
												.getElementsByTagName('input')[0].value
										const n1 = d.properties.st_nm;
										const n2 =  d.properties.district;
										const index_key = n2+"."+n1
										let numCritical =
												FunCrtical(model, index_key,
																	 date.date,
																	 btn2.querySelector('.active')
																	 .getElementsByTagName('input')[0].value)
										let Scritical =
												SFunCrtical(model, n1,
																		date.date,
																		btn2.querySelector('.active')
																		.getElementsByTagName('input')[0].value)
										let Ccritical =
												CFunCrtical(model,
																		date.date,
																		btn2.querySelector('.active')
																		.getElementsByTagName('input')[0]
																		.value)
										def_list =  numCritical
										cn_list = Ccritical
										sa_list = Scritical
										headD.sname =n1; headD.dname = n2
										dSource = pService.getTableData(numCritical,
																										cn_list,sa_list,tData);

										rmLegendFun()
										mkLegendFun(gsvg,maxd,maxInterpfactor)
								}).on('mouseleave',(d)=>{
										svgEle[3]
												.html("");
								})
            MapFill(model, FunCrtical,maxd,
										date.date,
										btn2.querySelector('.active')
										.getElementsByTagName('input')[0].value,
										maxInterpfactor);
						
				});



    }

    removeColorLegend(){
				d3.select('.legendLinear').remove() // Removes Color Bar From the Map
    }
		
    // Create color Bar Range
    createLegend(svg,maxd,maxInterpolation){
				const color = d3
				//.scaleSequential(d3.interpolateReds)
							.scaleSequential(d3.interpolateYlOrRd)
				//.scaleSequential(d3.interpolatePurples)
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

				const numCells = 6;
				const delta = Math.floor(
						(maxd < numCells ? numCells : maxd)
								/ (numCells - 1)
				);
				//(max_d[index] < numCells ? numCells : max_d[index]) /

				cells = Array.from(Array(numCells).keys()).map((i) => i * delta);

				svg
						.append('g')
						.attr('class', 'legendLinear')
						.attr('fill','white')
						.attr('transform', 'translate(-70, -80)');

				const legendLinear = legendColor()
							.title("Positive patients (district-wise)")
							.titleWidth(600)
							.shapeWidth(50)
							.cells(cells)
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
						.attr("viewBox", "-100 -50 800 600")
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
				const date = data.map
				this.cn_list = this.getCountryCrtical(this.model, date,this.paramsType)
				console.log("Wchange:" + date + "cn: " + this.cn_list)
				var maxInterpfactor = this.getMaxInterp(date,this.paramsType)

				this.Sdate.date  = date
				if(this.Thead.dname !==''){
						this.def_list =
								this.getDistricCrtical(this.model,
																			 this.Thead.dname+"."
																			 +this.Thead.sname,
																			 date,this.paramsType)
						this.sa_list =
								this.getSateCrtical(this.model,
																		this.Thead.sname,date,this.paramsType)
						this.dataSource =
								this.ps.getTableData(this.def_list,this.cn_list,
																		 this.sa_list,this.DataTBL);
						this.removeColorLegend()
				}
				this.resetMapTable()
				//this.getmpdata()
    }
    // Handle Modrate and crtical
    handleChangeParam(data){
				this.paramsType = data.id;
				const date = this.Sdate.date
				
				//const date = data.map
				this.cn_list = this.getCountryCrtical(this.model, date,this.paramsType)
				console.log("Pchange:" + date + ", cn: " + this.cn_list + data.id)
				//console.log(date + " (maxint): " + maxInterpfactor)
				
				//If it has district name then
				if(this.Thead.dname !==''){
						this.def_list =
								this.getDistricCrtical(this.model,
																			 this.Thead.dname+"."+this.Thead.sname,
																			 date,this.paramsType) 
						this.sa_list =
								this.getSateCrtical(this.model, this.Thead.sname,
																		date,this.paramsType)
				}
				this.resetMapTable()

    }

		resetMapTable() {
				const date = this.Sdate.date

				console.log("reset:" + date + "@" + this.paramsType)
				var maxInterpfactor = this.getMaxInterp(date,this.paramsType)

				this.createLegend(this.Gsvg,this.getMaxd(this.model,
																								 date,this.paramsType),
													maxInterpfactor);
				this.setMapColor(this.model, this.getDistricCrtical,
												 this.getMaxd(this.model,
																			date,this.paramsType),
												 date,this.paramsType,maxInterpfactor) 
				this.dataSource = this.ps.getTableData(this.def_list,
																							 this.cn_list,
																							 this.sa_list, this.DataTBL); 
				
		}
getmpdata(){
	let data =[]
	let state =[]
	d3.selectAll(".map").selectAll('path').each( function(d, i){
		  data[i] = {sname: d.properties.st_nm,dname:d.properties.district}
		
		
  } )
state = data.map(dta => dta.sname); 
this.dropDownListdata = data
this.dropDownListState = state.filter((x, i, a) => x && a.indexOf(x) === i)
//this.dropDownListdata.filter(element => element.sname == "Maharashtra")
}

    resetToggel(btn){
				btn.querySelector(".active").classList.remove('active') // Select all DOM Element From Element
				btn.children[0].classList.add('active') // Set Active to first DOM Element
    }
    resetToggel2(btn){
      btn.querySelector(".active").classList.remove('active') // Select all DOM Element From Element
      btn.children[0].classList.add('active') // Set Active to first DOM Element
  }
    getDistricCrtical(model,key,date,params){
				//let model = new Covid19ModelIndia()
				//console.log("DC: " + model.lowParams)
				const index =  model.indexDistrictNameKey(key)
				return index?
						model.districtStat("reported",index ,
															 params==="lowParams"?
															 model.lowParams:model.highParams,
															 new Date(date))
						:0; // Get District Critical
    }

    getSateCrtical(model, key,date,params){
				//let model = new Covid19ModelIndia()
				//console.log("SC: " + model.lowParams)
				const index =  model.indexStateName(key)
				return index?
						model.stateStat("reported",index , params==="lowParams"?
														model.lowParams:model.highParams,
														new Date(date))
						:0; // Get  State Critical
    }

    getCountryCrtical(model, date,params){
				//let model = new Covid19ModelIndia()
				return model.countryStat("reported",
																 params==="lowParams"?model.lowParams:model.highParams, new Date(date)); // Get Country Critical  
    }

    getMaxd(model, date,params){
				//let model = new Covid19ModelIndia()
				return model.districtStatMax("reported", params==="lowParams"?
																		 model.lowParams:model.highParams,
																		 new Date(date)) // Get Maximum Number Of affected People
    }

    getMaxInterp(date, params){

				//let model = new Covid19ModelIndia()

				let d2ms = 1000 * 3600 * 24 // ms in a day

				let d1 = new Date(date).valueOf()
				let d0 = new Date("28 March 2020").valueOf()
				let factor = 1
				factor = params == "lowParams" ? 2*((d1-d0) /7/d2ms + 1)/4:
						3*((d1-d0) /7/d2ms + 1)/4
				
				return factor 
    }
    

    getstime(){
				return new Date(this.buttonToggle.nativeElement.getElementsByTagName('input')[0].value) // Return time from Toggel Button
    }

    // This function will set color to district in the map
    setMapColor(model,funcrtical,maxd,date,params,maxInterpolation){
				
				
				d3.select('.map').selectAll('path') // Select all paths of the maps
						.style("fill", (d)=>{  // Set Color function
								const n1 = d.properties.st_nm; // Select State name
								const n2 =  d.properties.district // Select District name
								const dist_id = n2+"."+n1 // Create district and state key
								let numCritical = funcrtical(model,dist_id,date,params) // Initializing and set default number of critical

								//console.log(dist_id , numCritical , maxd)
								const color = // Color Function to set color
											numCritical === 0
											? '#ffffff' // White Color if its Zero
								//: d3.interpolateReds(
											: d3.interpolateYlOrRd(
													//: d3.interpolatePurples(
													(maxInterpolation * numCritical) / ( maxd ) // Color calculation
											); // Return RGB Value
								return color; // Return Color
						})
    }
	
    // Return Toggel Button
    getTdata(){
				return [
						{id:"week_0", name: 'Current ' , type: true,map: this.getFDate(0)},
						{id:"week_1", name: 'Week 1 ', type: '',map: this.getFDate(7)},
						{id:"week_2", name: 'Week 2 ',  type: '',map:this.getFDate(14)},
						{id:"week_3", name: 'Week 3 ',  type: '',map:this.getFDate(21)},
				]
    }

    getFDate(n){ // Return a future date from the base date
				var t0 = this.getBaseDate()
				var date = new Date(t0)
				//console.log('t0 = ' + t0)
				date.setDate(date.getDate() + n); // Add Date with n days
				//console.log('date set = ' + n + ': ' + date)
				return date;// return date object
    }
    getBaseDate(){
				let t0 = new Date();
				t0.setDate(t0.getDate() - 0);
				return t0	
    }
}
