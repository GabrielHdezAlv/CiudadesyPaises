/* eslint-disable linebreak-style */
/* eslint-disable radix */
/* eslint-disable eqeqeq */
/* eslint-disable no-plusplus */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
// eslint-disable-next-line import/extensions
import { gameData } from './questions.js';

const paises = gameData.countries;
const myMap = L.map('myMap');
const tiempo = document.getElementById('tiempo');

/**
 * Contador que sumará 1 al valor actuál del tiempo
 */
function contador() {
  const cont = parseInt(tiempo.textContent);

  const sum = cont + 1;
  tiempo.innerHTML = sum;
}

/**
 * Generamos el mapa con la ubicación del CIFP Cesar Manrique
 */
// eslint-disable-next-line vars-on-top
let marker;
$(() => {
  const tilesProvider = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  myMap.setView(['28.457364001409033', '-16.284016164025623'], '13');

  L.tileLayer(tilesProvider, {
    maxZoom: '18',
  }).addTo(myMap);
  marker = L.marker(['28.457364001409033', '-16.284016164025623']);
  marker.addTo(myMap).bindPopup('Cesar Manrique');
});

// Google Pie Chart
google.charts.load('current', { packages: ['corechart'] });

function drawChartCurve() {
  const dataCurve = google.visualization.arrayToDataTable(datosCharCurve());

  const options = {
    title: 'Ocurrencia de países',
  };

  const chart = new google.visualization.PieChart(
    // eslint-disable-next-line comma-dangle
    document.getElementById('piechart')
  );

  chart.draw(dataCurve, options);
}
google.charts.setOnLoadCallback(drawChartCurve);

/**
 * Generamos un array con los datos que introduciremos en el Pie Chart
 *
 * @returns {Array} Array que contiene la información a introducir en el Pie Chart
 */
const chartDatosCurve = [];
function datosCharCurve() {
  const datosTotal = [['Partidas', 'Tiempo']];

  chartDatosCurve.forEach((dato) => {
    datosTotal.push(dato);
  });

  return datosTotal;
}

const chartDatos = [];
/**
 * Generamos el array con el contenido del Line Chart
 *
 * @returns {Array} Este array es el contenido del Line Chart
 */
function datosdrawChart() {
  const datosTotal = [['Partidas', 'Tiempo']];

  chartDatos.forEach((dato) => {
    datosTotal.push(dato);
  });

  return datosTotal;
}

/**
 * Generamos el Line Chart
 */
function drawChart() {
  const data = google.visualization.arrayToDataTable(datosdrawChart());

  const options = {
    title: 'Company Performance',
    curveType: 'function',
    legend: { position: 'bottom' },
  };

  const chart = new google.visualization.LineChart(
    // eslint-disable-next-line comma-dangle
    document.getElementById('curve_chart')
  );

  chart.draw(data, options);
}
google.charts.setOnLoadCallback(drawChart);

const btnNewGame = document.getElementById('newGame');
// eslint-disable-next-line no-use-before-define
btnNewGame.addEventListener('click', (event) => genJuego(event));

/**
 * Generamos el juego
 *
 * @param {Event} event Se usa para deshabilitar y habilitar el boton de "Nueva Partida"
 */
function genJuego(event) {
  event.target.disabled = true;
  const paisesSelect = [];
  const ciudadesSelect = [];
  let contFinal = 0;

  // Iniciamos el contador del juego
  tiempo.innerHTML = 0;
  const tiempoInterval = setInterval(contador, 1000);

  // eslint-disable-next-line no-use-before-define
  delCiudadesPaises();

  // eslint-disable-next-line no-use-before-define
  genPais(paisesSelect, ciudadesSelect);
  // eslint-disable-next-line no-use-before-define
  genCiudad(ciudadesSelect);

  $('.divNameCiudad').draggable({
    revert: 'invalid',
  });

  $('.divDropPais').droppable({
    drop(evento, ui) {
      goCity(evento, ui);
      putChartCircle(evento.target.id);
      contFinal++;

      const nodosPaises = document.getElementsByClassName('divDropPais');
      if (contFinal == nodosPaises.length) {
        btnNewGame.disabled = false;
        clearInterval(tiempoInterval);
        addToLineChart(tiempo.textContent);
      }
    },
  });
}

/**
 * Al acertar un droppable, optenemos el nombre del país y lo introducimos en el PieChart
 *
 * @param {String} nombrePais
 */
function putChartCircle(nombrePais) {
  let salida = false;

  chartDatosCurve.forEach((datoPais) => {
    if (datoPais[0] == nombrePais) {
      salida = true;
      datoPais[1]++;
    }
  });

  if (!salida) {
    chartDatosCurve.push([nombrePais, 1]);
  }

  google.charts.setOnLoadCallback(drawChartCurve);
}

/**
 * Añadimos el tiempo jugado a el Line Chart
 *
 * @param {Integer} tiempoPartida Tiempo en el que hemos jugado la partida
 */
function addToLineChart(tiempoPartida) {
  chartDatos.push(['Partida Ejemplo', parseInt(tiempoPartida)]);
  google.charts.setOnLoadCallback(drawChart);
}

/**
 * Eliminamos las ciudades y países
 *
 */
function delCiudadesPaises() {
  const ciudades = document.getElementById('divCiudades');
  const divPaises = document.getElementById('divPaises');

  while (ciudades.firstElementChild != null) {
    ciudades.removeChild(ciudades.firstElementChild);
    divPaises.removeChild(divPaises.firstElementChild);
  }
}

/**
 * Generamos los div de los droppables (Los Países)
 *
 * @param {Array} paisesSelect Países generados de forma aleatoria para ser colocados en el juego
 * @param {Array} ciudadesSelect Ciudades generadas de forma aleatoria
 */
function genPais(paisesSelect, ciudadesSelect) {
  for (let cont = 0; cont < 5; cont++) {
    let pais;
    let salida = false;

    while (!salida) {
      pais = paises[getRandom(paises)];
      if (!paisesSelect.includes(pais)) {
        paisesSelect.push(pais);
        salida = true;
      }
    }

    const ciudadRandom = pais.cities[getRandom(pais.cities)].name;
    ciudadesSelect.push(ciudadRandom);

    const divPais = document.createElement('div');
    const namePais = document.createElement('div');
    namePais.className = 'divNamePais';
    const textPais = document.createTextNode(pais.name);
    namePais.appendChild(textPais);
    divPais.appendChild(namePais);

    const dropPais = document.createElement('div');
    dropPais.className = 'divDropPais';
    dropPais.id = pais.name;
    divPais.appendChild(dropPais);

    const divPaises = document.getElementById('divPaises');
    divPaises.appendChild(divPais);

    // AGREGAMOS EL DROPPABLE DE LA CIUDAD
    $(`#${pais.name}`).droppable({
      accept: `#ciudad${pais.name}`,
    });
  }

  return paisesSelect;
}

/**
 * Colocamos de forma aleatoria en el juego las ciudades y generamos sus div mediante DOM
 *
 * @param {Array} ciudadesSelect Ciudades seleccionadas de forma aleatoria
 */
function genCiudad(ciudadesSelect) {
  const ciudades = [];

  for (let index = 0; index < ciudadesSelect.length; index++) {
    let salida = false;

    while (!salida) {
      const ciudad = ciudadesSelect[getRandom(ciudadesSelect)];
      if (!ciudades.includes(ciudad)) {
        ciudades.push(ciudad);

        const divCiudad = document.createElement('div');
        divCiudad.className = 'divNameCiudad';
        const textCiudad = document.createTextNode(ciudad);
        divCiudad.appendChild(textCiudad);
        divCiudad.id = getIdCiudad(ciudad);
        divCiudad.name = ciudad;

        const divCiudades = document.getElementById('divCiudades');
        divCiudades.appendChild(divCiudad);

        salida = true;
      }
    }
  }
}

/**
 * Nos dirigimos en el mapa a la ciudad dropeada
 *
 * @param {*} evento
 * @param {String} ui
 */
function goCity(evento, ui) {
  const ciudad = ui.draggable;
  ciudad.draggable('disable');

  paises.forEach((pais) => {
    pais.cities.forEach((city) => {
      if (city.name == ciudad[0].textContent) {
        const mapLocal = city.location;
        // myMap.setView(mapLocal, '13');
        myMap.flyTo(mapLocal, '13');
        myMap.removeLayer(marker);
        marker = L.marker(mapLocal);
        marker.addTo(myMap).bindPopup(ciudad[0].name);
      }
    });
  });
}

/**
 * Generamos el id de la ciudad
 *
 * @param {String} ciudad
 * @returns {String} Retorna el id de la ciudad
 */
function getIdCiudad(ciudad) {
  let id = '';

  paises.forEach((pais) => {
    pais.cities.forEach((city) => {
      if (city.name == ciudad) {
        id = `ciudad${pais.name}`;
      }
    });
  });

  return id;
}

/**
 * Retornamos un número de forma aleatoria
 *
 * @param {Array} valor
 * @returns {Integer} Número aleatorio entre 0 y el número de países
 */
function getRandom(valor) {
  return Math.floor(Math.random() * valor.length);
}
