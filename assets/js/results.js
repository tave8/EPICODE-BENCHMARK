let xValues = ["Correct", "Wrong"];
let yValues = [55, 49];
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
