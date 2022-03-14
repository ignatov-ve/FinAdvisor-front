const URL = "http://localhost:3000";


const main = () => {
  getRegions();
  getIndustries();
  getOkveds();
  addEventToForm();
};

const getRegions = async () => {
  const response = await fetch(`${URL}/regions/`);
  const regions = await response.json();
  regions.sort((a, b) => a.name.localeCompare(b.name));
  addRegionsToSelect(regions);
};

const getIndustries = async () => {
  const response = await fetch(`${URL}/industries/`);
  const industries = await response.json();
  industries.sort((a, b) => a.name.localeCompare(b.name));
  addIndustriesToSelect(industries);
};

const getOkveds = async () => {
  const response = await fetch(`${URL}/okveds/`);
  const okveds = await response.json();
  addEventIndustries(okveds);
};

const addRegionsToSelect = (regions) => {
  const selectLocation = document.querySelector("#location");
  regions.forEach(
    (region) =>
      (selectLocation.innerHTML += `<option value="${region.code}">${region.name}</option>`)
  );
};

const addIndustriesToSelect = (industries) => {
  const selectBranche = document.querySelector("#branche");
  industries.forEach(
    (region) =>
      (selectBranche.innerHTML += `<option value="${region.code}">${region.name}</option>`)
  );
};

const chooseOkvedsToSelect = (okveds, industry) => {
  const okvedsToIndustry = okveds.filter(
    (okved) => okved.industry_code === industry
  );
  okvedsToIndustry.sort((a, b) => a.name.localeCompare(b.name));
  addOkvedToselect(okvedsToIndustry)
};

const addOkvedToselect = (okvedsToIndustry) => {
  const selectOkveds = document.querySelector("#okved");
  selectOkveds.disabled = false;
  selectOkveds.innerHTML =
    '<option selected value="" disabled>Выберите оквэд</option>';
  okvedsToIndustry.forEach((okved) => {
    selectOkveds.innerHTML += `<option value="${okved.okved}">${okved.okved} ${okved.name}</option>`;
  });
};

const addEventIndustries = (okveds) => {
  const selectBranche = document.querySelector("#branche");
  selectBranche.addEventListener("change", (event) => {
    event.preventDefault();
    // isBranche = true;
    // disabledSelect();
    chooseOkvedsToSelect(okveds, selectBranche.value);
  });
};

const addEventToForm = () => {
  const form = document.querySelector("#form");
  const selectLocation = document.querySelector("#location");
  const selectOkveds = document.querySelector("#okved");
  const inputEquity = document.querySelector("#equity");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    getResult(inputEquity.value, selectOkveds.value, selectLocation.value);
  });
};

const getResult = async (sum, okved, region) => {
  // const response = await fetch(
  //   `https://fin.skroy.ru/api/prediction/?sum=${sum}&okved=${okved}&region=${region}`
  // );
  // const data = response.json();
  renderResult({
    noprofit: 0.0126411561562578,
    year_0: 0.3825278134046773,
    year_1: 0.05929825912081528,
    year_2: 0.08478023463854684,
    year_3: 0.0902250654844609,
    year_4: 0.05801802514384321,
    year_5: 0.2567844781156081,
  });
};

const renderResult = (result) => {
  let profit = "";
  let expectation = 0;
  for (key in result) {
    if (result[key] > expectation) {
      profit = key;
      expectation = result[key];
    }
  }
  if (document.querySelector(".hidden")) {
    document.querySelector(".hidden").classList.remove("hidden");
  }
  if (profit === "noprofit") {
    document.querySelector(".date").innerText = "Не окупится";
    document.querySelector(".year").innerText = "";
  } else {
    document.querySelector(".date").innerText = profit.split("_")[1];
    document.querySelector(".year").innerText = endingOfYear(
      +profit.split("_")[1]
    );
  }
  document
    .querySelector(".main__form__result")
    .scrollIntoView({ behavior: "smooth" });
};

const endingOfYear = (year) => {
  if (year % 10 === 1) {
    return "год";
  } else if (year % 10 in [2, 3, 4] && year !== 0) {
    return "года";
  } else {
    return "лет";
  }
};

main();
