
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
    new Inventory("Masks", function(n){ return n*2;}, "x 100 / day"),
    new Inventory("Gowns", function(n){ return n*3;}),
    new Inventory("Gloves",function(n){ return n*5;}, "x 100 / day")
];

    
ilen = ilist.length;
np = 100;
ihtml = "Estimates for " + np + " persons. <ul>";

for (i=0;i<ilen;i++) {
    ihtml += "<li>" +
	ilist[i].name +
	" = " + ilist[i].estimateFor(np) +
	" " + ilist[i].units +
	"</li>";
}

ihtml += "</ol>";



document.getElementById("inventory").innerHTML = ihtml;
