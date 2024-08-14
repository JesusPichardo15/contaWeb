const ledgerTable = document.getElementById("ledgerTable");
const tableBody = document.getElementById("tableBody");


document.addEventListener('DOMContentLoaded', ()=>{
    axios.get("http://localhost:3000/api/getData")
         .then(response =>{
            let accounts = response.data;
            console.log(accounts);
            accounts.forEach(account => {
                loadDataDiaryBook(account);
            });
         })
         .catch(e => console.error(e.message))
});

function loadDataDiaryBook(account){
    if(account.type === "CARGO"){
        tableBody.innerHTML += `       
        <tr>
            <td>${account.numberActivity}</td>
            <td>${account.acount}</td>
            <td>$${account.amount}</td>
            <td></td>
        </tr>
    `
    }else {
        tableBody.innerHTML += `       
        <tr>
            <td>${account.numberActivity}</td>
            <td>${account.acount}</td>
            <td></td>
            <td>$${account.amount}</td>
        </tr>
        `
    }
}