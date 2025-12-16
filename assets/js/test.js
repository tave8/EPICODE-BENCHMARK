const questions = [
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question: "What does CPU stand for?",
    correct_answer: "Central Processing Unit",
    incorrect_answers: ["Central Process Unit", "Computer Personal Unit", "Central Processor Unit"],
    countdownSecondi: 5,
  },
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question: "In the programming language Java, which of these keywords would you put on a variable to make sure it doesn&#039;t get modified?",
    correct_answer: "Final",
    incorrect_answers: ["Static", "Private", "Public"],
    countdownSecondi: 10,
  },
  {
    category: "Science: Computers",
    type: "boolean",
    difficulty: "easy",
    question: "The logo for Snapchat is a Bell.",
    correct_answer: "False",
    incorrect_answers: ["True"],
    countdownSecondi: 5,
  },
];

let indiceDomandaAttuale = 0;
let ultimoSetInterval = null;

// questo viene triggerato quando la pagina si carica
window.addEventListener("load", () => {
  // passa subito alla prossima domanda
  passaAProssimaDomanda();
  //   configura/aggiungi event listeners
  addEventListeners();
});

function addEventListeners() {
  const bottoniRisposta = document.querySelectorAll(".risposte > .bottoni");
  bottoniRisposta.forEach((bottone) => {
    bottone.addEventListener("click", handleClickBottoneRisposta);
  });
}

function handleClickBottoneRisposta(ev) {
  passaAProssimaDomanda();
}

const passaAProssimaDomanda = function () {
  if (haiTerminatoDomande()) {
    // passa alla prossima pagina
    window.location.href = "./results.html";
    return;
  }

  const prossimaDomanda = questions[indiceDomandaAttuale];
  //   incremento il contatore attuale
  indiceDomandaAttuale += 1;

  aggiornaDomandaUI(prossimaDomanda);

  //   TODO: fare meccanismo timer
  // aggiornare l'elemento html interessato ad ogni

  //   DISATTIVA TEMPORANEAMENTE TIMER PER POTER LAVORARE NELLA PAGINA
  attivaTimerUI({
    countdownSecondi: prossimaDomanda.countdownSecondi,
  });

  // verifica che le domande non siano già arrivate alla fine
  // if () {

  // }

  //   aggiorna anche il numero di domande nel footer
  aggiornaNumeroDomandeUI(indiceDomandaAttuale);
};

function attivaTimerUI({ countdownSecondi }) {
  const timerEl = document.querySelector("header > .right > .timer");
  let nuovoTempo = countdownSecondi;

  // questa funzionalità permette di pulire il setInterval precedente,
  // questo evita il problema di setInterval che si "accavallano"
  clearInterval(ultimoSetInterval);

  const intervalloTempo = () => {
    // verifica se il tempo arriva allo zero
    // se si, passa alla prossima domanda
    const eTempoAZero = nuovoTempo === 0;

    // se il tempo è a zero, passa alla prossima domanda
    if (eTempoAZero) {
      passaAProssimaDomanda();
    }
    // altrimenti (se il timer è ancora attivo) aggiorna
    // il timer nell'UI
    else {
      timerEl.textContent = nuovoTempo;
    }
    // il nuovo tempo sarà il tempo attuale - 1 (secondo)
    nuovoTempo = nuovoTempo - 1;
  };

  // problema: setInterval continua all'infinito, invece dovrebbe
  // resettarsi ogni volta che si passa ad una nuova domanda

  // salva l'ultimo setInterval così potrai cancellare l'esecuzione
  // della funzione che c'era all'interno
  ultimoSetInterval = setInterval(() => {
    intervalloTempo();
  }, 1000);

  intervalloTempo();
}

function aggiornaNumeroDomandeUI(indiceDomandaAttuale) {
  const testoConNumDomanda = `QUESTION ${indiceDomandaAttuale} / ${questions.length}`;
  document.querySelector("footer .questionNumber").textContent = testoConNumDomanda;
}

// SCHEMA DOMANDA
//   {
//     category: "Science: Computers",
//     type: "multiple",
//     difficulty: "easy",
//     question: "In the programming language Java, which of these keywords would you put on a variable to make sure it doesn&#039;t get modified?",
//     correct_answer: "Final",
//     incorrect_answers: ["Static", "Private", "Public"],
//     countdownSecondi: 40,
//   },
function aggiornaDomandaUI(domandaObj) {
  // prendi l'html di interesse
  // html domanda
  const domandaEl = document.querySelector(".question > h1");
  domandaEl.textContent = domandaObj.question;
  const tutteRisposte = ottieniTutteRisposte(domandaObj);
  let indiceRisposta = 0;

  const bottoniRisposteEl = document.querySelectorAll(".risposte > .bottoni");

  // siccome alcune domande hanno un numero variabili di risposte,
  // nello specifico o 2 o 4, allora vanno eliminati gli elementi html
  // in più. si assume che l'html delle risposte avrà sempre 4 elementi html.
  const secondoContenitoreRisposte = document.querySelectorAll(".risposte")[1];

  // quando la domanda ha due risposte, nascondi il secondo contenitore
  if (tutteRisposte.length === 2) {
    // elimina il secondo (si assume che sia anche l'ultimo) contenitore
    // di risposte. il contenitore di risposte si identifica con .risposte
    secondoContenitoreRisposte.style.display = "none";
  }
  // quando la domanda ha quattro risposte, mostra il secondo contenitore
  else if (tutteRisposte.length === 4) {
    secondoContenitoreRisposte.style.display = "block";
  }

  tutteRisposte.forEach((testoRisposta) => {
    bottoniRisposteEl[indiceRisposta].textContent = testoRisposta;
    indiceRisposta += 1;
  });
}

// TODO: inserire funzionalità per randomizzare l'inserimento della risposta corretta
function ottieniTutteRisposte(domandaObj) {
  const correctAnswer = domandaObj.correct_answer;
  const incorrectAnswers = domandaObj.incorrect_answers;
  const allAnswers = [correctAnswer, ...incorrectAnswers];
  return allAnswers;
}

function haiTerminatoDomande() {
  return indiceDomandaAttuale === questions.length;
}

// FUNZIONALITà DI TIMER

// var xValues = ["Italy", "France", "Spain", "USA", "Argentina"];
// var yValues = [55, 49, 44, 24, 15];
// var barColors = [
//   "#b91d47",
//   "#00aba9",
//   "#2b5797",
//   "#e8c3b9",
//   "#1e7145"
// ];

// const chart = new Chart("myChart", {
//   type: "doughnut",
//   data: {
//     labels: xValues,
//     datasets: [{
//       backgroundColor: barColors,
//       data: yValues
//     }]
//   },
//   options: {
//     title: {
//       display: true,
//       text: "World Wide Wine Production 2018"
//     }
//   }
// });
