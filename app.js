var catalogo = [];
var carrito = JSON.parse(localStorage.getItem("carrito")) || [];
var filtro = null;
var page = 1;

//Elementos del DOM

const listElegi_pasta = document.querySelector("#elegi_pasta > ul");
const listCart = document.querySelector("#cart > ul");


const btnMenu = document.getElementById("btnMenu");
const navbar = document.getElementById("navbar");

btnMenu.addEventListener("click", (e) => {
  e.preventDefault();
  navbar.classList.toggle("active");
});

