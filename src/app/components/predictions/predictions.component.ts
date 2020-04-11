import { Component, OnInit, ElementRef, ViewChild, ɵConsole } from
'@angular/core';  
import * as d3 from 'd3';
import * as t from 'topojson'
import { PredictionService } from '../../services/prediction.service';
import { TableData } from '../../models/table-data';
import { legendColor } from 'd3-svg-legend';
import{DataMap} from '../../models/data-map'
import {TableHead} from '../../models/tabel-head'

declare var Covid19ModelIndia: any;

@Component({
	selector: 'app-predictions',
	templateUrl: './predictions.component.html',
	styleUrls: ['./predictions.component.css']
})

export class PredictionsComponent implements OnInit {

	@ViewChild('buttonToggle') buttonToggle: ElementRef;
	@ViewChild('buttonToggle2') buttonToggle2: ElementRef;
	@ViewChild('DropdownState') DropdownState: ElementRef;

	title = 'MedInv';
	height = 700;
	width = 800;
	Gsvg: any;
	displayedColumns: string[] = ['item', 'district', 'state', 'country', 'units'];
	displayedTypes: DataMap[] = this.getTPdata();
	Thead: TableHead = { sname: 'India', dname: '' }
	dropDownListState: any = {sname:[]}
	dropDownListdist: any ={dname:[]}
	ELEMENT_DATA: TableData[] = []
	dataSource = this.ELEMENT_DATA
	DataMp: DataMap[]
	DataTBL: any[] = []
	def_list: number = 0
	cn_list: number = 0
	sa_list: number = 0
	max_number: any = []
	model: any = []
	inddist: any = []
	paramsType: any = this.displayedTypes[0].id
	date0 = this.getFDate(0)
	Sdate: any = this.date0
  
	constructor(private ps: PredictionService) { }
	ngOnInit(): void {

		this.DataMp = this.getTdata();
		this.ps.requestDataFromMultipleSources().subscribe(responseList => {
			this.inddist = d3.json("assets/india-districts.json");
			const t0 = this.getBaseDate()
			const statesSeries = responseList[0].states_daily;
			const caseSeries = responseList[1].raw_data;
			this.model = new Covid19ModelIndia(t0, statesSeries, caseSeries);
			this.renderView();
		}
		                                                  );
    
	}

	// Render India Map
	renderView() {

		let svgEle = this.createSvgElement();
		this.DataTBL = this.ps.Tdata();
		this.paramsType = this.displayedTypes[0].id
		this.cn_list = this.getCountryCount()
		this.Sdate =  this.date0
		this.dataSource = this.ps.getTableData(this.def_list,this.cn_list,
		                                       this.sa_list,this.DataTBL); 
		this.inddist.then(function (topology) {
		  this.createLegend();
			svgEle[1].selectAll('path')
				.data(t.feature(topology, topology.objects.IND_adm2).features)
				.enter()
				.append('path')
				.attr('stroke', '#ff073a20')
				.attr('stroke-width', 1)
				.attr('d', svgEle[2])
				.on('mouseover', (d) => {
					const n1 = d.properties.st_nm;
					const n2 = d.properties.district;
					const index_key = n2 + "." + n1
					var numDistCount = this.getDistrictCount(index_key)
					svgEle[3]
						.html(d.properties.st_nm + "<br>" + "District: "
							    + d.properties.district + "<br>" + "Qty: "
							    + numDistCount)
						.style("left",
							     (d3.event.pageX - document
								    .getElementById("main").offsetLeft - 120) + "px")
						.style("top",
							     (d3.event.pageY - document
								    .getElementById("main").offsetTop - 80) + "px")
				})
				.on("click", function (d) {
				  this.getDistdata(d.properties.st_nm)
				  this.clickDistrict(d.properties.st_nm,d.properties.district)

				}.bind(this))
				.on('mouseleave', (d) => {
					svgEle[3].html("");
				})
			this.setMapColor();
			this.dropDownListState.sname = this.getStatedata()
		}.bind(this));	
	}

  // Reset To Initial State
  resetView() {
	  this.DropdownState.nativeElement
      .getElementsByTagName('option')[0].selected = true // Set to Postion 0
	  this.def_list = 0
	  this.sa_list = 0
	  this.dropDownListdist.dname = []
	  this.Thead = { sname: 'India', dname: '' }
	  d3.select('svg').remove()
	  this.resetToggle()
	  this.resetToggle2()
	  this.renderView()
  }

	// This function will set color to district in the map
	setMapColor() {
		const maxD =  this.getMaxd()
		const maxInterpolation = this.getMaxInterp()
		
		d3.select('.map').selectAll('path') // Select all paths of the maps
			.style("fill", (d) => {  // Set Color function
				const n1 = d.properties.st_nm; // Select State name
				const n2 = d.properties.district // Select District name
				const key = n2 + "." + n1 // Create district and state key
				const numDistCount = this.getDistrictCount(key) // Initializing 
				const color = // Color Function to set color
					    numDistCount === 0
						  ? '#ffffff' // White Color if its Zero
				//: d3.interpolateReds(
						  : d3.interpolateYlOrRd(
							  //: d3.interpolatePurples(
							  (maxInterpolation * numDistCount) / (maxD) // Color calculation
						  ); // Return RGB Value
				return color; // Return Color
			})
	}

	// Create color Bar Range
	createLegend() {
		const maxInterpolation = this.getMaxInterp();
		const maxd = this.getMaxd()
	  //	console.log(maxd,maxInterpolation)
		const color = d3
			    .scaleSequential(d3.interpolateYlOrRd)
			    .domain([0, maxd / maxInterpolation || 10]);

		let cells = null;
		let label = null;

		label = ({ i, genLength, generatedLabels, labelDelimiter }) => {
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

		cells = Array.from(Array(numCells).keys()).map((i) => i * delta);

		this.Gsvg
			.append('g')
			.attr('class', 'legendLinear')
			.attr('fill', 'white')
			.attr('transform', 'translate(-70, -80)');

		const legendLinear = legendColor()
			    .title("Positive patients (district-wise)")
			    .titleWidth(600)
			    .shapeWidth(50)
			    .cells(cells)
			    .labels(label)
			    .orient('vertical')
			    .scale(color);
		this.Gsvg.select('.legendLinear').call(legendLinear);
	}
	// Create Svg Element
	createSvgElement() {
		let projection = d3.geoMercator().center([88, 18])
			  .scale(1050)
			  .translate([this.width / 2, this.height / 2]);;



		let svg = d3.select("div.svg-parent")

			  .append("svg")

			  .attr('id', 'chart')
		// Responsive SVG needs these 2 attributes and no width and height attr.

			  .attr("preserveAspectRatio", "xMidYMid meet")
			  .attr("viewBox", "-100 -50 800 600")
		// Class to make it responsive.
		// Fill with a rectangle for visualization.

			  .attr("width", this.width)
			  .attr("height", this.height);
		this.Gsvg = svg
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
		return [svg, g, path, tooltip];
	}
	// Handle Change Of toggelButton
	handleChange(data) {
		this.Sdate = data.map
		this.changeViewData()
	}
	// Handle Modrate and crtical
	handleChangeParam(data) {
		this.paramsType = data.id;
		this.changeViewData()
	}
	// Handle Change Of Dropdown District
	changeDropdownDistrict(d){
		const n1 = d.target[d.target.selectedIndex].dataset.state
		const n2 = d.target.value;
		this.clickDistrict(n1,n2)
	}
	// Handle Change Of Dropdown State
	changeDropdownstate(d){
		const newVal = d.target.value;
	  this.getDistdata(newVal)
	}
	
	// Handle Click Function On district
	clickDistrict(n1,n2){
		
		//this.Sdate = this.getFDate(0).toString()
		this.Sdate =  this.date0
		//console.log(this.Sdate)
		this.resetToggle()
		this.Thead.dname = n2 
		this.Thead.sname=  n1
		this.changeViewData()
		
	  
	}

	getDistrictCount(key) {
		//let model = new Covid19ModelIndia()
		//console.log("DC: " + model.lowParams)
		const index = this.model.indexDistrictNameKey(key)
		return index ?
			this.model.districtStat("reported", index,
				                      this.paramsType === "lowParams" ?
                              this.model.lowParams
                              : this.model.highParams,
                              new Date(this.Sdate))
      : 0; 
	}

	getStateCount(key) {
		//let model = new Covid19ModelIndia()
		//console.log("SC: " + model.lowParams)
		const index = this.model.indexStateName(key)
		return index ?
			this.model.stateStat("reported", index,
                           this.paramsType === "lowParams" ?
				                   this.model.lowParams : this.model.highParams,
				                   new Date(this.Sdate))
			: 0; 
	}

	getCountryCount() {
		//let model = new Covid19ModelIndia()
    console.log('Country: ' + this.Sdate)
		
		return this.model.countryStat("reported",
			                            this.paramsType === "lowParams" ?
			                            this.model.lowParams
                                  : this.model.highParams,
                                  new Date(this.Sdate)); 
	}

	getMaxd() { // Get Maximum Number Of affected People
		//console.log(new Date(this.Sdate))
		return this.model.districtStatMax("reported",
                                      this.paramsType === "lowParams" ?
                                      this.model.lowParams
                                      : this.model.highParams,
                                      new Date(this.Sdate)) 
	}


	changeViewData() {

		this.createLegend()
		this.setMapColor()
		if (this.Thead.dname !== '') {
			this.def_list =this.getDistrictCount(this.Thead.dname + "."+
		                                       this.Thead.sname) 
			this.sa_list =this.getStateCount(this.Thead.sname)
		}
		this.cn_list = this.getCountryCount()
		this.dataSource = this.ps.getTableData(this.def_list,
                                           this.cn_list,this.sa_list,
		                                       this.DataTBL) 
	}
	removeColorLegend() {
		d3.select('.legendLinear').remove() // Removes Color Bar From the Map
	}

	// Return Toggle Button
	getTdata() {
		return [
			{ id: "week_0", name: 'Current ', type: true, map: this.getFDate(0) },
			{ id: "week_1", name: 'Week 1 ', type: '', map: this.getFDate(7) },
			{ id: "week_2", name: 'Week 2 ', type: '', map: this.getFDate(14) },
			{ id: "week_3", name: 'Week 3 ', type: '', map: this.getFDate(21) },
			{ id: "week_4", name: 'Week 4 ', type: '', map: this.getFDate(28) },
		]
	}
	getTPdata() {
		return [
			{ id: 'lowParams', name: 'Low rate', type: '', map: '' },
			{id: 'highParams', name: 'High rate', type: '',map: ''}
		]
	}
	getFDate(n) { // Return a future date from the base date
		var t0 = this.getBaseDate()
		var date = new Date(t0)
		//console.log('t0 = ' + t0)
		date.setDate(date.getDate() + n); // Add Date with n days
		//console.log('date set = ' + n + ': ' + date)
		return date;// return date object
	}
	getBaseDate() {
		let t0 = new Date();
		t0.setDate(t0.getDate() - 1);
		return t0
	}
	getStatedata() {
		let data = []
		let state = []
		data[0] = { sname: "Select State" }
		d3.selectAll(".map").selectAll('path').each(function (d, i) {
			data[i+1] = { sname: d.properties.st_nm }
		})
		
		state = data.map(dta => dta.sname);
		return state.filter((x, i, a) =>  x && a.indexOf(x) === i ).sort((a, b) => {
			return (b==="Select State")?1:a.localeCompare(b)})
	}
	getDistdata(name) {
		let data = []
		let state = []
		data[0] = { sname: name ,dname:"Select District"}
		d3.selectAll(".map").selectAll('path').each(function (d, i) {
		  data[i+1] = { sname: d.properties.st_nm, dname: d.properties.district }})
		state = data.map(dta => dta.sname);
		this.dropDownListdist.dname =  data.filter(element => element.sname == name)
      .sort((a, b) => {
        return (b.dname==="Select District")?1:a.dname.localeCompare(b.dname) 
		  })
	}

	resetToggle() {
		this.buttonToggle.nativeElement.querySelector(".active")
      .classList.remove('active') // Select all DOM Element From Element
		this.buttonToggle.nativeElement.children[0]
      .classList.add('active') // Set Active to first DOM Element
	}
	resetToggle2() {
		this.buttonToggle2.nativeElement.querySelector(".active")
      .classList.remove('active') // Select all DOM Element From Element
		this.buttonToggle2.nativeElement.children[0]
      .classList.add('active') // Set Active to first DOM Element
	}
	getMaxInterp() {

		//let model = new Covid19ModelIndia()

		let d2ms = 1000 * 3600 * 24 // ms in a day
		let d1 = new Date(this.Sdate).valueOf()
    let d0 = this.getBaseDate().valueOf()
		let factor = 1
		factor = this.paramsType == "lowParams" ?
      2 * ((d1 - d0) / 7 / d2ms + 1) / 4 :
			3 * ((d1 - d0) / 7 / d2ms + 1) / 4

		return factor
	}
	
}