const accounts = {
    "acirculante" : ["CAJA","BANCOS","INVENTARIO FINAL","CLIENTES","DOCUMENTOS POR COBRAR","DEUDORES DIVERSOS","IVA ACREEDITABLE"],
    "afijo" :["TERRENOS","EDIFICIOS"
    ,"MOBILIARIO Y EQUIPO","EQ DE COMPUTO","EQ DE REPARTO","DEPOSITOS EN GARANTIA","ACCIONES Y VALORES"],
    "adiferido" : ["GASTOS DE INSTALACIONS","PAPELERIA Y UTILES","PROPAGANDA Y PUBLICIDAD","PRIMAS DE SEGUROS","RENTAS PAGADAS POR ANTICIPADO"
    ,"INTERESES PAGADOS POR ANTICIPADO"],
    "pcirculante" : ["PROVEEDORES","DOCUMENTOS POR PAGAR","ACREEDORES DIVERSOS","IVA POR PAGAR"],
    "pfijo" : ["HIPOTECAS POR PAGAR","DOCUMENTOS POR PAGAR(LARGO PLAZO)"],
    "pdiferido" : ["RENTAS COBRADAS POR ANTICIPADO","INTERESES COBRADOS POR ANTICIPADO"],
    "capital" : ["CAPITAL SOCIAL", "UTILIDAD DEL EJERCICIO"]
}

let balanceSheetBodyTable = document.getElementById("balanceSheetBodyTable");

let accountOrganizedActiveciruclant = [];
let accountOrganizedPassiveFixed = [];
let accountOrganizedActiveDeferred = [];
let accountOrganizedPassiveCirculant = [];
let accountOrganizedActiveFixed = [];
let accountOrganizedPassiveDeferred = [];
let accountOrganizedcapital = [];

let totalActive = 0, totalPassive = 0;

document.addEventListener('DOMContentLoaded', ()=>{
    axios.get("http://localhost:3000/api/getData")
         .then(response =>{
            let accounts = response.data;
            const summarizeAccount =  summarizeAccounts(accounts);
            console.log(summarizeAccount);
            addActiveCirculantAccount(summarizeAccount)
            addActiveFixedtAccount(summarizeAccount);
            addActiveDeferredtAccount(summarizeAccount);

            addPassiveCirculantAccount(summarizeAccount);
            addPassiveFixedAccount(summarizeAccount);
            addPassiveDeferredAccount(summarizeAccount);
         })
         .catch(e => console.error(e.message))
});

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
      acirculante: {},
      afijo: {},
      adiferido: {},
      pcirculante: {},
      pfijo: {},
      pdiferido: {},
      capital : {},
    };
    let accountOrganizedActives = 0,accountOrganizedActivesF = 0,accountOrganizedActivesD = 0;
    let accountOrganizedPassives = 0,accountOrganizedPassivesF = 0,accountOrganizedPassivesD = 0,accountOrganizedPassivesC = 0;
  
    accounts.acirculante.forEach((account) => {
      if (accountsData[account]) {
        organizedAccounts.acirculante[accountOrganizedActives] = { amount: accountsData[account] };
        accountOrganizedActiveciruclant.push([account]);
        accountOrganizedActives++;
      }
    });

    accounts.afijo.forEach((account) => {
        if (accountsData[account]) {
          organizedAccounts.afijo[accountOrganizedActivesF] = { amount: accountsData[account] };
          accountOrganizedActiveFixed.push([account]);
          accountOrganizedActivesF++;
        }
    });
  
    accounts.adiferido.forEach((account) => {
        if (accountsData[account]) {
          organizedAccounts.adiferido[accountOrganizedActivesD] = { amount: accountsData[account] };
          accountOrganizedActiveDeferred.push([account]);
          accountOrganizedActivesD++;
        }
    });

    accounts.pcirculante.forEach((account) => {
      if (accountsData[account]) {
        organizedAccounts.pcirculante[accountOrganizedPassives] = { amount: accountsData[account] };
        accountOrganizedPassiveCirculant.push([account]);
        accountOrganizedPassives++;
      }
    });
    
    accounts.pfijo.forEach((account) => {
        if (accountsData[account]) {
          organizedAccounts.pfijo[accountOrganizedPassivesF] = { amount: accountsData[account] };
          accountOrganizedPassiveFixed.push([account]);
          accountOrganizedPassivesF++;
        }
      });
      
    accounts.pdiferido.forEach((account) => {
        if (accountsData[account]) {
          organizedAccounts.pdiferido[accountOrganizedPassivesD] = { amount: accountsData[account] };
          accountOrganizedPassiveDeferred.push([account]);
          accountOrganizedPassivesD++;
        }
    });
    accounts.capital.forEach((account) => {
        if (accountsData[account]) {
          organizedAccounts.capital[accountOrganizedPassivesC] = { amount: accountsData[account] };
          accountOrganizedcapital.push([account]);
          accountOrganizedPassivesC++;
        }
    });
    return organizedAccounts;
  };


function addActiveCirculantAccount (accountsObject){
    let sumActiveAbono = 0;
    let sumActiveCargo = 0;
    let sumActiveTotal = 0;
    balanceSheetBodyTable.innerHTML += `
    <tr>
        <td class="category">ACTIVOS</td>
        <td id="column1" class="subcategory"></td>
        <td id="column2" class="subcategory"></td>
        <td id="column3" class="subcategory"></td>
        <td class="total"></td>
    </tr>
    
    <tr id="activoCirculante">
    <td class="category">CIRCULANTES</td>
    <td id="column1" class="subcategory"></td>
    <td id="column2" class="subcategory"></td>
    <td id="column3" class="subcategory"></td>
    <td class="total"></td>
    </tr>
    `
        for(let i = 0; i < accountOrganizedActiveciruclant.length; i++){
        balanceSheetBodyTable.innerHTML += `
          <tr>
          <td class="category">${accountOrganizedActiveciruclant[i]}</td>
          <td id="column1" class="subcategory"></td>
          <td id="column2" class="subcategory">${parseInt(accountsObject.acirculante[i].amount.cargo) - parseInt(accountsObject.acirculante[i].amount.abono)}</td>
          <td id="column3" class="subcategory"></td>
          <td class="total"></td>
          </tr>
        `
      sumActiveAbono += accountsObject.acirculante[i].amount.abono;
      sumActiveCargo += accountsObject.acirculante[i].amount.cargo;
      sumActiveTotal += parseInt(accountsObject.acirculante[i].amount.cargo) - parseInt(accountsObject.acirculante[i].amount.abono);
    } 
    totalActive += sumActiveTotal;
    balanceSheetBodyTable.innerHTML += `
      <tr>
      <td class="category">TOTAL ACTIVO CIRCULANTE</td>
      <td id="column1" class="subcategory"></td>
      <td id="column2" class="subcategory"></td>
      <td id="column3" class="subcategory">${sumActiveTotal}</td>
      <td class="total"></td>
      </tr>
    `
};

function addActiveFixedtAccount(accountsObject){
    let sumActiveAbono = 0;
    let sumActiveCargo = 0;
    let sumActiveTotal = 0;
    balanceSheetBodyTable.innerHTML += `
    <tr id="activoCirculante">
    <td class="category">FIJOS</td>
    <td id="column1" class="subcategory"></td>
    <td id="column2" class="subcategory"></td>
    <td id="column3" class="subcategory"></td>
    <td class="total"></td>
    </tr>
    `
        for(let i = 0; i < accountOrganizedActiveFixed.length; i++){
        balanceSheetBodyTable.innerHTML += `
          <tr>
          <td class="category">${accountOrganizedActiveFixed[i]}</td>
          <td id="column1" class="subcategory"></td>
          <td id="column2" class="subcategory">${parseInt(accountsObject.afijo[i].amount.cargo) - parseInt(accountsObject.afijo[i].amount.abono)}</td>
          <td id="column3" class="subcategory"></td>
          <td class="total"></td>
          </tr>
        `
      sumActiveAbono += accountsObject.afijo[i].amount.abono;
      sumActiveCargo += accountsObject.afijo[i].amount.cargo;
      sumActiveTotal += parseInt(accountsObject.afijo[i].amount.cargo) - parseInt(accountsObject.afijo[i].amount.abono);
    } 
    totalActive += sumActiveTotal;
    balanceSheetBodyTable.innerHTML += `
      <tr>
      <td class="category">TOTAL ACTIVO FIJO</td>
      <td id="column1" class="subcategory"></td>
      <td id="column2" class="subcategory"></td>
      <td id="column3" class="subcategory">${sumActiveTotal}</td>
      <td class="total"></td>
      </tr>
    `
};

function addActiveDeferredtAccount(accountsObject){
    let sumActiveAbono = 0;
    let sumActiveCargo = 0;
    let sumActiveTotal = 0;
    balanceSheetBodyTable.innerHTML += `
    <tr id="activoCirculante">
    <td class="category">DIFERIDOS</td>
    <td id="column1" class="subcategory"></td>
    <td id="column2" class="subcategory"></td>
    <td id="column3" class="subcategory"></td>
    <td class="total"></td>
    </tr>
    `
        for(let i = 0; i < accountOrganizedActiveDeferred.length; i++){
        balanceSheetBodyTable.innerHTML += `
          <tr>
          <td class="category">${accountOrganizedActiveDeferred[i]}</td>
          <td id="column1" class="subcategory"></td>
          <td id="column2" class="subcategory">${parseInt(accountsObject.adiferido[i].amount.cargo) - parseInt(accountsObject.adiferido[i].amount.abono)}</td>
          <td id="column3" class="subcategory"></td>
          <td class="total"></td>
          </tr>
        `
      sumActiveAbono += accountsObject.adiferido[i].amount.abono;
      sumActiveCargo += accountsObject.adiferido[i].amount.cargo;
      sumActiveTotal += parseInt(accountsObject.adiferido[i].amount.cargo) - parseInt(accountsObject.adiferido[i].amount.abono);
    } 
    totalActive += sumActiveTotal;
    balanceSheetBodyTable.innerHTML += `
      <tr>
      <td class="category">TOTAL ACTIVO DIFERIDO</td>
      <td id="column1" class="subcategory"></td>
      <td id="column2" class="subcategory"></td>
      <td id="column3" class="subcategory">${sumActiveTotal}</td>
      <td class="total"></td>
      </tr>

      <tr>
      <td class="category">TOTAL ACTIVOS</td>
      <td id="column1" class="subcategory"></td>
      <td id="column2" class="subcategory"></td>
      <td id="column3" class="subcategory"></td>
      <td class="total">${totalActive}</td>
      </tr>
    `
};

function addPassiveCirculantAccount (accountsObject){
    let sumActiveAbono = 0;
    let sumActiveCargo = 0;
    let sumActiveTotal = 0;
    balanceSheetBodyTable.innerHTML += `
    <tr>
        <td class="category">PASIVOS</td>
        <td id="column1" class="subcategory"></td>
        <td id="column2" class="subcategory"></td>
        <td id="column3" class="subcategory"></td>
        <td class="total"></td>
    </tr>
    
    <tr id="activoCirculante">
    <td class="category">CIRCULANTES</td>
    <td id="column1" class="subcategory"></td>
    <td id="column2" class="subcategory"></td>
    <td id="column3" class="subcategory"></td>
    <td class="total"></td>
    </tr>
    `
        for(let i = 0; i < accountOrganizedPassiveCirculant.length; i++){
        balanceSheetBodyTable.innerHTML += `
          <tr>
          <td class="category">${accountOrganizedPassiveCirculant[i]}</td>
          <td id="column1" class="subcategory"></td>
          <td id="column2" class="subcategory">${parseInt(accountsObject.pcirculante[i].amount.cargo) - parseInt(accountsObject.pcirculante[i].amount.abono)}</td>
          <td id="column3" class="subcategory"></td>
          <td class="total"></td>
          </tr>
        `
      sumActiveAbono += accountsObject.pcirculante[i].amount.abono;
      sumActiveCargo += accountsObject.pcirculante[i].amount.cargo;
      sumActiveTotal += parseInt(accountsObject.pcirculante[i].amount.cargo) - parseInt(accountsObject.pcirculante[i].amount.abono);
    } 
    totalPassive += sumActiveTotal;
    balanceSheetBodyTable.innerHTML += `
      <tr>
      <td class="category">TOTAL PASIVO CIRCULANTE</td>
      <td id="column1" class="subcategory"></td>
      <td id="column2" class="subcategory"></td>
      <td id="column3" class="subcategory">${sumActiveTotal}</td>
      <td class="total"></td>
      </tr>
      
    `
};


function addPassiveFixedAccount (accountsObject){
    let sumActiveAbono = 0;
    let sumActiveCargo = 0;
    let sumActiveTotal = 0;
    balanceSheetBodyTable.innerHTML += `
    <tr id="activoCirculante">
    <td class="category">FIJOS</td>
    <td id="column1" class="subcategory"></td>
    <td id="column2" class="subcategory"></td>
    <td id="column3" class="subcategory"></td>
    <td class="total"></td>
    </tr>
    `
        for(let i = 0; i < accountOrganizedPassiveFixed.length; i++){
        balanceSheetBodyTable.innerHTML += `
          <tr>
          <td class="category">${accountOrganizedPassiveFixed[i]}</td>
          <td id="column1" class="subcategory"></td>
          <td id="column2" class="subcategory">${parseInt(accountsObject.pfijo[i].amount.cargo) - parseInt(accountsObject.pfijo[i].amount.abono)}</td>
          <td id="column3" class="subcategory"></td>
          <td class="total"></td>
          </tr>
        `
      sumActiveAbono += accountsObject.pfijo[i].amount.abono;
      sumActiveCargo += accountsObject.pfijo[i].amount.cargo;
      sumActiveTotal += parseInt(accountsObject.pfijo[i].amount.cargo) - parseInt(accountsObject.pfijo[i].amount.abono);
    } 
    totalPassive += sumActiveTotal;
    balanceSheetBodyTable.innerHTML += `
      <tr>
      <td class="category">TOTAL PASIVO FIJO</td>
      <td id="column1" class="subcategory"></td>
      <td id="column2" class="subcategory"></td>
      <td id="column3" class="subcategory">${sumActiveTotal}</td>
      <td class="total"></td>
      </tr>
    `
};


function addPassiveDeferredAccount (accountsObject){
    let sumActiveAbono = 0;
    let sumActiveCargo = 0;
    let sumActiveTotal = 0;
    balanceSheetBodyTable.innerHTML += `
    <tr id="activoCirculante">
    <td class="category">DIFERIDOS</td>
    <td id="column1" class="subcategory"></td>
    <td id="column2" class="subcategory"></td>
    <td id="column3" class="subcategory"></td>
    <td class="total"></td>
    </tr>
    `
        for(let i = 0; i < accountOrganizedPassiveDeferred.length; i++){
        balanceSheetBodyTable.innerHTML += `
          <tr>
          <td class="category">${accountOrganizedPassiveDeferred[i]}</td>
          <td id="column1" class="subcategory"></td>
          <td id="column2" class="subcategory">${parseInt(accountsObject.pdiferido[i].amount.cargo) - parseInt(accountsObject.pdiferido[i].amount.abono)}</td>
          <td id="column3" class="subcategory"></td>
          <td class="total"></td>
          </tr>
        `
      sumActiveAbono += accountsObject.pdiferido[i].amount.abono;
      sumActiveCargo += accountsObject.pdiferido[i].amount.cargo;
      sumActiveTotal += parseInt(accountsObject.pdiferido[i].amount.cargo) - parseInt(accountsObject.pdiferido[i].amount.abono);
    } 
    totalPassive += sumActiveTotal;
    balanceSheetBodyTable.innerHTML += `
      <tr>
      <td class="category">TOTAL PASIVO DIFERIDO</td>
      <td id="column1" class="subcategory"></td>
      <td id="column2" class="subcategory"></td>
      <td id="column3" class="subcategory">${sumActiveTotal}</td>
      <td class="total"></td>
      </tr>

      <tr>
      <td class="category">TOTAL PASIVOS</td>
      <td id="column1" class="subcategory"></td>
      <td id="column2" class="subcategory"></td>
      <td id="column3" class="subcategory"></td>
      <td class="total">${totalPassive}</td>
      </tr>

      <tr>
      <td class="category">CAPITAL CONTABLE</td>
      <td id="column1" class="subcategory"></td>
      <td id="column2" class="subcategory"></td>
      <td id="column3" class="subcategory"></td>
      <td class="total">${totalActive+totalPassive}</td>
      </tr>

      <tr>
      <td class="category">CAPITAL SOCIAL</td>
      <td id="column1" class="subcategory"></td>
      <td id="column2" class="subcategory"></td>
      <td id="column3" class="subcategory">${-(parseInt(accountsObject.capital[0].amount.cargo) - parseInt(accountsObject.capital[0].amount.abono))}</td>
      <td class="total"></td>
      </tr>

      <tr>
      <td class="category">UTILIDAD DEL EJERCICIO</td>
      <td id="column1" class="subcategory"></td>
      <td id="column2" class="subcategory"></td>
      <td id="column3" class="subcategory">${(parseInt(accountsObject.capital[1].amount.cargo) - parseInt(accountsObject.capital[1].amount.abono))}</td>
      <td class="total">${-((parseInt(accountsObject.capital[0].amount.cargo) - parseInt(accountsObject.capital[0].amount.abono)) + (parseInt(accountsObject.capital[1].amount.cargo) - parseInt(accountsObject.capital[1].amount.abono))) }</td>
      </tr>

      <tr>
      <td class="category">PASIVO + CAPITAL</td>
      <td id="column1" class="subcategory"></td>
      <td id="column2" class="subcategory"></td>
      <td id="column3" class="subcategory"></td>
      <td class="total">${totalActive-totalPassive + totalPassive}</td>
      </tr>
    `
}