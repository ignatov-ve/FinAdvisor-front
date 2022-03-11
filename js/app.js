const form = document.querySelector("#form");
const selectLocation = document.querySelector("#location");
const selectBranche = document.querySelector("#branche");
const selectOkved = document.querySelector("#okved");
const inputEquity = document.querySelector("#equity");
const result = document.querySelector(".main__form__result");
let isLocation = false;
let isBranche = false;

const disabledSelect = () => {
  if (isLocation && isBranche) {
    selectOkved.disabled = false;
  }
};

selectLocation.addEventListener("change", (event) => {
  event.preventDefault();
  isLocation = true;
  disabledSelect();
});

selectBranche.addEventListener("change", (event) => {
  event.preventDefault();
  isBranche = true;
  disabledSelect();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log(
    selectLocation.value,
    selectBranche.value,
    selectOkved.value,
    inputEquity.value
  );
  if (document.querySelector(".hidden")) {
    document.querySelector(".hidden").classList.remove("hidden");
  }
  document.querySelector(".date").innerText = 10;
  result.scrollIntoView({ behavior: "smooth" });
});
