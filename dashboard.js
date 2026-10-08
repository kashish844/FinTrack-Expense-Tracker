const addTransaction = document.querySelector('#addTransactionBtn');
const type = document.querySelector('#type');
const description = document.querySelector('#description');
const amount = document.querySelector('#amount');
const date = document.querySelector('#date');
const category = document.querySelector('#category');
const saveTransaction = document.querySelector('.submit-transaction');
const modal = document.querySelector('#transactionModal');
const closeModal = document.querySelector('#closeModal');
const transactionForm = document.querySelector('#transactionForm');
const transactionBody = document.querySelector('#transactionBody');
const totalTransaction = document.querySelector('#totalTransactions');
const totalIncome = document.querySelector('#totalIncome');
const totalExpense = document.querySelector('#totalExpense');
const currentBalance = document.querySelector('#currentBalance');
const transactionFilter = document.querySelector('#transactionFilter');
const cashFlowChart = document.querySelector('#cashFlowChart');
const darkModeToggle = document.querySelector('#darkModeToggle');
const body = document.body;
const resetButton = document.querySelector('#resetBtn');
const dashboardNav = document.querySelector('#dashboardNav');
const settingsNav = document.querySelector('#settingsNav');
const section1 = document.querySelector('#dashboardSection');
const section2 = document.querySelector('#settingsSection');
const username = document.querySelector('#usernameDisplay');
const profileName = document.querySelector('#profileName');
const saveChange = document.querySelector('#saveSettingsBtn');
const currency = document.querySelector('#primaryCurrency');
const logout = document.querySelector('#logoutBtn');
const search = document.querySelector('#transactionSearch');


let a = localStorage.getItem("user");
let parse = JSON.parse(a);
username.textContent = parse.username;
profileName.value = parse.username;


const symbols = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    INR: "₹",
    JPY: "¥"
}

let convert = currency.value;

const chart = new Chart(cashFlowChart,{
    type: 'bar',
    data:{
        labels: [],
        datasets:[{
            label:'Income',
            data:[],
            backgroundColor:'green'
        },
        {
            label:'Expense',
            data:[],
            backgroundColor:'red'
        }
    ]
    },
    options:{
        plugins:{
            legend:{
                display:false
            }
        }
    }
});


addTransaction.addEventListener('click',()=>{
    modal.style.display = "flex";
})

closeModal.addEventListener('click',()=>{
    modal.style.display = "none";
})

let newVal = transactionFilter.value;


let state = JSON.parse(localStorage.getItem("transactions")) || [];


let editingCard = null;

function render(){
    let income = 0;
    let expense = 0;
    let dates = [];
    let incomeData = [];
    let expenseData = [];
    transactionBody.innerHTML = "";

    totalTransaction.textContent = `${state.length}`;
    

    let list = state.filter((item)=>{
        return item.category.toLowerCase().includes(search.value.toLowerCase());
    })

    

    if(newVal === "income"){
        list = state.filter((item)=>{
            return item.type === "income";
        })
    }
    
    else if(newVal === "expense"){
        list = state.filter((item)=>{
            return item.type === "expense";
        })
    }


    list.forEach((value)=>{

        const div = document.createElement('tr');
        div.classList.add('container');
        const span = document.createElement('td');
        span.textContent = value.date;
        const span1 = document.createElement('td');
        span1.textContent = value.description;
        const span2 = document.createElement('td');
        span2.textContent = value.category;
        const span3 = document.createElement('td');
        span3.textContent = value.amount;
        const td = document.createElement('td');
        
        const editBtn = document.createElement('button');
        editBtn.textContent = "✎";
        editBtn.classList.add("edit-btn");

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "🗑";
        deleteBtn.classList.add("delete-btn");
        td.append(editBtn,deleteBtn);
        div.append(span,span1,span2,span3,td);
        transactionBody.append(div);

        deleteBtn.addEventListener('click',()=>{
            let val = state.filter((item)=>{
                return item.id !== value.id;
            })
            state = val;
            saveData();
            render();
        })

        editBtn.addEventListener('click',()=>{
            editingCard = value.id;
            type.value = value.type;
            description.value = value.description;
            amount.value = value.amount;
            date.value = value.date;
            category.value = value.category
            modal.style.display = "flex";
            
        })
        dates.push(value.date);

        if(value.type === "income"){
            incomeData.push((Number(value.amount)));
            expenseData.push(0);
        }
        else{
            if(value.type === "expense"){
                expenseData.push((Number(value.amount)));
                incomeData.push(0);
            }
        }

    })

    let val = state.reduce((acc,sum)=>{
                if(sum.type === "income"){
                    return acc+Number(sum.amount);
                }
                else{
                    return acc;
                }
            },0);
            
            income = val;
            totalIncome.textContent = `${symbols[convert]}${val.toFixed(2)}`;
    
        
        let val1 = state.reduce((acc,sum)=>{
            if(sum.type === "expense"){
                return acc+Number(sum.amount);
            }
            else{
                return acc;
            }
        },0);
         
        expense = val1;
         totalExpense.textContent = `${symbols[convert]}${val1.toFixed(2)}`;
         currentBalance.textContent = `${symbols[convert]}${(val - val1).toFixed(2)}`;

         chart.data.labels = dates;
         chart.data.datasets[0].data = incomeData;
         chart.data.datasets[1].data = expenseData;
         chart.update();


    modal.style.display = "none";
}


render();

transactionForm.addEventListener('submit',(e)=>{
    e.preventDefault();

     if(description.value.trim() === "" || category.value.trim() === "") {
        alert("Please fill the details!")
        return;
     }

if(editingCard !== null){
    state.forEach((item)=>{
        if(item.id === editingCard){
            item.type = type.value;
            item.description = description.value;
            item.category = category.value;
            item.amount = amount.value;
        }
    })
    editingCard = null;
}
else{
    let data = {
    id:Date.now(),
    type:type.value,
    description:description.value,
    amount:amount.value,
    date:date.value,
    category:category.value
}

state.push(data);
}

saveData();
render();

description.value = "";
amount.value = "";
category.value = "";
})

render();

darkModeToggle.addEventListener('click',()=>{
    if(body.classList.contains("dark-mode")){
        body.classList.remove("dark-mode");
    }
    else{
        if(!body.classList.contains("dark-mode")){
            body.classList.add("dark-mode");
        }
    }
    render();
})

resetButton.addEventListener('click',()=>{
    let answer = confirm("Warning: This will delete your transaction data permanently!");
    if(answer){
        state = [];
        saveData();
        render();
    }
})

settingsNav.addEventListener('click',()=>{
    section1.style.display = "none";
    section2.style.display = "block";
    settingsNav.classList.add("active");
    dashboardNav.classList.remove("active");
    render();
})

dashboardNav.addEventListener('click',()=>{
    section1.style.display = "block";
    section2.style.display = "none";
    dashboardNav.classList.add("active");
    settingsNav.classList.remove("active");
    render();
});

saveChange.addEventListener('click',()=>{
    let val = profileName.value;
    if(profileName.value.trim() === ""){
        alert("Please fill out the details");
        return;
    }
    username.textContent = val;
    convert = currency.value;
    alert("Settings Changed Successfully!");
    saveData();
    render();
})

logout.addEventListener('click',()=>{
    window.location.href = "index.html";
})

search.addEventListener('input',()=>{
    render();
})

transactionFilter.addEventListener('change',()=>{
    newVal = transactionFilter.value;
    render();
})


function saveData(){
    localStorage.setItem("transactions", JSON.stringify(state));
}