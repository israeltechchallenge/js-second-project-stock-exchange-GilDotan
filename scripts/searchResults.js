class SearchResult {
  constructor(resultsElement) {
    this.resultsElement = resultsElement;
    this.loadingSpinner = null;
  }

  toggleSpinner() {
    this.loadingSpinner.classList.toggle("d-none");
  }

  async getCompanyData(symbol) {
    try {
      const response = await fetch(
        new URL(`company/profile/${symbol}`, baseUrl)
      );
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

  async renderResults(response) {
    this.resultsElement.innerHTML = "";

    let list = document.createElement("ul");
    list.classList.add("list-group");

    this.loadingSpinner = document.createElement("div");
    this.loadingSpinner.classList.add("spinner-border", "text-primary");
    document.querySelector(".container").appendChild(this.loadingSpinner);

    if (response.length === 0) {
      let listItem = document.createElement("li");
      listItem.classList.add("list-group-item");
      listItem.innerHTML = "No results found";
      list.appendChild(listItem);
    } else {
      for (const item of response) {
        const { name, symbol } = item;
        let companyProfile = await this.getCompanyData(symbol);

        // create the image element and set its attributes
        let imageElement = document.createElement("img");
        if (companyProfile && companyProfile.image) {
          imageElement.src = companyProfile.image;
          imageElement.alt = `${name} logo`;
        } else {
          imageElement.setAttribute("src", "./images/nasdaqlogo.jpg");
        }
        imageElement.onerror = function () {
          this.src = "./images/nasdaqlogo.jpg";
        };

        const changesPercentageSpan = document.createElement("span");
        if (companyProfile && companyProfile.changesPercentage) {
          const changesPercentage = Number(
            companyProfile.changesPercentage
          ).toFixed(2);
          const changesPercentageClass =
            companyProfile.changesPercentage > 0 ? "positive" : "negative";
          changesPercentageSpan.innerText = ` (${changesPercentage}%)`;
          changesPercentageSpan.classList.add(changesPercentageClass);
        }

        let listItem = document.createElement("li");
        listItem.classList.add("list-group-item");

        let link = document.createElement("a");
        link.setAttribute("href", `/company.html?symbol=${symbol}`);
        const highlighted = renderHighlight(name, symbol);
        console.log(highlighted);
        link.append(highlighted);
        link.appendChild(changesPercentageSpan);
        link.prepend(imageElement);

        listItem.appendChild(link);
        list.appendChild(listItem);

        function renderHighlight(name, symbol) {
          const highlightedText = document.createElement("span");
          const nameAndSymbol = name + " " + symbol;
          const reg = new RegExp(userInput, "gi");
          if (nameAndSymbol.match(reg)) {
            highlightedText.innerHTML = `${nameAndSymbol.replace(
              reg,
              '<span class="highlight">$&</span>'
            )}`;
          } else {
            highlightedText.textContent = `${name} (${symbol})`;
          }
          return highlightedText;
        }
      }
    }
    this.toggleSpinner();
    this.resultsElement.appendChild(list);
  }


}
