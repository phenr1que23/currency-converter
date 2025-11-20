const API_BASE = "https://api.frankfurter.app";

const convertButton = document.getElementById("convertButton")
const swapButton = document.getElementById("swapButton")
const amountInput = document.getElementById("amountInput")
const currencySelects = [document.getElementById("currencyFrom"), document.getElementById("currencyTo")]
const divResult = document.getElementById("divResult")

async function fetchCurrencies() {
    try {
        const response = await fetch(`${API_BASE}/currencies`);
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        alert("Não foi possível carregar as moedas.");
    }
}

async function fillCurrencySelects(){
    const currencies = await fetchCurrencies();
    if(!currencies) return
    
    for (let i = 0; i < currencySelects.length; i++){
        for(const code in currencies){
            const option = document.createElement("option")
            option.value = code
            option.textContent = `${code} - ${currencies[code]}`
            currencySelects[i].appendChild(option)
        }
    }    
}

async function convertCurrency(currencyFrom, currencyTo, amount){
    if (amount <= 0 || amount === "") {
        alert("Insira um valor válido.");
        return;
    }

    try{
    const response = await fetch(`${API_BASE}/latest?base=${currencyFrom}&symbols=${currencyTo}`);

    if(!response.ok) throw new Error("Erro ao converter a moeda.")
    
    const result = await response.json();
    const exchangeResult = (amount * result.rates[currencyTo]).toFixed(2);

    divResult.textContent = `${amount} ${currencyFrom} = ${exchangeResult} ${currencyTo}`;

    }catch (error) {
        console.error(error);
        alert("Ocorreu um erro na conversão.");
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
})

fillCurrencySelects()