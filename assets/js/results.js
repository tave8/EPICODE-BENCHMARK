function main() {
  window.addEventListener("load", () => {
    quandoPaginaCarica();
  });
}
main();

function quandoPaginaCarica() {
  const risultatiTest = ottieniRisultatiTestDaUrl();
  mostraRisultatiInGrafico(risultatiTest);
  mostraPercentualiTesto(risultatiTest);
  mostraNumeroDomandeSuTotale(risultatiTest);
}

function mostraNumeroDomandeSuTotale(risultatiTest) {
  const spanNumeroGiusteEl = document.getElementById("numero-domande-giuste");
  const spanNumeroSbagliateEl = document.getElementById("numero-domande-sbagliate");

  const { totDomande, totDomandeGiuste, totDomandeSbagliate } = risultatiTest;

  spanNumeroGiusteEl.innerText = `${totDomandeGiuste} / ${totDomande} questions`;
  spanNumeroSbagliateEl.innerText = `${totDomandeSbagliate} / ${totDomande} questions`;
}

function mostraPercentualiTesto(risultatiTest) {
  // prendi gli span interessati e popolali con le percentuali
  // percentuale-domande-giuste
  const spanPercentualeGiusteEl = document.getElementById("percentuale-domande-giuste");
  const spanPercentualeSbagliateEl = document.getElementById("percentuale-domande-sbagliate");

  const proporzioneGiuste = risultatiTest.totDomandeGiuste / risultatiTest.totDomande;
  const percentualeGiuste = proporzioneGiuste * 100;
  const percentualeGiusteArrotondata = parseFloat(percentualeGiuste.toFixed(2));

  const proporzioneSbagliate = risultatiTest.totDomandeSbagliate / risultatiTest.totDomande;
  const percentualeSbagliate = proporzioneSbagliate * 100;
  const percentualeSbagliateArrotondata = parseFloat(percentualeSbagliate.toFixed(2));

  spanPercentualeGiusteEl.innerText = `${percentualeGiusteArrotondata}%`;
  spanPercentualeSbagliateEl.innerText = `${percentualeSbagliateArrotondata}%`;
}

function mostraRisultatiInGrafico(risultatiTest) {
  console.log("chiamato funzione", risultatiTest);
  // questa libreria non ha bisogno di un pre-calcolo
  // su base 100, ma calcola automaticamente la base 100 derivandola
  // da tot domande giuste e tot domande sbagliate

  const paginaECaricata = document.readyState === "complete";

  if (paginaECaricata) {
    creaGrafico(risultatiTest);
  } else {
    window.addEventListener("load", () => {
      creaGrafico(risultatiTest);
    });
  }
}

function creaGrafico(risultatiTest) {
  let xValues = ["Wrong", "Correct"];
  let yValues = [risultatiTest.totDomandeSbagliate, risultatiTest.totDomandeGiuste];
  let barColors = ["#b91d47", "#00aba9"];

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
}

function ottieniRisultatiTestDaUrl() {
  // LOGICA per mostrare il numero e percentuale di domande giuste e sbagliate
  // domande giuste = totale domande / numero domande giuste
  // domande sbagliate = totale domande / numero domande sbagliate
  // prendi parametri della query string sotto la proprietà "risultatiTest"
  const parametriUrl = new URLSearchParams(window.location.search);
  const risultatiTestStr = parametriUrl.get("risultatiTest");

  const risultatiTest = JSON.parse(risultatiTestStr);

  return {
    totDomande: risultatiTest.totDomande,
    totDomandeSbagliate: risultatiTest.totDomandeSbagliate,
    totDomandeGiuste: risultatiTest.totDomandeGiuste,
  };
}
