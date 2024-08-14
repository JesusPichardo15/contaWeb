// cuentas
export const accounts = {
    "active" : ["CAJA","BANCOS","INVENTARIO INICIAL","INVENTARIO FINAL","COMPRAS", "GASTOS DE COMPRA", "DEVOLUCIONES SOBRE VENTA", "DESCUENTO SOBRE VENTA",
                "REBAJAS SOBRE VENTA","CLIENTES","DOCUMENTOS POR COBRAR","DEUDORES DIVERSOS","IVA ACREEDITABLE","TERRENOS","EDIFICIOS"
              ,"MOBILIARIO Y EQUIPO","EQ DE COMPUTO","EQ DE REPARTO","DEPOSITOS EN GARANT","ACCIONES Y VALORES"
              ,"GASTOS DE INSTALACIONS","PAPELERIA Y UTILES","PROPAGANDA Y PUBLICIDAD","PRIMAS DE SEGUROS","RENTAS PAGADAS POR ANTICIPADO"
              ,"INTERESES PAGADOS POR ANTICIPADO"],
  "passive" : ["PROVEEDORES",  "VENTAS" ,"DOCUMENTOS POR PAGAR","ACREEDORES DIVERSOS", "DEVOLUCIONES SOBRE COMPRA" ,"DESCUENTO SOBRE COMPRA"
              ,"IVA POR PAGAR","ACREEDORES HIPOTECARIOS", "DOCUMENTOS POR PAGAR A LARGO PLAZO",
              "REBAJAS SOBRE COMPRA","HIPOTECAS POR PAGAR","DOCUMENTOS POR PAGAR(LARGO PLAZO)"
            ,"RENTAS COBRADAS POR ANTICIPADO","INTERESES COBRADOS POR ANTICIPADO"],
  "capital" : ["CAPITAL SOCIAL"],
  "expenses" : ["RENTA DEL ALMACEN" ,"PROPAGANDA" ,"SUELDOS DE AGENTES DE VENTAS", "COMISIONES DE AGENTES DE VENTAS" ,"CONSUMO DE LUZ DEL ALMACEN",
              "RENTA DE LAS OFICINAS" ,"SUELDOS DEL PERSONAL DE OFICINA" ,"PAPELERIA Y UTILES", "CONSUMO DE LUZ DE LAS OFICINAS", "INTERESES A NUESTRO FAVOR",
              "INTERESES A NUESTRO CARGO", "PERDIDA EN VENTAS MOBILIARIAS", "COMISIONES COBRADAS"
 ]
}
//buttons
//sectionActionMenu Button
const activeAcountButton = document.getElementById("active"),
passiveAcountButton = document.getElementById("passive"),
capitalAcountButton = document.getElementById("capital"),
expensesAcountButton = document.getElementById("expenses");

//sectionActionConta Button
const diaryBookButton = document.getElementById("diaryBook"),
tAcountsButton = document.getElementById("tAcounts"),
comparativeBalanceSheetButton = document.getElementById("comparativeBalanceSheet"),
incomeStatementButton = document.getElementById("incomeStatement"),
balanceSheetButton = document.getElementById("balanceSheet");

//saveDataButton and send data
const saveDataButton = document.getElementById("buttonSaveData");
const cleanDataButton = document.getElementById("buttonCleanData");
//end button

//inputs
let activityNumberInput = document.getElementById("ActivityNumber"),
accountInput = document.getElementById("inputAccount"),
amountInput = document.getElementById("inputAmount"),
chargeRadio = document.getElementById("chCharge"),
feeRadio = document.getElementById("chFee");
//end inputs

//label
let accountSelectionLabel = document.getElementById("labelAcountSelection"),
annuncementLabel = document.getElementById("annuncementLabel");
//end label


//eventos para los botones del menuSection
activeAcountButton.addEventListener("click", ()=>{showAccounts(accounts.active,'A')});
passiveAcountButton.addEventListener("click", ()=>{showAccounts(accounts.passive,'P')});
capitalAcountButton.addEventListener("click", ()=>{showAccounts(accounts.capital,'C')});
expensesAcountButton.addEventListener("click", ()=>{showAccounts(accounts.expenses,'E')});

//eventos para los botones del contSeccion-action
diaryBookButton.addEventListener("click", ()=>{window.location.href = "diaryBook.html"});
tAcountsButton.addEventListener("click", () =>{window.location.href = "tAcounts.html"});
comparativeBalanceSheetButton.addEventListener('click', ()=>{window.location.href = "trialBalance.html"});
incomeStatementButton.addEventListener('click', ()=>{window.location.href = "incomeStatment.html"});
balanceSheetButton.addEventListener('click', ()=>{window.location.href = "balancesheet.html"});


//eventos para los botones de enteringData
saveDataButton.addEventListener("click",async ()=>{
    let values = getDataInputs();
    await axios({
        method: "post",
        url: "http://localhost:3000/api/sendData",
        data: {
          user: `Jesus`,
          numberActivity : values[0], 
          acount : values[1], 
          type : values[2], 
          amount : values[3]
        }
      }).then(response => {
        if (response.data) console.log('se agregaron los datos correctamente');
        else console.log("hubo un error")
        
      }).catch(error => {
        console.log(error);
    })
})

cleanDataButton.addEventListener("click", async()=>{
    let res = confirm("Estas seguro de eliminar la informacion guardada?");
    if(res){
        await axios.delete("http://localhost:3000/api/cleanData")
        .then(response =>{
            if(response.data) console.log("los datos se borraron correctamente");
        })
        .catch(e=> console.log(e.message));
    }
});
//end

function showAccounts(typeAccountSelected,type){
    accountSelectionLabel.textContent = "";
    for(let i = 0; i < typeAccountSelected.length; i++){
        accountSelectionLabel.innerHTML += `<label id="labelAcountSelectionMod">${type}${i+1}.- ${typeAccountSelected[i].toUpperCase()}</label><br>`;
    }
}

function getDataInputs(){
    //toma el value de los inputs y los almacena en las variables
    let activityNumberValue = activityNumberInput.value,
    accountInputValue = accountInput.value.toUpperCase(),
    amountInputValue = amountInput.value,
    values = [activityNumberValue,accountInputValue,undefined,amountInputValue];
    if(chargeRadio.checked === true) values[2] = ("CARGO");
    else if(feeRadio.checked === true) values[2] = ("ABONO");
    ereaserInputs()
    return values;
}

function ereaserInputs(){
    //borra el value de los inputs
    activityNumberInput.value = "";
    accountInput.value = "";
    amountInput.value = "";
}

function detectAccountType(accountName) {
    for (const type in accounts) {
      if (accounts[type].includes(accountName)) {
        return type;
      }
    }
    return null; // si no se encuentra el tipo de cuenta
  }