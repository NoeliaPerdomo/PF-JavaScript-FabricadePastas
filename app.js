var catalogo = [];
var carrito = JSON.parse(localStorage.getItem("carrito")) || [];
var filtro = null;
var page = 1;

// Elementos del DOM
const listElegi_pasta = document.querySelector("#elegi_pasta > ul");
const listCart = document.querySelector("#cart > ul");

const btnMenu = document.getElementById("btnMenu");
const navbar = document.getElementById("navbar");

btnMenu.addEventListener("click", (e) => {
  e.preventDefault();
  navbar.classList.toggle("active");
});

const inputCategorias = document.querySelectorAll("[name='categoria']");

// Mostrar/Ocultar carrito
const btnCarrito = document.getElementById("btnCarrito");
const cart = document.getElementById("cart");

btnCarrito.addEventListener("click", (e) => {
  e.preventDefault();
  cart.classList.toggle("active");
});



// Productos
const leerArchivo = async () => await  (await fetch("/pastas.json")).json();
const mostrarPorductos = () => {
  
};


const tarjetaProducto = () => {};
const setearFiltro = () => {};

catalogo = await leerArchivo();

