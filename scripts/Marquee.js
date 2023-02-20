class StockData {
  constructor(symbol, price) {
    this.symbol = symbol;
    this.price = price;
  }
}

async function getStockData() {
  try {
    const response = await fetch(
      new URL(`stock-screener?&exchange=NASDAQ`, baseUrl)
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error("No data available");
    }

    const stockItems = data.map(
      (item) => new StockData(item.symbol, item.price)
    );
    return stockItems;
  } catch (error) {
    console.error(error);
    return null;
  }
}

const marqueeInnerText = document.getElementById("marquee-text");

getStockData().then((stockItems) => {
  if (stockItems) {
    const marqueeText = stockItems
      .map((item) => {
        const price = `<span style="color: green;">${item.price}</span>`;
        return `${item.symbol}: ${price}`;
      })
      .join("  |  ");

    marqueeInnerText.innerHTML = marqueeText;
  }
});
