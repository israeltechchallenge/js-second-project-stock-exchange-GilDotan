const marqueeInnerText = document.getElementById("marquee-text");
const input = document.getElementById("searchLine");
const searchBtn = document.getElementById("searchBtn");
const loadingSpinner = document.getElementById("loadingSpinner");
let baseUrl = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/`;

searchBtn.addEventListener("click", function (event) {
  event.preventDefault();
  getDataFromAPI();
});

// Make a request to the API endpoint for marquee data
fetch(new URL(`stock-screener?&exchange=NASDAQ`, baseUrl))
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    // Check if the data property exists and is not an empty array
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error("No data available");
    }

    // Extract the company symbols and prices
    const symbols = data.map((item) => item.symbol);
    const prices = data.map((item) => item.price);

    // Convert the data to a format suitable for a marquee
    const marqueeText = symbols
      .map((symbol, index) => {
        // Set the price to be green
        const price = `<span style="color: green;">${prices[index]}</span>`;
        return `${symbol}: ${price}`;
      })
      .join("  |  ");

    // Display the marquee on the webpage
    marqueeInnerText.innerHTML = marqueeText;
  })
  .catch((error) => console.error(error));

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
      new URL(`search?query=${input.value}&limit=10&exchange=NASDAQ`, baseUrl)
    );
    const data = await response.json();

    displayList(data);
  } catch (err) {
    console.error(err);
  }
}

async function getCompanyProfile(symbol) {
  try {
    const response = await fetch(new URL(`company/profile/${symbol}`, baseUrl));
    const data = await response.json();
    const profile = data.profile;
    if (profile && profile.image && profile.changesPercentage) {
      return {
        image: profile.image,
        changesPercentage: profile.changesPercentage,
      };
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function displayList(response) {
  let list = document.getElementById("resultsList");
  let fragment = document.createDocumentFragment(); // create a DocumentFragment

  if (response.length === 0) {
    let listItem = document.createElement("li");
    listItem.innerHTML = "No results found";
    fragment.appendChild(listItem); // add the item to the DocumentFragment
  } else {
    for (const item of response) {
      const { name, symbol } = item;
      let listItem = document.createElement("li");
      let link = document.createElement("a");
      link.setAttribute("href", `/company.html?symbol=${symbol}`);
      listItem.classList.add("list-group-item");

      let companyprofile = await getCompanyProfile(symbol);

      // create the image element and set its attributes
      let imageElement = document.createElement("img");
      if (companyprofile && companyprofile.image) {
        imageElement.src = companyprofile.image;
        imageElement.alt = `${name} logo`;
      }

      link.appendChild(imageElement);

      // add the link text
      let linkText = `${name} (${symbol})`;
      link.appendChild(document.createTextNode(linkText));

      if (companyprofile && companyprofile.changesPercentage) {
        const changesPercentage = Number(
          companyprofile.changesPercentage
        ).toFixed(2);
        const changesPercentageClass =
          companyprofile.changesPercentage > 0 ? "positive" : "negative";
        const changesPercentageSpan = document.createElement("span");
        changesPercentageSpan.innerText = ` (${changesPercentage}%)`;
        changesPercentageSpan.classList.add(changesPercentageClass);
        link.appendChild(changesPercentageSpan);
      }

      listItem.style.cursor = "pointer";
      listItem.appendChild(link);
      fragment.appendChild(listItem);
    }
  }

  list.innerHTML = "";
  list.appendChild(fragment);
  disableSpinner();
}
