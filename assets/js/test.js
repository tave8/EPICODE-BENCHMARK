let indiceDomandaAttuale = 0;
let ultimoSetInterval = null;

// questo contatore conta il totale delle risposte giuste
let contatoreRisposteGiuste = 0;

function main() {
  // questo viene triggerato quando la pagina si carica
  window.addEventListener("load", () => {
    // passa subito alla prossima domanda
    passaAProssimaDomanda();
    //   configura/aggiungi event listeners
    addEventListeners();
  });
}
main();

function addEventListeners() {
  const bottoniRisposta = document.querySelectorAll(".risposte > .bottoni");
  bottoniRisposta.forEach((bottone) => {
    bottone.addEventListener("click", handleClickBottoneRisposta);
  });
}

function handleClickBottoneRisposta(ev) {
  // prendi il valore della risposta nel campo html
  const rispostaCliccataDaUtente = ev.target.innerText;
  // comparalo con la risposta giusta della domanda attuale
  const indiceDomandaAttuale = indiceProssimaDomanda - 1;

  const rispostaGiustaReale = questions[indiceDomandaAttuale].correct_answer;

  const rispostaEGiusta = rispostaGiustaReale === rispostaCliccataDaUtente;

  // attiva/disattiva questo per verificare come la risposta cliccata da utente
  // corrisponde alla risposta giusta reale
  // console.log("indice domanda attuale: ", indiceProssimaDomanda);
  // console.log("risposta cliccata da utente: ", rispostaCliccataDaUtente);
  // console.log("risposta giusta reale: ", rispostaGiustaReale);
  // console.log("risposta giusta:", rispostaEGiusta ? "SI" : "NO");
  // console.log("-----------------------------------------------")

  if (rispostaEGiusta) {
    contatoreRisposteGiuste += 1;
  }

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
    passaAPaginaRisultati();
    // passa alla prossima pagina
    return;
  }

  const prossimaDomanda = questions[indiceProssimaDomanda];
  //   incremento il contatore attuale
  indiceProssimaDomanda += 1;

  aggiornaDomandaERisposteUI(prossimaDomanda);

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
  aggiornaNumeroDomandeUI(indiceProssimaDomanda);
};

function attivaTimerUI({ countdownSecondi }) {
  const timerEl = document.querySelector("header > .right > .timer > span");
  const ringEl = document.querySelector(".timer .ringprogress");

  const r = 45;
  const CIRC = 2 * Math.PI * r; // ~ 282.74 (meglio di 283 fisso)

  ringEl.style.strokeDasharray = `${CIRC}`;

  clearInterval(ultimoSetInterval);

  let tempoRimasto = countdownSecondi;

  const setRingProgress = (progress01) => {
    // clamp per sicurezza
    const p = Math.max(0, Math.min(1, progress01));
    ringEl.style.strokeDashoffset = CIRC * (1 - p);
  };

  const tick = () => {
    // aggiorna testo
    timerEl.textContent = tempoRimasto;

    // aggiorna ring sincronizzato col testo
    setRingProgress(tempoRimasto / countdownSecondi);

    // fine tempo
    if (tempoRimasto === 0) {
      clearInterval(ultimoSetInterval);
      passaAProssimaDomanda();
      return;
    }

    tempoRimasto -= 1;
  };

  tick();
  ultimoSetInterval = setInterval(tick, 1000);
}
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

//ciambella timber

function attivaCiambellaTimer() {
  const ring = document.querySelector(".timer > .ringsvg > .ringprogress");
  const CIRC = 283;

  function setRingProgress(progress) {
    ring.style.strokeDashoffset = CIRC * (1 - progress);
  }
  let p = 1;
  setRingProgress(p);
  const id = setInterval(() => {
    p += 0.03;
    if (p <= 0) {
      p = 0;
      clearInterval(id);
    }
    setRingProgress(p);
  }, 1000);
}

function getCiambellaRingEl() {
  return document.querySelector(".timer > .ringsvg > .ringprogress");
}

function calcolaCIRC(radius) {
  return 2 * Math.PI * radius;
}

function aggiornaNumeroDomandeUI(indiceProssimaDomanda) {
  const testoConNumDomanda = `QUESTION ${indiceProssimaDomanda} / ${questions.length}`;
  document.querySelector("footer .questionNumber").textContent = testoConNumDomanda;
}

function passaAPaginaRisultati() {
  const totDomande = questions.length;
  const totDomandeGiuste = contatoreRisposteGiuste;
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
function aggiornaDomandaERisposteUI(domandaObj) {
  // prendi l'html di interesse
  // html domanda
  const domandaEl = document.querySelector(".question > h1");
  // questo è un array di stringhe che contiene TUTTE le risposte
  // di una data domanda
  const tutteRisposte = ottieniTutteRisposte(domandaObj);

  domandaEl.textContent = domandaObj.question;
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

  // questo passo intermedio randomizza le risposte, cioè
  // garantisce che la risposta giusta non sarà mai allo stesso indice
  const tutteRisposteRandomizzate = randomizzaRisposte(tutteRisposte);

  // itera per ogni risposta della data domanda, e presentala nell'interfaccia
  tutteRisposteRandomizzate.forEach((testoRisposta) => {
    bottoniRisposteEl[indiceRisposta].textContent = testoRisposta;
    indiceRisposta += 1;
  });
}

function randomizzaRisposte(risposte) {
  return shuffleArray(risposte);
}

// TODO: inserire funzionalità per randomizzare l'inserimento della risposta corretta
function ottieniTutteRisposte(domandaObj) {
  const correctAnswer = domandaObj.correct_answer;
  const incorrectAnswers = domandaObj.incorrect_answers;
  const allAnswers = [correctAnswer, ...incorrectAnswers];
  return allAnswers;
}

function haiTerminatoDomande() {
  return indiceProssimaDomanda === questions.length;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // swap
  }
  return array;
}
