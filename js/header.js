"use strict";

function createMenu() {
    let menu = document.getElementById("menu");
    let nav = document.createElement("nav");
    let list = document.createElement("ol");

    addMenuItem(list, "index", "Radial");
    addMenuItem(list, "graphs", "Graphs");
    addMenuItem(list, "tree","Trees");
    addMenuItem(list, "pie","Pie chart");    
    addMenuItem(list, "barchart","Bar Chart");
   
    addMenuItem(list, "line","Line Chart");
    addMenuItem(list, "scatter","Scatter Plot");
    addMenuItem(list, "time","Time Series");

    nav.appendChild(list);
    menu.appendChild(nav);
}

function addMenuItem(list, page, pageText){
    let item = document.createElement("li");
    item.innerHTML = "<a href='" + page + ".html'>"+ pageText +"</a>";
    list.appendChild(item);
}
createMenu();
