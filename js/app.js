const URL = "https://fin.skroy.ru/api";
// const URLTest = "http://localhost:3000";
let myChart;

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
  addOkvedToselect(okvedsToIndustry);
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
  const response = await fetch(
    `${URL}/prediction/?sum=${sum}000&okved=${okved}&region=${region}`
  );
  const data = await response.json();
  renderResult(data);
  renderChart(data);
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
    .scrollIntoView({ behavior: "smooth", block: "center" });
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

const renderChart = (chart) => {
  const ctx = document.querySelector("#myChart");
  const labels = [];
  const backgroundColor = [];
  const borderColor = [];

  for (let label of Object.keys(chart)) {
    if (label === "noprofit") {
      labels.push("Не окупится");
    } else {
      labels.push(label.split("_")[1]);
    }

    const rgb = `${Math.floor(Math.random() * 256)},${Math.floor(
      Math.random() * 256
    )},${Math.floor(Math.random() * 256)}`;
    backgroundColor.push(`rgba(${rgb},0.4)`);
    borderColor.push(`rgb(${rgb})`);
  }

  const data = {
    labels,
    datasets: [
      {
        label: "Вероятность окупаемости по годам",
        data: Object.values(chart),
        backgroundColor,
        borderColor,
        borderWidth: 1,
      },
    ],
  };
  if (typeof myChart === "object") {
    myChart.destroy();
  }

  myChart = new Chart(ctx, {
    type: "bar",
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};
main();
