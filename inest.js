
function Inventory(name, value=0, units="") {
    this.name = name;
    this.value = value;
    this.units = units
}


document.getElementById("demo").innerHTML = "Hello JavaScript";


var ilist = [
    new Inventory("Vents",10),
    new Inventory("Masks",2, "x 100 / day"),
    new Inventory("Gowns",5),
    new Inventory("Gloves",3, "x 100 / day")
];
    
ilen = ilist.length;
ihtml = "<ul>";

for (i=0;i<ilen;i++) {
    ihtml += "<li>" +
	"Name: " + ilist[i].name +
	" = " + ilist[i].value +
	" " + ilist[i].units +
	"</li>";
}

ihtml += "</ol>";

document.getElementById("inventory").innerHTML = ihtml;
