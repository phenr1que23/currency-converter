const API_BASE = "https://api.frankfurter.app";

const convertButton = document.getElementById("convertButton")
const swapButton = document.getElementById("swapButton")
const amountInput = document.getElementById("amountInput")
const currencySelects = [document.getElementById("currencyFrom"), document.getElementById("currencyTo")]
const resultText = document.getElementById("result-text")
const loading = document.getElementById("loading")

hideLoading()
async function fetchCurrencies() {
    try {
        const response = await fetch(`${API_BASE}/currencies`);
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }
        const currencies = await response.json();
        localStorage.setItem('apiDataCache', JSON.stringify(currencies))

    } catch (error) {
        console.error(error);
        alert("Não foi possível carregar as moedas.");
    }
}

function getCurrencies(){
    const currenciesJSONString = localStorage.getItem('apiDataCache');
    if(currenciesJSONString){
        const currencies = JSON.parse(currenciesJSONString)
        return currencies;
    }
} 

async function fillCurrencySelects(){
    const currencies = getCurrencies();
    if(!currencies) return
    
    for (let i = 0; i < currencySelects.length; i++){
        for(const code in currencies){
            const option = document.createElement("option")
            option.value = code
            option.textContent = `${code} - ${currencies[code]}`
            currencySelects[i].appendChild(option)
        }
    }    

    currencySelects[0].value = "USD"
    currencySelects[1].value = "BRL"
}

function preventSameSelection(selectOne, selectTwo){
    if(selectOne.value === selectTwo.value){
        for(const option of selectTwo.options){
            if (option.value !== selectOne.value) {
                selectTwo.value = option.value;
                break;
             }
        }
    }
}

function showLoading(){
    loading.style.display = "block"
    resultText.style.display = "none"
}

function hideLoading(){
    loading.style.display = "none"
    resultText.style.display = "block"
}

async function convertCurrency(currencyFrom, currencyTo, amount){
    const numericAmount = Number(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
        alert("Insira um valor numérico válido.");
        return;
    }

    showLoading()
    try{

    const response = await fetch(`${API_BASE}/latest?base=${currencyFrom}&symbols=${currencyTo}`);

    if(!response.ok) throw new Error("Erro ao converter a moeda.")
    
    const result = await response.json();
    const exchangeResult = (amount * result.rates[currencyTo]).toFixed(2);

    resultText.textContent = `${amount} ${currencyFrom} = ${exchangeResult} ${currencyTo}`;

    }catch (error) {
        console.error(error);
        alert("Ocorreu um erro na conversão.");
    }
    finally{
        hideLoading();
    }
}

convertButton.addEventListener("click", () => {
    const currencyFrom = currencySelects[0].value;
    const currencyTo = currencySelects[1].value;
    const amount = amountInput.value

    if (currencyFrom === currencyTo) {
        alert("Selecione duas moedas diferentes.");
        return;
    }

    convertCurrency(currencyFrom, currencyTo, amount)
});

swapButton.addEventListener("click", () => {
    const tempValue = currencySelects[0].value
    currencySelects[0].value = currencySelects[1].value
    currencySelects[1].value = tempValue
    convertButton.click();
})

currencySelects[0].addEventListener("change", () => {
    preventSameSelection(currencySelects[0], currencySelects[1]);
});

currencySelects[1].addEventListener("change", () => {
    preventSameSelection(currencySelects[1], currencySelects[0]);
});

async function init() {
    await fetchCurrencies();
    await fillCurrencySelects();
}

init();