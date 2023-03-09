const currentUrl = window.location.href;
const searchParams = new URL(currentUrl).search;
const searchValue = new URLSearchParams(searchParams);
const queryString = searchValue.get("symbol");
const companyImage = document.getElementById("company-image");
const nameOfCompany = document.getElementById("company-name");
const companySector = document.getElementById("company-sector");
const companyIndustry = document.getElementById("company-industry");
const companyStockPrice = document.getElementById("stock-price");
const companyDescription = document.getElementById(
  "company-description-container"
);
const companyLink = document.getElementById("company-link");
const stockChange = document.getElementById("stock-change");
const changeWraper = document.getElementById("change-wraper");
const changeSign = document.getElementById("change-sign");
const chartCanvas = document.getElementById("myChart");
const loadingSpinner = document.getElementById("loadingSpinner");

let baseUrl = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/`;

function enableSpinner() {
  loadingSpinner.classList.remove("d-none");
}
function disableSpinner() {
  loadingSpinner.classList.add("d-none");
}

let history;
let profile;
let image;
async function getCompanyProfile() {
  enableSpinner();
  try {
    const response = await fetch(
      new URL(`company/profile/${queryString}`, baseUrl)
    );
    const data = await response.json();
    profile = data;
    image = data.profile.image;
    await pagePopulate(data);
    disableSpinner();
  } catch (err) {
    console.error(err);
  }
}

getCompanyProfile();

async function pagePopulate(data) {
  companyImage.setAttribute("src", data.profile.image);
  nameOfCompany.innerText = data.profile.companyName;
  companySector.innerText = data.profile.sector;
  companyIndustry.innerText = data.profile.industry;
  companyStockPrice.innerText = data.profile.price + "  ";
  companyDescription.innerText = data.profile.description;
  companyLink.setAttribute("href", data.profile.website);
  stockChange.innerText = Number(data.profile.changesPercentage).toFixed(2);
  checkStockChange(data.profile.changesPercentage);
  history = getHistory();
}

function checkStockChange(change) {
  if (change > 0) {
    changeWraper.classList.add("green-text");
    changeSign.innerHTML = "+";
  } else {
    changeWraper.classList.add("red-text");
  }
}

const everyNth = (arr, nth) => arr.filter((e, i) => i % nth === nth - 1);
const historyStep = (arr) => Math.trunc(arr.length / 18);

async function getHistory() {
  try {
    const response = await fetch(
      new URL(`historical-price-full/${queryString}?serietype=line`, baseUrl)
    );
    const data = await response.json();
    history = data.historical;
    step = historyStep(history);
    filteredHistory = everyNth(history, step);
    filteredHistory.unshift(history[0]);
    dates = filteredHistory.map((item) => item.date);
    dates.reverse();
    myChart.data.labels = dates;
    prices = filteredHistory.map((item) => item.close);
    prices.reverse();
    myChart.data.datasets[0].data = prices;
    myChart.update();
  } catch (err) {
    console.error(err);
  }
}

const myChart = new Chart(chartCanvas, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Stock Price History $",
        data: [],
        borderWidth: 1,
        fill: "origin",
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  },
});
