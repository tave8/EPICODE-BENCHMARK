

// LOGICA per mostrare il numero e percentuale di domande giuste e sbagliate
// domande giuste = totale domande / numero domande giuste
// domande sbagliate = totale domande / numero domande sbagliate

// prendi parametri della query string sotto la proprietà "risultatiTest"

const parametriUrl = new URLSearchParams(window.location.search);
const risultatiTestStr = parametriUrl.get('risultatiTest');

const risultatiTest = JSON.parse(risultatiTestStr)


// questa libreria non ha bisogno di un pre-calcolo 
// su base 100, ma calcola automaticamente la base 100 derivandola
// da tot domande giuste e tot domande sbagliate
let xValues = ["Wrong", "Correct"];
let yValues = [risultatiTest.totDomandeSbagliate, risultatiTest.totDomandeGiuste];
let barColors = ["#b91d47", "#00aba9"];

window.addEventListener("load", () => {
  const graph = document.getElementById("#graph"); // inserisci codice qui
  new Chart("myChart", {
    type: "doughnut",
    data: {
      datasets: [
        {
          backgroundColor: barColors,
          data: yValues,
        },
      ],
    },
    options: {
      cutoutPercentage: 70,
      tooltips: {
        enabled: false,
      },
    },
  });
});