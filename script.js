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

/**
 * @typedef Payload
 * @type {object}
 * @property {Stock[]} stock
 * @property {string} as_of
 */

/** @type {Stock[]} */
let stocks = [];
/** @type {Stock} */
let currentStock;

// Utility
const randomLimit = (/** @type {number} */ limit) => Math.floor(Math.random() * limit);

// Behavior
const setLoading = (/**@type {boolean} */ bool) => {
	descriptionContainer.style.display = bool ? 'none' : 'flex';
	priceContainer.style.display = bool ? 'none' : 'flex';
	buttonContainer.style.display = bool ? 'none' : 'flex';
	spinner.style.display = bool ? 'flex' : 'none';
};

const fetchStocks = async () => {
	const url = 'https://phisix-api4.appspot.com/stocks.json';
	// const url = 'http://phisix-api4.appspot.com/stocks/BDO.2022-06-05.json'; // Returns 404
	const response = await fetch(url);
	if (response.status === 404) throw Error('Not Found');

	/** @type {Payload} */
	const payload = await response.json();
	if (payload.stock === null) throw Error('Empty Payload');
	stocks = payload.stock;
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

// Error handling
const onNotFound = () => {
	setLoading(false);
	buttonContainer.style.display = 'none';
	stockSymbol.textContent = '503';
	stockName.textContent = 'Service Unavailable';
	stockPercentChange.textContent = 'Market is closed today.';
	mainContainer.className = 'stock stock--error';
};
const onEmptyPayload = () => {
	setLoading(false);
	buttonContainer.style.display = 'none';
	stockSymbol.textContent = '503';
	stockName.textContent = 'Service Unavailable';
	stockPercentChange.textContent = 'Data is being refreshed. Please comeback later.';
	mainContainer.className = 'stock stock--error';
};

// Event Handling
const onLoad = async () => {
	setLoading(true);
	try {
		await fetchStocks();
		pickStock();
		setLoading(false);
	} catch (error) {
		if (error.message === 'Not Found') onNotFound();
		if (error.message === 'Empty Payload') onEmptyPayload();
		console.log(error);
	}
};
pickStockButton.addEventListener('click', pickStock);
twitterButton.addEventListener('click', tweetStock);
chartsButton.addEventListener('click', viewCharts);

onLoad();
