const criptomonedaSelect = document.querySelector("#criptomonedas");
const monedaSelect = document.querySelector("#moneda");
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");

let objBusqueda = {
  moneda: "",
  criptomoneda: "",
};

const obtenerCriptomonedas = (criptomonedas) =>
  new Promise((resolve) => {
    resolve(criptomonedas);
  });

document.addEventListener("DOMContentLoaded", () => {
  consultarCriptomonedas();

  formulario.addEventListener("submit", submitFormulario);

  criptomonedaSelect.addEventListener("change", leerValor);
  monedaSelect.addEventListener("change", leerValor);
});

async function consultarCriptomonedas() {
  const url =
    "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

  // Cuando hay solo una linea en un arrow function se da por hecho el return
  /* fetch(url)
    .then((respuesta) => respuesta.json())
    .then((resultado) => {
      return obtenerCriptomonedas(resultado.Data);
    })
    .then((criptomonedas) => selectCriptomonedas(criptomonedas)); */

  try {
    const respuesta = await fetch(url);
    const resultado = await respuesta.json();
    const criptomoneda = await obtenerCriptomonedas(resultado.Data);
    selectCriptomonedas(criptomoneda);
  } catch (error) {
    console.log(error);
  }
}

function selectCriptomonedas(criptomonedas = []) {
  criptomonedas.forEach((cripto) => {
    const { FullName, Name } = cripto.CoinInfo;

    const option = document.createElement("option");
    option.value = Name;
    option.textContent = FullName;

    criptomonedaSelect.appendChild(option);
  });
}

function submitFormulario(e) {
  e.preventDefault();

  const { moneda, criptomoneda } = objBusqueda;

  if (moneda == "" || criptomoneda == "") {
    mostrarAlerta("Ambos campos son obligatorios");

    return;
  }

  consultarAPI();
}

function leerValor(e) {
  objBusqueda[e.target.name] = e.target.value;
}

function mostrarAlerta(msg) {
  const existeAlerta = document.querySelector(".error");

  if (!existeAlerta) {
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("error");

    divMensaje.textContent = msg;

    formulario.appendChild(divMensaje);

    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }
}

async function consultarAPI() {
  const { moneda, criptomoneda } = objBusqueda;

  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

  mostrarSpinner();

  /* fetch(url)
    .then((respuesta) => respuesta.json())
    .then((cotizacion) => {
      mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
    }); */

  try {
    const respuesta = await fetch(url);
    const cotizacion = await respuesta.json();
    mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
  } catch (error) {
    console.log(error);
  }
}

function mostrarCotizacionHTML(cotizacion) {
  const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

  limpiarHTML(resultado);

  const precio = document.createElement("p");
  precio.classList.add("precio");
  precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

  const precioAlto = document.createElement("p");
  precioAlto.innerHTML = `Precio más alto del día: <span>${HIGHDAY}</span>`;

  const precioBajo = document.createElement("p");
  precioBajo.innerHTML = `Precio más bajo del día: <span>${LOWDAY}</span>`;

  const ultimasHoras = document.createElement("p");
  ultimasHoras.innerHTML = `Variación últimas 24 horas: <span>${CHANGEPCT24HOUR}%</span>`;

  const ultimaActualizacion = document.createElement("p");
  ultimaActualizacion.innerHTML = `Última actualización: <span>${LASTUPDATE}</span>`;

  resultado.appendChild(precio);
  resultado.appendChild(precioAlto);
  resultado.appendChild(precioBajo);
  resultado.appendChild(ultimasHoras);
  resultado.appendChild(ultimaActualizacion);
}

function mostrarSpinner() {
  limpiarHTML(resultado);

  const spinner = document.createElement("DIV");
  spinner.classList.add("sk-folding-cube");

  spinner.innerHTML = `
    <div class="sk-cube1 sk-cube"></div>
    <div class="sk-cube2 sk-cube"></div>
    <div class="sk-cube4 sk-cube"></div>
    <div class="sk-cube3 sk-cube"></div>
  `;

  resultado.appendChild(spinner);
}

function limpiarHTML(contenedor) {
  while (contenedor.firstChild) {
    contenedor.removeChild(contenedor.firstChild);
  }
}
