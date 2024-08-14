const accounts = {
  "active" : ["CAJA","BANCOS","INVENTARIO INICIAL","INVENTARIO FINAL","COMPRAS", "GASTOS DE COMPRA", "DEVOLUCIONES SOBRE VENTA", "DESCUENTO SOBRE VENTA",
            "REBAJAS SOBRE VENTA","CLIENTES","DOCUMENTOS POR COBRAR","DEUDORES DIVERSOS","IVA ACREEDITABLE","TERRENOS","EDIFICIOS"
          ,"MOBILIARIO","EQ DE COMPUTO","EQ DE REPARTO","DEPOSITOS EN GARANT","ACCIONES Y VALORES"
          ,"GASTOS DE INSTALACIONS","PAPELERIA Y UTILES","PROPAGANDA Y PUBLICIDAD","PRIMAS DE SEGUROS","RENTAS PAGADAS POR ANTICIPADO"
          ,"INTERESES PAGADOS POR ANTICIPADO","SUELDOS DE AGENTES DE VENTAS","SUELDOS DEL PERSONAL DE OFICINA" ],
    "passive" : ["PROVEEDORES",  "VENTAS" ,"DOCUMENTOS POR PAGAR","ACREEDORES DIVERSOS", "DEVOLUCIONES SOBRE COMPRA" ,"DESCUENTO SOBRE COMPRA"
                ,"IVA POR PAGAR","ACREEDORES HIPOTECARIOS", "DOCUMENTOS POR PAGAR A LARGO PLAZO",
                "REBAJAS SOBRE COMPRA","HIPOTECAS POR PAGAR","DOCUMENTOS POR PAGAR(LARGO PLAZO)"
              ,"RENTAS COBRADAS POR ANTICIPADO","INTERESES COBRADOS POR ANTICIPADO","CAPITAL SOCIAL"],
}

let accountOrganizedActive = [];
let accountOrganizedPassive = [];

let sumAbonoTotal = 0;
let sumCargoTotal = 0;
let sumDeudorTotal = 0;
let sumAcreedorTotal = 0;


let liabilitiesTable = document.getElementById("liabilities-table"),
    assetsTable = document.getElementById("assets-table");

document.addEventListener('DOMContentLoaded', ()=>{
    axios.get("http://localhost:3000/api/getData")
         .then(response =>{
            let accounts = response.data;
            const summarizeAccount =  summarizeAccounts(accounts);
            addActiveAccount(summarizeAccount);
            addPassiveAccount(summarizeAccount);
         })
         .catch(e => console.error(e.message))
});


function addActiveAccount(accountsObject) {
  let sumActiveAbono = 0;
  let sumActiveCargo = 0;
  let sumActiveDeudor = 0;
  let sumActiveAcreedor = 0;

  for (let i = 0; i < accountOrganizedActive.length; i++) {
    const abono = accountsObject.active[i].amount.abono;
    const cargo = accountsObject.active[i].amount.cargo;
    const saldoDeudor = cargo - abono > 0 ? cargo - abono : 0;
    const saldoAcreedor = abono - cargo > 0 ? abono - cargo : 0;

    assetsTable.innerHTML += `
      <tr>
        <td class="td" id="td-1">${accountOrganizedActive[i]}</td>
        <td class="td" id="td-2">${cargo}</td>
        <td class="td" id="td-3">${abono}</td>
        <td class="td" id="td-4">${saldoDeudor}</td>
        <td class="td" id="td-5">${saldoAcreedor}</td>
      </tr>
    `;
    sumActiveCargo += cargo;
    sumActiveAbono += abono;
    sumActiveDeudor += saldoDeudor;
    sumActiveAcreedor += saldoAcreedor;
  }

  assetsTable.innerHTML += `
    <tr>
      <td class="td" id="td-1">SUMAS TOTALES</td>
      <td class="td" id="td-2">${sumActiveCargo}</td>
      <td class="td" id="td-3">${sumActiveAbono}</td>
      <td class="td" id="td-4">${sumActiveDeudor}</td>
      <td class="td" id="td-5">${sumActiveAcreedor}</td>
    </tr>
  `;
  sumAbonoTotal += sumActiveAbono;
  sumAcreedorTotal += sumActiveAcreedor;
  sumDeudorTotal += sumActiveDeudor;
  sumCargoTotal += sumActiveCargo;
}

function addPassiveAccount(accountsObject) {
  let sumPassiveAbono = 0;
  let sumPassiveCargo = 0;
  let sumPassiveDeudor = 0;
  let sumPassiveAcreedor = 0;

  for (let i = 0; i < accountOrganizedPassive.length; i++) {
    const abono = accountsObject.passive[i].amount.abono;
    const cargo = accountsObject.passive[i].amount.cargo;
    const saldoDeudor = cargo - abono > 0 ? cargo - abono : 0;
    const saldoAcreedor = abono - cargo > 0 ? abono - cargo : 0;

    liabilitiesTable.innerHTML += `
      <tr>
        <td class="td" id="td-6">${accountOrganizedPassive[i]}</td>
        <td class="td" id="td-7">${cargo}</td>
        <td class="td" id="td-8">${abono}</td>
        <td class="td" id="td-9">${saldoDeudor}</td>
        <td class="td" id="td-10">${saldoAcreedor}</td>
      </tr>
    `;
    sumPassiveCargo += cargo;
    sumPassiveAbono += abono;
    sumPassiveDeudor += saldoDeudor;
    sumPassiveAcreedor += saldoAcreedor;
  }
  sumAbonoTotal += sumPassiveAbono;
  sumAcreedorTotal += sumPassiveAcreedor;
  sumDeudorTotal += sumPassiveDeudor;
  sumCargoTotal += sumPassiveCargo;

  liabilitiesTable.innerHTML += `
    <tr>
      <td class="td" id="td-6">SUMAS TOTALES</td>
      <td class="td" id="td-7">${sumPassiveCargo}</td>
      <td class="td" id="td-8">${sumPassiveAbono}</td>
      <td class="td" id="td-9">${sumPassiveDeudor}</td>
      <td class="td" id="td-10">${sumPassiveAcreedor}</td>
    </tr>

    <tr>
    <td class="td" id="td-6">TOTAL</td>
    <td class="td" id="td-7">${sumCargoTotal}</td>
    <td class="td" id="td-8">${sumAbonoTotal}</td>
    <td class="td" id="td-9">${sumDeudorTotal}</td>
    <td class="td" id="td-10">${sumAcreedorTotal}</td>
  </tr>
  `;


}

function summarizeAccounts(accountsArray) {
  const summarizedAccounts = {};

  accountsArray.forEach((account) => {
    if (!summarizedAccounts[account.acount]) {
      summarizedAccounts[account.acount] = {
        cargo: 0,
        abono: 0,
      };
    }

    if (account.type === 'CARGO') {
      summarizedAccounts[account.acount].cargo += parseInt(account.amount);
    } else if (account.type === 'ABONO') {
      summarizedAccounts[account.acount].abono += parseInt(account.amount);
    }
  });

  return organizeAccounts(accounts,summarizedAccounts);
}

function organizeAccounts(accounts, accountsData) {
  const organizedAccounts = {
    active: {},
    passive: {},
  };
  let accountOrganizedActives = 0;
  let accountOrganizedPassives = 0;

  accounts.active.forEach((account) => {
    if (accountsData[account]) {
      organizedAccounts.active[accountOrganizedActives] = { amount: accountsData[account] };
      accountOrganizedActive.push([account]);
      accountOrganizedActives++;
    }
  });

  accounts.passive.forEach((account) => {
    if (accountsData[account]) {
      organizedAccounts.passive[accountOrganizedPassives] = { amount: accountsData[account] };
      accountOrganizedPassive.push([account]);
      accountOrganizedPassives++;
    }
  });

  return organizedAccounts;
};