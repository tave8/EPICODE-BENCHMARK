const questions = [
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question: "What does CPU stand for?",
    correct_answer: "Central Processing Unit",
    incorrect_answers: ["Central Process Unit", "Computer Personal Unit", "Central Processor Unit"],
    countdownSecondi: 20,
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
let ultimoSetIntervalCiambella = null;

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
  passaAProssimaDomanda({
    // bottonCliccatoEl: ev.target,
  });
}

const passaAProssimaDomanda = function (config = {}) {
  // const { bottonCliccatoEl } = config;

  // togli, da tutti gli elementi html che hanno la classa risposta-selected, la classa risposta-selected
  // document.querySelectorAll(".risposta-selected").forEach((el) => el.classList.remove("risposta-selected"));

  // if (bottonCliccatoEl) {
  // quando utente clicca una risposta, marcare quella risposta come evidenziata
  // bottonCliccatoEl.classList.add("risposta-selected");
  // }

  if (haiTerminatoDomande()) {
    caricaPaginaRisultati();
    // passa alla prossima pagina
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

  initCiambella();

  // verifica che le domande non siano già arrivate alla fine
  // if () {

  // }

  //   aggiorna anche il numero di domande nel footer
  aggiornaNumeroDomandeUI(indiceDomandaAttuale);
};

function attivaTimerUI({ countdownSecondi }) {
  const timerEl = document.querySelector("header > .right > .timer > span");
  let secondiRimasti = countdownSecondi;

  // questa funzionalità permette di pulire il setInterval precedente,
  // questo evita il problema di setInterval che si "accavallano"
  clearInterval(ultimoSetInterval);

  const intervalloTempo = () => {
    // verifica se il tempo arriva allo zero
    // se si, passa alla prossima domanda
    const eTempoAZero = secondiRimasti === 0;

    // se il tempo è a zero, passa alla prossima domanda
    if (eTempoAZero) {
      passaAProssimaDomanda();
    }
    // altrimenti (se il timer è ancora attivo) aggiorna
    // il timer nell'UI
    else {
      timerEl.textContent = secondiRimasti;
    }
    // il nuovo tempo sarà il tempo attuale - 1 (secondo)
    secondiRimasti = secondiRimasti - 1;

    aggiornaCiambella({
      secondiTotali: countdownSecondi,
      secondiRimasti: secondiRimasti,
    });
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

function initCiambella() {
  // console.log("inizializzato ciambella");
  const ring = getCiambellaRingEl();
  const CIRC = calcolaCIRC(48);

  ring.style.strokeDasharray = CIRC;
  ring.style.strokeDashoffset = 0;

  return {
    ring,
    CIRC,
  };
  
}

// ciambella timber
function aggiornaCiambella({ secondiTotali, secondiRimasti }) {
  const ring = getCiambellaRingEl();
  const CIRC = calcolaCIRC(48);
  const progress = secondiRimasti / secondiTotali;
  ring.style.strokeDashoffset = CIRC * (1 - progress);
}


function getCiambellaRingEl() {
  return document.querySelector(".timer > .ringsvg > .ringprogress");
}

function calcolaCIRC(radius) {
  return 2 * Math.PI * radius;
}

// const CIRC = 283;

// function setRingProgress(progress) {
//   ring.style.strokeDashoffset = CIRC * (1 - progress);
// }
// let p = 1;
// setRingProgress(p);
// const id = setInterval(() => {
//   p += 0.02;
//   if (p <= 0) {
//     p = 0;
//     clearInterval(id);
//   }
//   setRingProgress(p);
// }, 1000);

function aggiornaNumeroDomandeUI(indiceDomandaAttuale) {
  const testoConNumDomanda = `QUESTION ${indiceDomandaAttuale} / ${questions.length}`;
  document.querySelector("footer .questionNumber").textContent = testoConNumDomanda;
}

function caricaPaginaRisultati() {
  // TODO
  const totDomande = questions.length;
  const totDomandeGiuste = 1;
  const totDomandeSbagliate = totDomande - totDomandeGiuste;

  const risultatiTest = {
    totDomande,
    totDomandeGiuste,
    totDomandeSbagliate,
  };

  const risultatiTestStr = JSON.stringify(risultatiTest);

  const url = `/results.html?risultatiTest=${risultatiTestStr}`;
  window.location.href = url;
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
