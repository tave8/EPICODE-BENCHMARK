const stelle = document.querySelectorAll(".stella");
let selectedRating = 0;

function updateStars(value) {
  stelle.forEach((star) => {
    star.classList.toggle("active", star.dataset.value <= value);
  });
}

stelle.forEach((star) => {
  star.addEventListener("mouseenter", () => {
    updateStars(star.dataset.value);
  });

  star.addEventListener("click", () => {
    selectedRating = star.dataset.value;
    updateStars(selectedRating);
  });
});

document.querySelector(".valutazione").addEventListener("mouseleave", () => {
  updateStars(selectedRating);
});
