const stelle = document.querySelectorAll(".stella");
const stellaAccesa = "./assets/img/star.svg";
const stellaSpenta = "./assets/img/star-blue.svg";

stelle.forEach((stellaAttuale, indiceCliccato) => {
  stellaAttuale.addEventListener("click", () => {
    stelle.forEach((stellaDaAggiornare, indiceAttuale) => {
      //se l'indice cliccato minore o uguale le stelle restano spente
      if (indiceAttuale <= indiceCliccato) {
        stellaDaAggiornare.src = stellaAccesa;
      } else {
        stellaDaAggiornare.src = stellaSpenta;
      }
    });
  });
});
