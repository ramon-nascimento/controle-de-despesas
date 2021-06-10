const transactionsUL = document.querySelector('#transactions')
const balanceDisplay = document.querySelector('#balance')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')

const localStorageTransaction = JSON.parse(localStorage
    .getItem('transactions'))

let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransaction : []

const removeTransaction = ID => {
    transactions = transactions
    .filter(transaction => transaction.id !== ID)

    updateLocalStorage()
    init()
}

const addTransactionIntoDOM = ({ id, name, amount }) => {
    const operator = amount > 0 ? '+' : '-'
    const CSSClass = amount > 0 ? 'plus' : 'minus'

    const amountWithoutOperator = Math.abs(amount)

    const li = document.createElement('li')

    li.classList.add(CSSClass)

    li.innerHTML = `
    ${name} 
    <span>${operator} R$${amountWithoutOperator}</span>
    <button class="delete-btn" onClick="removeTransaction(${id})">
        x
    </button>
    `
    transactionsUL.prepend(li)
}

const getTotal = transactionsAmount => transactionsAmount
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2)

const getIncome = transactionsAmount => transactionsAmount
    .filter(value => value > 0)
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2)

const getExpenses = transactionsAmount => Math.abs(transactionsAmount
    .filter(value => value < 0)
    .reduce((accumulator, transaction) => accumulator + transaction, 0))
    .toFixed(2)

const updatebalanceValues = () => {
    const transactionsAmount = transactions.map(({ amount })  => amount)

    const total = getTotal(transactionsAmount)
    const income = getIncome(transactionsAmount)
    const expense = getExpenses(transactionsAmount)

    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `+ R$ ${income}`
    expenseDisplay.textContent = `- R$ ${expense}`
}

const generateID = () => Math.round(Math.random() * 1000)

const init = () => {
    transactionsUL.innerHTML = ''
    transactions.forEach(transaction => addTransactionIntoDOM(transaction))
    updatebalanceValues()
}

init()

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

const cleanInputs = () => {
    inputTransactionAmount.value = ''
    inputTransactionName.value = ''
}

const validateTransactionsInput = () => {
    
}

const addToTransactionsArray = (transactionName, transactionAmount) => {
    transactions.push({ 
        id: generateID(),
        name: transactionName,
        amount: Number(transactionAmount) 
    })
}

const handleFormSubmit = event => {
    event.preventDefault()

    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim()
    const isSomeInputEmpty = transactionName === '' || transactionAmount === ''

    if(isSomeInputEmpty) {
        alert('Favor preencher completamente os campos da transação.')
        return
    }

    addToTransactionsArray(transactionName, transactionAmount)
    init()
    updateLocalStorage()
    cleanInputs()  
}

form.addEventListener('submit', handleFormSubmit)