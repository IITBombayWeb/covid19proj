
function Inventorydemo(name, value=0, units="") {
    this.name = name;
    this.value = value;
    this.units = units
}


function Inventory(name, efunc, units="") {
    this.name = name;
    this.estimateFor = efunc;
    this.units = units
}


document.getElementById("demo").innerHTML = "Hello JavaScript";



var ilist = [
    new Inventory("Vents", function(n){ return n*10;}),
    new Inventory("Sanitizer", function(n){ return n*20;}, " lt / day"),
    new Inventory("Gowns", function(n){ return n*7;}),
    new Inventory("Oxygen",function(n){ return n*5;}, "cylinders / day")
];

    
ilen = ilist.length;
np = 100;
ihtml = "Estimates for " + np + " persons. <table><tr><th>Item</th><th>Estimate</th><th>Units</th></tr> ";


for (i=0;i<ilen;i++) {
    ihtml += "<tr>" +
	"<td>" + ilist[i].name + "</td>" +
	"<td>" + ilist[i].estimateFor(np) + "</td>" +
	"<td>" + ilist[i].units + "</td>" +
	"</tr>";
}

ihtml += "</table>";



document.getElementById("inventory").innerHTML = ihtml;
