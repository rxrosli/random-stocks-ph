const mainContainer = document.getElementById('main');
const descriptionContainer = document.getElementById('desc-cont');
const priceContainer = document.getElementById('price-cont');
const buttonContainer = document.getElementById('button-cont');
const spinner = document.getElementById('spinner');
const stockSymbol = document.getElementById('symbol');
const stockName = document.getElementById('name');
const stockPrice = document.getElementById('price');
const stockPercentChange = document.getElementById('percent-change');
const pickStockButton = document.getElementById('pick');
const twitterButton = document.getElementById('twitter');
const chartsButton = document.getElementById('charts');

/**
 * @typedef Stock
 * @type {object}
 * @property {string} name
 * @property {object} price
 * @property {number} price.currency
 * @property {number} price.amount
 * @property {number} percent_change
 * @property {number} volume
 * @property {string} symbol
 */

/** @type {Stock[]} */
let stocks = [];
/** @type {Stock} */
let currentStock;

const randomLimit = (/** @type {number} */ limit) => Math.floor(Math.random() * limit);

const setLoading = (/**@type {boolean} */ bool) => {
	descriptionContainer.style.display = bool ? 'none' : 'flex';
	priceContainer.style.display = bool ? 'none' : 'flex';
	buttonContainer.style.display = bool ? 'none' : 'flex';
	spinner.style.display = bool ? 'flex' : 'none';
};

const pickStock = () => {
	currentStock = stocks[randomLimit(stocks.length)];
	console.log(currentStock);
	if (currentStock.price.amount < 0) {
		console.log('Warning: Negative price, skipping stock...');
		pickStock();
		return;
	}
	stockSymbol.textContent = currentStock.symbol;
	stockName.textContent = `"${currentStock.name}"`;
	stockPrice.textContent = '₱' + currentStock.price.amount.toString();
	stockPercentChange.textContent = currentStock.percent_change.toString() + '%';
	if (currentStock.percent_change > 0) mainContainer.className = 'stock stock--positive';
	else if (currentStock.percent_change < 0)
		mainContainer.className = 'stock stock--negative';
	else mainContainer.className = 'stock';
};

const fetchStocks = async () => {
	const url = 'https://phisix-api4.appspot.com/stocks.json';
	const response = await fetch(url);
	const payload = await response.json();
	stocks = payload.stock;
	console.log(stocks);
};

const tweetStock = () => {
	// prettier-ignore
	const tweet = `$${currentStock.symbol}: ₱${currentStock.price.amount}(${currentStock.percent_change}%)`;
	window.open(
		`https://twitter.com/intent/tweet?text=${encodeURI(tweet)}&hashtags=RandomStocksPH`,
		'_blank'
	);
};

const viewCharts = () => {
	window.open(`https://www.investagrams.com/Chart/PSE:${currentStock.symbol}`);
};

const onLoad = async () => {
	setLoading(true);
	await fetchStocks();
	pickStock();
	setLoading(false);
};

pickStockButton.addEventListener('click', pickStock);
twitterButton.addEventListener('click', tweetStock);
chartsButton.addEventListener('click', viewCharts);

onLoad();
