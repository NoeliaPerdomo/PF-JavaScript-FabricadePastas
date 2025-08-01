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

// Mostrar productos según filtro y página
const mostrarProductos = () => {
  let lista = filtro && filtro !== "todas"
    ? catalogo.filter((p) => p.category.toLowerCase() === filtro.toLowerCase())
    : catalogo;

  const productosVisibles = lista.slice(0, page * 3);

  listProducts.innerHTML = "";
  productosVisibles.forEach((producto) => listProducts.append(tarjetaProducto(producto)));

  // Ocultar botón "ver más" si no hay más productos
  btnMore.style.display = productosVisibles.length >= lista.length ? "none" : "block";
};

// 🔧 CORREGIDO: Renderiza tarjeta con botón funcional
const tarjetaProducto = (producto) => {
  const { id, name, price, cardImg } = producto;
  const li = document.createElement("li");
  li.innerHTML = `
    <picture><img src="${cardImg}" alt="${name}" /></picture>
    <ul>
      <li class="info"><h3>${name}</h3><p>$${price}</p></li>
      <li class="cart"></li>
      <form>
        <button type="button" class="btn-agregar" data-id="${id}">
          <img src="img/carrito_agregar.png" alt="Agregar al carrito" /> Agregar al carrito
        </button>
      </form>
    </ul>
  `;

  // Asignar funcionalidad al botón
  const boton = li.querySelector(".btn-agregar");
  boton.addEventListener("click", () => {
    agregarProducto(id);
  });

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
    page = 1;
    btnMore.style.display = "flex";
  } else {
    btnMore.style.display = "none";
  }

  mostrarProductos();
};

// Mostrar más productos
const verMas = (e) => {
  e.preventDefault();
  page++;
  mostrarProductos();
};

// Inicializar catálogo y renderizar productos
catalogo = await leerArchivo();
mostrarProductos();

btnMore.addEventListener("click", verMas);
inputCategories.forEach((input) => input.addEventListener("change", setearFiltro));

// Menú y carrito
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

// Carrito
const agregarProducto = (id) => {
  const producto = catalogo.find((p) => p.id == id);
  if (!producto) return;

  const existente = carrito.find((item) => item.id == id);
  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
};

const quitarProducto = (id) => {
  carrito = carrito.filter((item) => item.id != id);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
};

const reducirCantidad = (id) => {
  carrito = carrito.map((item) => {
    if (item.id == id) item.cantidad -= 1;
    return item;
  }).filter((item) => item.cantidad > 0);

  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
};

const vaciarCarrito = () => {
  carrito = [];
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
};

const mostrarCarrito = () => {
  carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  listCart.innerHTML = "";
  if (carrito.length === 0) {
    listCart.innerHTML = `<li class="carrito_vacio">Tu carrito está vacío</li>`;
    return;
  }
  carrito.forEach((i) => listCart.append(crearItemCarrito(i)));
};

const crearItemCarrito = (item) => {
  const element = document.createElement("li");
  element.innerHTML = `
    <picture><img src="${item.cardImg}" alt="${item.name}" /></picture>
    <ul>
      <li class="info">
        <h3>${item.name}</h3>
        <p>$${item.price * item.cantidad}</p>
      </li>
    </ul>
  `;

  const actions = document.createElement("div");
  const btnReduce = document.createElement("button");
  const btnRemove = document.createElement("button");
  const outputQty = document.createElement("output");
  const btnAdd = document.createElement("button");

  btnRemove.setAttribute("type", "button");
  btnReduce.type = btnAdd.type = "button";
  btnReduce.textContent = "-";
  btnAdd.textContent = "+";
  btnRemove.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-icon lucide-trash"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;
  outputQty.value = item.cantidad;

  btnReduce.addEventListener("click", () => reducirCantidad(item.id));
  btnAdd.addEventListener("click", () => agregarProducto(item.id));

  btnRemove.addEventListener("click", (e) => {
    e.preventDefault();
    quitarProducto(item.id);
  });

  actions.append(item.cantidad > 1 ? btnReduce : btnRemove, outputQty, btnAdd);
  element.append(actions);

  return element;
};

// Inicializar carrito visible
mostrarCarrito();

// Vaciar carrito botón
document.getElementById("btnVaciarCarrito").addEventListener("click", vaciarCarrito);
