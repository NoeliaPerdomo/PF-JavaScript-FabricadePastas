let catalogo = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let filtro = null;
let page = 1;

// Elementos del DOM
const listProducts = document.querySelector("#elegi_pasta > ul");
const btnMore = document.querySelector("#btnMore");
const cart = document.querySelector("#cart");
const listCart = document.querySelector("#cart > ul");
const navbar = document.querySelector("#navbar");
const btnMenu = document.querySelector("#btnMenu");
const btnCarrito = document.querySelector("#btnCarrito");
const inputCategories = document.querySelectorAll("[name='categoria']");

// Leer archivo JSON
const leerArchivo = async () => {
  const res = await fetch("pastas.json");
  if (!res.ok) throw new Error("No se pudo cargar pastas.json");
  return await res.json();
};

// Mostrar productos según filtro y paginación
const mostrarProductos = () => {
  let lista = filtro && filtro !== "todas"
    ? catalogo.filter((p) => p.category.toLowerCase() === filtro.toLowerCase())
    : catalogo;

  const productosVisibles = lista.slice(0, page * 3);

  listProducts.innerHTML = "";
  productosVisibles.forEach((producto) => listProducts.append(tarjetaProducto(producto)));

  // Ocultar botón "ver más" si no hay más productos
  if (productosVisibles.length >= lista.length) {
    btnMore.style.display = "none";
  } else {
    btnMore.style.display = "block";
  }
};


const tarjetaProducto = (producto) => {
  const { name, price, cardImg } = producto;
  const li = document.createElement("li");
  li.innerHTML = `
    <picture><img src="${cardImg}" alt="${name}" /></picture>
    <ul>
      <li class="info"><h3>${name}</h3><p>$${price}</p></li>
      <li class="cart"></li>
      <form>
        <button><img src="img/carrito_agregar.png" alt="Agregar al carrito" /> Agregar al carrito</button>
      </form>
    </ul>
  `;
  return li;
};

// Cambiar filtro
const setearFiltro = (e) => {
  filtro = e.target.value;
  let allLabels = document.querySelectorAll("label[for*='c-']");
  allLabels.forEach((label) => label.classList.remove("active"));

  let currentLabel = document.querySelector(`[for='c-${filtro}']`);
  if (currentLabel) currentLabel.classList.add("active");

  if (filtro === "todas") {
    filtro = null;
    btnMore.style.display = "flex";
  } else {
    btnMore.style.display = "none";
  }

  mostrarProductos();
};

  // Actualizar clases visuales
  let allLabels = document.querySelectorAll("label[for*='c-']");
  allLabels.forEach((label) => label.classList.remove("active"));
  let currentLabel = document.querySelector(`[for='c-${filtro}']`);
  if (currentLabel) currentLabel.classList.add("active");

  // Reset paginación
  page = 1;
  mostrarProductos();



const verMas = (e) => {
  e.preventDefault();
  page++;
  mostrarProductos();
};


catalogo = await leerArchivo();
mostrarProductos();


btnMore.addEventListener("click", verMas);
inputCategories.forEach((input) => input.addEventListener("change", setearFiltro));


btnMenu.addEventListener("click", (e) => {
  e.preventDefault();
  cart.classList.remove("active");
  navbar.classList.toggle("active");
});

btnCarrito.addEventListener("click", (e) => {
  e.preventDefault();
  navbar.classList.remove("active");
  cart.classList.toggle("active");
});
