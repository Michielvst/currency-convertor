const fromSelect = document.querySelector('[name="from_currency"]');
const toSelect = document.querySelector('[name="to_currency"]');
const input = document.querySelector('[name="from_amount"]');
const output = document.querySelector('.to_amount');
const form = document.querySelector('form');
const endpoint = 'https://api.exchangeratesapi.io/latest';
const ratesbyBase = {};

const currencies = {
  USD: 'United States Dollar',
  AUD: 'Australian Dollar',
  BGN: 'Bulgarian Lev',
  BRL: 'Brazilian Real',
  CAD: 'Canadian Dollar',
  CHF: 'Swiss Franc',
  CNY: 'Chinese Yuan',
  CZK: 'Czech Republic Koruna',
  DKK: 'Danish Krone',
  GBP: 'British Pound Sterling',
  HKD: 'Hong Kong Dollar',
  HRK: 'Croatian Kuna',
  HUF: 'Hungarian Forint',
  IDR: 'Indonesian Rupiah',
  ILS: 'Israeli New Sheqel',
  INR: 'Indian Rupee',
  JPY: 'Japanese Yen',
  KRW: 'South Korean Won',
  MXN: 'Mexican Peso',
  MYR: 'Malaysian Ringgit',
  NOK: 'Norwegian Krone',
  NZD: 'New Zealand Dollar',
  PHP: 'Philippine Peso',
  PLN: 'Polish Zloty',
  RON: 'Romanian Leu',
  RUB: 'Russian Ruble',
  SEK: 'Swedish Krona',
  SGD: 'Singapore Dollar',
  THB: 'Thai Baht',
  TRY: 'Turkish Lira',
  ZAR: 'South African Rand',
  EUR: 'Euro',
};

function generateOptions(options) {
  return Object.entries(options).map(([currencyCode, currencyName]) => {
    return `<option value="${currencyCode}">${currencyCode} - ${currencyName}</option>`;
  }).join();
}

async function fetchRates(base = 'USD') {
  const url = `${endpoint}?base=${base}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.rates;
}

// convert, save rates in object 
async function convert(amount, from, to) {
  if(!ratesbyBase[from]){
    ratesbyBase[from] = await fetchRates(from);
  }
  const rate = ratesbyBase[from][to];
  return amount * rate;
}

// format currency
function formatCurrency(amount, currency) {
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
}

// handle input
async function handleInput() {
   const rawAmount = await convert(input.value, fromSelect.value, toSelect.value);
   output.innerHTML = formatCurrency(rawAmount, toSelect.value);
}

// populate option elements
const optionsHTML = generateOptions(currencies);
fromSelect.innerHTML = optionsHTML;
toSelect.innerHTML = optionsHTML;

// eventlistener
form.addEventListener('input', handleInput);