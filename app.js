let catalogo = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let filtro = null;
let page = 1;

// Elementos del DOM
const listProducts = document.querySelector("#elegi_pasta > ul");
const btnMore = document.querySelector("#btnMore");
const cart = document.querySelector("#cart");
const listCart = document.querySelector("#cart > ul");
const btnRemoveAll = document.querySelector("#btnRemoveAll");
const subtotalCart = document.querySelector("#subtotal");
const shippingCart = document.querySelector("#shipping");
const totalCart = document.querySelector("#total");
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
  if (navbar.classList.contains("active")) bloquearScroll();
  else habilitarScroll();
});

btnCarrito.addEventListener("click", (e) => {
  e.preventDefault();
  navbar.classList.remove("active");
  cart.classList.toggle("active");
  if (cart.classList.contains("active")) bloquearScroll();
  else habilitarScroll();
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

const mostrarCarrito = () => {
  carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  listCart.innerHTML = "";
  if (carrito.length === 0) {
    listCart.innerHTML = `<li class="carrito_vacio">Tu carrito está vacío</li>`;
    subtotalCart.innerHTML = `$ 0`;
    shippingCart.innerHTML = `$ 0`;
    totalCart.innerHTML = `$ 0`;
    return;
  }

  // Calcular subtotal, envío y total
  let subTotal = carrito.reduce((a, i) => a + (Number(i.price) * Number(i.cantidad)), 0)
  subtotalCart.innerHTML = `$ ${subTotal}`;
  let envio = 0
  if (subTotal < 1000) {
    envio = 150
  }
  shippingCart.innerHTML = `$ ${envio}`
  totalCart.innerHTML = `$ ${subTotal + envio}`
  
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

// Vaciar carrito

const vaciarCarrito = () => {
  carrito = [];
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
};

btnRemoveAll.addEventListener("click", (e) => {
  e.preventDefault();
  let empty = confirm("¿Estás seguro de que quieres vaciar el carrito?");
  if(empty){
    vaciarCarrito();
  }
});




//Bloquear scroll cuando el menú o carrito están activos
function bloquearScroll() {
  document.body.style.overflow = 'hidden';
  document.body.style.touchAction = 'none'; // 👈 bloquea scroll táctil
}

function habilitarScroll() {
  document.body.style.overflow = '';
  document.body.style.touchAction = '';
}


// Scroll a sección y cierre correcto del menú 
const menuLinks = document.querySelectorAll('#navbar a');

menuLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const target = document.getElementById(targetId);

    // Cerrar menú primero y desbloquear scroll
    if(navbar.classList.contains('active')){
      navbar.classList.remove('active');
      habilitarScroll();
    }

    // Esperamos un poco para que se aplique el desbloqueo
    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth' });
    }, 50); // 50ms es suficiente
  });
});

