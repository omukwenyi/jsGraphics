"use strict";

function createMenu() {
    let menu = document.getElementById("menu");
    let nav = document.createElement("nav");
    let list = document.createElement("ol");

    let index = document.createElement("li");
    index.innerHTML = "<a href='index.html'>Radial</a>";
    let spoke = document.createElement("li");
    spoke.innerHTML = "<a href='spoke.html'>Spoke</a>";
    let tree = document.createElement("li");
    tree.innerHTML = "<a href='tree.html'>Trees</a>";
    let pie = document.createElement("li");
    pie.innerHTML = "<a href='pie.html'>Pie Chart</a>";
    let barchart = document.createElement("li");
    barchart.innerHTML = "<a href='barchart.html'>Bar Chart</a>";


    list.appendChild(index);
    list.appendChild(spoke);
    list.appendChild(tree);
    list.appendChild(pie);
    list.appendChild(barchart);

    nav.appendChild(list);
    menu.appendChild(nav);
}

createMenu();
