const input = document.getElementById("searchLine");
const searchBtn = document.getElementById("searchBtn");
const loadingSpinner = document.getElementById("loadingSpinner");

searchBtn.addEventListener("click", function (event) {
  event.preventDefault();
  getDataFromAPI();
});

function enableSpinner() {
  loadingSpinner.classList.remove("d-none");
}
function disableSpinner() {
  loadingSpinner.classList.add("d-none");
}

document
  .getElementById("searchLine")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      getDataFromAPI();
    }
  });

async function getDataFromAPI() {
  let list = document.getElementById("resultsList");
  list.innerHTML = "";
  enableSpinner();
  try {
    const response = await fetch(
      `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${input.value}&limit=10&exchange=NASDAQ`
    );
    const data = await response.json();
    displayList(data);
    console.log({ data });
  } catch (err) {
    console.error(err);
  }
  disableSpinner();
}

function displayList(response) {
  let list = document.getElementById("resultsList");
  if (response.length === 0) {
    let listItem = document.createElement("li");
    listItem.innerHTML = "No results found";
    list.appendChild(listItem);
  } else {
    for (const item of response) {
      const { name, symbol } = item;
      let listItem = document.createElement("li");
      let link = document.createElement("a");
      link.setAttribute("href", `/company.html?symbol=${symbol}`);
      listItem.classList.add("list-group-item");
      link.innerHTML = `${name} (${symbol})`;
      listItem.style.cursor = "pointer";
      listItem.appendChild(link);
      list.appendChild(listItem);
      listItem.addEventListener("click", function () {
        window.location.href = link.getAttribute("href");
      });
    }
  }
}


