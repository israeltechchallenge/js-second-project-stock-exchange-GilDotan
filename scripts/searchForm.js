let userInput = "";

class SearchForm {
  constructor(container) {
    this.container = container;
    this.input = null;
    this.searchBtn = null;
    this.baseUrl =
      "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/";
    this.searchHandler = null;
    this.initialize();
  }

  initialize() {
    const form = document.createElement("form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.handleSearch();
    });

    const inputGroup = document.createElement("div");
    inputGroup.classList.add("input-group", "mb-3");

    this.input = document.createElement("input");
    this.input.type = "text";
    this.input.placeholder = "Search for companies...";
    this.input.classList.add("form-control");
    inputGroup.appendChild(this.input);

    this.searchBtn = document.createElement("button");
    this.searchBtn.type = "submit";
    this.searchBtn.textContent = "Search";
    this.searchBtn.classList.add("btn", "btn-primary");
    inputGroup.appendChild(this.searchBtn);

    form.appendChild(inputGroup);

    this.container.appendChild(form);
  }

  async handleSearch() {
    const query = this.input.value.trim();
    console.log(userInput);
    console.log(query);
    userInput = query;
    console.log(userInput);

    if (query.length === 0) return;
    try {
      const response = await fetch(
        `${this.baseUrl}search?query=${query}&limit=10&exchange=NASDAQ`
      );
      const data = await response.json();
      if (this.searchHandler) {
        this.searchHandler(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
    }
  }

  onSearch(handler) {
    this.searchHandler = handler;
  }
}
