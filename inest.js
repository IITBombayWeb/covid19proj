
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
    //PPE: Persons and Protective Equipment
    new Inventory("Doctors", function(n){ return Math.ceil(n/10*4);},"per day"),
    new Inventory("Nurses", function(n){ return n;},"per day"),
    new Inventory("Gowns, Splash Guard", function(n){ return Math.ceil(n*14/5);},"per day"),
    new Inventory("Masks, Gloves", function(n){ return 70*n;}, "per day"),

    //Medical Equipment
    new Inventory("Ventilators", function(n){ return n;}),
    new Inventory("ET Tube", function(n){ return n;}),
    new Inventory("Laryngoscopes", function(n){ return Math.ceil(n/20);}),
    new Inventory("Ambu Bags", function(n){ return n;}),
    new Inventory("Glass case", function(n){ return n;}),
    new Inventory("Infusion pump", function(n){ return n;}),
    

    //Medical Consumables
    new Inventory("Sanitizer", function(n){ return Math.ceil(n*14/10000);}, " lt / day"),
    new Inventory("Oxygen (medium)",function(n){ return n*4;}, "cylinders / day"),
    new Inventory("Central, Peripheral lines",function(n){ return Math.ceil(n/3);}, "per day"),
    new Inventory("IV sugar, saline",function(n){ return Math.ceil(n*2*500/1000);}, "l / day"),
    new Inventory("Suction catheter",function(n){ return n;}),
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
