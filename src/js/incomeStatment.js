const accounts = {
    "ventas" :         ["VENTAS","DEVOLUCIONES SOBRE VENTA","REBAJAS SOBRE VENTA", "DESCUENTO SOBRE VENTA"],
    "comprasNetas" :   ["INVENTARIO INICIAL","COMPRAS","GASTOS DE COMPRA"],
    "comprasTotales" : ["DEVOLUCIONES SOBRE COMPRA" ,"DESCUENTO SOBRE COMPRA"
                       ,"REBAJAS SOBRE COMPRA"],
    "totalMercancia" : ["INVENTARIO FINAL"],
    "gastoVenta" :     ["RENTA DEL ALMACEN" ,"PROPAGANDA" ,"SUELDOS DE AGENTES DE VENTAS", 
                        "COMISIONES DE AGENTES DE VENTAS" ,"CONSUMO DE LUZ DEL ALMACEN"],
    "gastoAdmin" :     ["RENTA DE LAS OFICINAS" ,"SUELDOS DEL PERSONAL DE OFICINA" ,"PAPELERIA Y UTILES", 
                        "CONSUMO DE LUZ DE LAS OFICINAS",],
    "prodFin" :        ["INTERESES A NUESTRO FAVOR"],
    "gasFin" :         [ "INTERESES A NUESTRO CARGO"],
    "otroGas" :        ["PERDIDA EN VENTAS MOBILIARIAS"],
    "otroPro" :        [                "COMISIONES COBRADAS"]
}

let resultTableBody = document.getElementById('resultTableBody'),
sendUOPEjercicio = document.getElementById("sendUOPEjercicio");

let type = "";


let utilidadBruta = 0;
let utilidadDeOperacion =0;
let utilidadEjercicio = 0;

let accountOrganizedSale = [],
accountOrganizeComprasN = [],
accountOrganizeComprasT = [],
accountOrganizeMercanciaT= [],
accountOrganizedGastoVen = [],
accountOrganizedGastoAd= [],
accountOrganizedProdF = [],
accountOrganizedGasF = [],
accountOrganizedOtroG = [],
accountOrganizedOtroP = [];

document.addEventListener('DOMContentLoaded', ()=>{
    axios.get("http://localhost:3000/api/getData")
         .then(response =>{
            let accounts = response.data;
            const summarizeAccount = summarizeAccounts(accounts);
            console.log(summarizeAccount);
            addSale(summarizeAccount);
            addCompras(summarizeAccount);
            addGastosOperacion(summarizeAccount);
         })
         .catch(e => console.error(e.message))
})

let sumVentasNetas = 0;

sendUOPEjercicio.addEventListener("click",async ()=>{

  axios.delete("http://localhost:3000/api/cleanUt")
    .then(response =>{
      if(response.data) console.log("la utlidad se borro con exito");
    }).catch(error=>{
      console.log(error);
    })
  

  await axios({
      method: "post",
      url: "http://localhost:3000/api/sendData",
      data: {
        user: `Jesus`,
        numberActivity : 1, 
        acount : "UTILIDAD DEL EJERCICIO", 
        type : type, 
        amount : utilidadEjercicio
      }
    }).then(response => {
      if (response.data) console.log('se agregaron los datos correctamente');
      else console.log("hubo un error")
      
    }).catch(error => {
      console.log(error);
  })
})



function addSale(accountsObject){
  let suma = 0;
  for(let i = 0; i< accountOrganizedSale.length; i++){
    if(accountOrganizedSale[i] == "VENTAS"){
      resultTableBody.innerHTML += `
      <tr>
      <td class="category">${accountOrganizedSale[i]}</td>
      <td id="column1" class="subcategory"></td>
      <td id="column2" class="subcategory"></td>
      <td id="column3" class="subcategory">${parseInt(accountsObject.ventas[i].amount.cargo) + parseInt(accountsObject.ventas[i].amount.abono)}</td>
      <td class="total"></td>
      </tr>`
    }else if(accountOrganizedSale[i] == "DEVOLUCIONES SOBRE VENTA" || accountOrganizedSale[i] ==  "REBAJAS SOBRE VENTA"|| accountOrganizedSale[i] ==  "DESCUENTO SOBRE VENTA"){
      suma += (parseInt(accountsObject.ventas[i].amount.cargo) - parseInt(accountsObject.ventas[i].amount.abono))
      if(i == accountOrganizedSale.length-1){
        resultTableBody.innerHTML += `
          <tr>
          <td class="category">${accountOrganizedSale[i]}</td>
          <td id="column1" class="subcategory"></td>
          <td id="column2" class="subcategory">${parseInt(accountsObject.ventas[i].amount.cargo) + parseInt(accountsObject.ventas[i].amount.abono)}</td>
          <td id="column3" class="subcategory">${suma}</td>
          <td class="total"></td>
          </tr>
        `
      }else{

        resultTableBody.innerHTML += `
        <tr>
        <td class="category">${accountOrganizedSale[i]}</td>
        <td id="column1" class="subcategory"></td>
        <td id="column2" class="subcategory">${parseInt(accountsObject.ventas[i].amount.cargo) + parseInt(accountsObject.ventas[i].amount.abono)}</td>
        <td id="column3" class="subcategory"></td>
        <td class="total"></td>
        </tr>
      `
      }
    }
  }
    sumVentasNetas = parseInt(accountsObject.ventas[0].amount.cargo) - parseInt(accountsObject.ventas[0].amount.abono) + suma;
    resultTableBody.innerHTML += `
        <tr>
        <td class="category">VENTAS NETAS</td>
        <td id="column1" class="subcategory"></td>
        <td id="column2" class="subcategory"></td>
        <td id="column3" class="subcategory"></td>
        <td class="total">${-sumVentasNetas}</td>
        </tr>
    `
};

function addCompras(accountsObject){

  let suma = 0
  , sumaComprasTotales =0 
  , sumaComprasNetas = 0
  , sumaTotalMercancia =0 ;
  let inventarioInicial = 0;
  let inventarioFinal = 0;
  if(accountOrganizeComprasN.lengt !== 0){
    for(let i = 0; i < accountOrganizeComprasN.length; i++){

      if(accountOrganizeComprasN[i] == "INVENTARIO INICIAL"){
        inventarioInicial =(parseInt(accountsObject.comprasNetas[i].amount.cargo) - parseInt(accountsObject.comprasNetas[i].amount.abono))
        resultTableBody.innerHTML += `
        <tr>
        <td class="category">${accountOrganizeComprasN[i]}</td>
        <td id="column1" class="subcategory"></td>
        <td id="column2" class="subcategory"></td>
        <td id="column3" class="subcategory">${inventarioInicial}</td>
        <td class="total"></td>
        </tr>
        `
      }
      if(accountOrganizeComprasN[i] == "COMPRAS"||accountOrganizeComprasN[i] == "GASTOS DE COMPRA"){
          resultTableBody.innerHTML += `
          <tr>
          <td class="category">${accountOrganizeComprasN[i]}</td>
          <td id="column1" class="subcategory">${(parseInt(accountsObject.comprasNetas[i].amount.cargo) - parseInt(accountsObject.comprasNetas[i].amount.abono))}</td>
          <td id="column2" class="subcategory"></td>
          <td id="column3" class="subcategory"></td>
          <td class="total"></td>
          </tr>
          `
          sumaComprasTotales += (parseInt(accountsObject.comprasNetas[i].amount.cargo) - parseInt(accountsObject.comprasNetas[i].amount.abono));
      }
    }
    resultTableBody.innerHTML += `
    <tr>
    <td class="category">COMPRAS TOTALES</td>
    <td id="column1" class="subcategory"></td>
    <td id="column2" class="subcategory">${sumaComprasTotales}</td>
    <td id="column3" class="subcategory"></td>
    <td class="total"></td>
    </tr>`
  }
  sumaTotalMercancia = sumaComprasTotales + sumaComprasNetas+ inventarioInicial;
  if(accountOrganizeComprasT.length !== 0){
    for(let i = 0; i < accountOrganizeComprasT.length; i++){
      sumaComprasNetas += parseInt(accountsObject.comprasTotales[i].amount.cargo) - parseInt(accountsObject.comprasTotales[i].amount.abono);

      if(i == accountOrganizeComprasT.length-1){
        sumaTotalMercancia = sumaComprasTotales + sumaComprasNetas+ inventarioInicial;
        resultTableBody.innerHTML += `
        <tr>
        <td class="category">${accountOrganizeComprasT[i]}</td>
        <td id="column1" class="subcategory">${-(parseInt(accountsObject.comprasTotales[i].amount.cargo) - parseInt(accountsObject.comprasTotales[i].amount.abono))}</td>
        <td id="column2" class="subcategory">${-sumaComprasNetas}</td>
        <td id="column3" class="subcategory"></td>
        <td class="total"></td>
        </tr>

        <tr>
        <td class="category">COMPRAS NETAS</td>
        <td id="column1" class="subcategory"></td>
        <td id="column2" class="subcategory"></td>
        <td id="column3" class="subcategory">${sumaComprasTotales + sumaComprasNetas}</td>
        <td class="total"></td>
        </tr>

        
      <tr>
      <td class="category">MERCANCIA TOTAL</td>
      <td id="column1" class="subcategory"></td>
      <td id="column2" class="subcategory"></td>
      <td id="column3" class="subcategory">${sumaComprasTotales + sumaComprasNetas+ inventarioInicial}</td>
      <td class="total"></td>
      </tr>

        `

      }else{
        resultTableBody.innerHTML += `
        <tr>
        <td class="category">${accountOrganizeComprasT[i]}</td>
        <td id="column1" class="subcategory">${-(parseInt(accountsObject.comprasTotales[i].amount.cargo) - parseInt(accountsObject.comprasTotales[i].amount.abono))}</td>
        <td id="column2" class="subcategory"></td>
        <td id="column3" class="subcategory"></td>
        <td class="total"></td>
        </tr>`
        sumaTotalMercancia = sumaComprasTotales + sumaComprasNetas + inventarioFinal;
      }

     
    }
  }

  if(accountOrganizeMercanciaT.length !== 0){
    inventarioFinal = parseInt(accountsObject.totalMercancia[0].amount.cargo);
    resultTableBody.innerHTML += `
    <tr>
    <td class="category">${accountOrganizeMercanciaT[0]}</td>
    <td id="column1" class="subcategory"></td>
    <td id="column2" class="subcategory"></td>
    <td id="column3" class="subcategory">${inventarioFinal}</td>
    <td class="total"></td>
    </tr>
    
    <tr>
    <td class="category">COSTO DE LO VENDIDO</td>
    <td id="column1" class="subcategory"></td>
    <td id="column2" class="subcategory"></td>
    <td id="column3" class="subcategory"></td>
    <td class="total">${sumaTotalMercancia - parseInt(accountsObject.totalMercancia[0].amount.cargo)}</td>
    </tr>

    `
  }else{
    resultTableBody.innerHTML += `    
    <tr>
    <td class="category">COSTO DE LO VENDIDO</td>
    <td id="column1" class="subcategory"></td>
    <td id="column2" class="subcategory"></td>
    <td id="column3" class="subcategory"></td>
    <td class="total">${sumaTotalMercancia}</td>
    </tr>

    `
  }
  utilidadBruta = -((sumaTotalMercancia - inventarioFinal) + sumVentasNetas );
  if(utilidadBruta >= 0){
    resultTableBody.innerHTML += `
      <tr>
      <td class="category">UTILIDAD BRUTA</td>
      <td id="column1" class="subcategory"></td>
      <td id="column2" class="subcategory"></td>
      <td id="column3" class="subcategory"></td>
      <td class="total">${utilidadBruta}</td>
      </tr>
    `
  } else{
    resultTableBody.innerHTML += `
      <tr>
      <td class="category">PERDIDA BRUTA</td>
      <td id="column1" class="subcategory"></td>
      <td id="column2" class="subcategory"></td>
      <td id="column3" class="subcategory"></td>
      <td class="total">${ -utilidadBruta}</td>
      </tr>
    `
  }
}

function addGastosOperacion(accountsObject){
  let sumActiveTotal = 0;
  let sumaGastosOperacion = 0;
  resultTableBody.innerHTML += `
    <tr>
    <td class="category">GASTOS DE OPERACION</td>
    <td id="column1" class="subcategory"></td>
    <td id="column2" class="subcategory"></td>
    <td id="column3" class="subcategory"></td>
    <td class="total"></td>
    </tr>

    <tr>
    <td class="category">GASTOS DE VENTAS</td>
    <td id="column1" class="subcategory"></td>
    <td id="column2" class="subcategory"></td>
    <td id="column3" class="subcategory"></td>
    <td class="total"></td>
    </tr>
  `
    for(let i = 0; i < accountOrganizedGastoVen.length; i++){
      sumActiveTotal += parseInt(accountsObject.gastoVenta[i].amount.cargo) - parseInt(accountsObject.gastoVenta[i].amount.abono);
      sumaGastosOperacion += sumActiveTotal;
      if(i === accountOrganizedGastoVen.length-1){
        resultTableBody.innerHTML += `
          <tr>
          <td class="category">${accountOrganizedGastoVen[i]}</td>
          <td id="column1" class="subcategory">${parseInt(accountsObject.gastoVenta[i].amount.cargo) - parseInt(accountsObject.gastoVenta[i].amount.abono)}</td>
          <td id="column2" class="subcategory">${sumActiveTotal}</td>
          <td id="column3" class="subcategory"></td>
          <td class="total"></td>
          </tr>
        `
      }else {
        resultTableBody.innerHTML += `
        <tr>
        <td class="category">${accountOrganizedGastoVen[i]}</td>
        <td id="column1" class="subcategory">${parseInt(accountsObject.gastoVenta[i].amount.cargo) - parseInt(accountsObject.gastoVenta[i].amount.abono)}</td>
        <td id="column2" class="subcategory"></td>
        <td id="column3" class="subcategory"></td>
        <td class="total"></td>
        </tr>
      `
      }

      
    
  } 
  resultTableBody.innerHTML += `
    <tr>
    <td class="category">GASTOS DE ADMINISTRACION</td>
    <td id="column1" class="subcategory"></td>
    <td id="column2" class="subcategory"></td>
    <td id="column3" class="subcategory"></td>
    <td class="total"></td>
    </tr>
  `
  sumActiveTotal=0;
  for(let i = 0; i < accountOrganizedGastoAd.length; i++){
    sumActiveTotal += parseInt(accountsObject.gastoAdmin[i].amount.cargo) - parseInt(accountsObject.gastoAdmin[i].amount.abono);
    sumaGastosOperacion += sumActiveTotal;
    if(i === accountOrganizedGastoAd.length-1){
      resultTableBody.innerHTML += `
        <tr>
        <td class="category">${accountOrganizedGastoAd[i]}</td>
        <td id="column1" class="subcategory">${parseInt(accountsObject.gastoAdmin[i].amount.cargo) - parseInt(accountsObject.gastoAdmin[i].amount.abono)}</td>
        <td id="column2" class="subcategory">${sumActiveTotal}</td>
        <td id="column3" class="subcategory">${sumaGastosOperacion}</td>
        <td class="total"></td>
        </tr>
      `
    }else {
      resultTableBody.innerHTML += `
      <tr>
      <td class="category">${accountOrganizedGastoAd[i]}</td>
      <td id="column1" class="subcategory">${parseInt(accountsObject.gastoAdmin[i].amount.cargo) - parseInt(accountsObject.gastoAdmin[i].amount.abono)}</td>
      <td id="column2" class="subcategory"></td>
      <td id="column3" class="subcategory"></td>
      <td class="total"></td>
      </tr>
    `;
    } 
  } 

  if(accountOrganizedProdF.length !== 0){
    resultTableBody.innerHTML += `
    <tr>
    <td class="category">PRODUCTOS FINANCIEROS</td>
    <td id="column1" class="subcategory"></td>
    <td id="column2" class="subcategory"></td>
    <td id="column3" class="subcategory"></td>
    <td class="total"></td>
    </tr>

    <tr>
    <td class="category">${accountOrganizedProdF[0]}</td>
    <td id="column1" class="subcategory">${parseInt(accountsObject.prodFin[0].amount.cargo) - parseInt(accountsObject.prodFin[0].amount.abono)}</td>
    <td id="column2" class="subcategory"></td>
    <td id="column3" class="subcategory"></td>
    <td class="total"></td>
    </tr>
  `
  }

  let sumaGasProdFinan = 0;
  if(accountOrganizedGasF.length !== 0){
    sumaGasProdFinan = (parseInt(accountsObject.prodFin[0].amount.cargo) - parseInt(accountsObject.prodFin[0].amount.abono))+(parseInt(accountsObject.gasFin[0].amount.cargo) - parseInt(accountsObject.gasFin[0].amount.abono));

    resultTableBody.innerHTML += `
    <tr>
    <td class="category">GASTOS FINANCIEROS</td>
    <td id="column1" class="subcategory"></td>
    <td id="column2" class="subcategory"></td>
    <td id="column3" class="subcategory"></td>
    <td class="total"></td>
    </tr>

    <tr>
    <td class="category">${accountOrganizedGasF[0]}</td>
    <td id="column1" class="subcategory"></td>
    <td id="column2" class="subcategory">${parseInt(accountsObject.gasFin[0].amount.cargo) - parseInt(accountsObject.gasFin[0].amount.abono)}</td>
    <td id="column3" class="subcategory">${sumaGasProdFinan}</td>
    <td class="total">${sumaGastosOperacion - sumaGasProdFinan}</td>
    </tr>
  `
  }else{
  resultTableBody.innerHTML += `
    <tr>
    <td class="category">GASTOS FINANCIEROS</td>
    <td id="column1" class="subcategory"></td>
    <td id="column2" class="subcategory"></td>
    <td id="column3" class="subcategory"></td>
    <td class="total">${sumaGastosOperacion}</td>
    </tr>
  `;
  }
  let totalGastos = sumaGastosOperacion - sumaGasProdFinan;
  utilidadDeOperacion = utilidadBruta - totalGastos;
  if(sumaGastosOperacion > sumaGasProdFinan){
    resultTableBody.innerHTML += `
    <tr>
    <td class="category">UTILIDAD DE OPERACION</td>
    <td id="column1" class="subcategory"></td>
    <td id="column2" class="subcategory"></td>
    <td id="column3" class="subcategory"></td>
    <td class="total">${utilidadDeOperacion}</td>
    </tr>
  `;
  }


;
  let sumaOtrosGP = 0;

  if(accountOrganizedOtroG.length !== 0){
    for(let i = 0; i < accountOrganizedOtroG.length; i++){
      resultTableBody.innerHTML += `
      <tr>
      <td class="category">OTROS GASTOS</td>
      <td id="column1" class="subcategory"></td>
      <td id="column2" class="subcategory"></td>
      <td id="column3" class="subcategory"></td>
      <td class="total"></td>
      </tr>
  
      <tr>
      <td class="category">${accountOrganizedOtroG[i]}</td>
      <td id="column1" class="subcategory"></td>
      <td id="column2" class="subcategory"></td>
      <td id="column3" class="subcategory">${parseInt(accountsObject.otroGas[i].amount.cargo)}</td>
      <td class="total"></td>
      </tr>
    `;
    sumaOtrosGP +=parseInt(accountsObject.otroGas[i].amount.cargo);
    }
    

   
  }

  if(accountOrganizedOtroP.length !== 0){

    for(let i = 0; i < accountOrganizedOtroP.length; i++){
      sumaOtrosGP += parseInt(accountsObject.otroPro[i].amount.cargo - accountsObject.otroPro[i].amount.abono);
      resultTableBody.innerHTML += `
      <tr>
      <td class="category">OTROS PRODUCTOS</td>
      <td id="column1" class="subcategory"></td>
      <td id="column2" class="subcategory"></td>
      <td id="column3" class="subcategory"></td>
      <td class="total"></td>
      </tr>
  
      <tr>
      <td class="category">${accountOrganizedOtroP[i]}</td>
      <td id="column1" class="subcategory"></td>
      <td id="column2" class="subcategory"></td>
      <td id="column3" class="subcategory">${parseInt(accountsObject.otroPro[i].amount.cargo) - parseInt(accountsObject.otroPro[i].amount.abono)}</td>
      <td class="total">${sumaOtrosGP}</td>
      </tr>
    `;
    }

  }
  utilidadEjercicio = utilidadDeOperacion - sumaOtrosGP;
  if(utilidadEjercicio > 0 ){
    type = "CARGO"
    resultTableBody.innerHTML += `
    <tr>
    <td class="category">UTILIDAD DEL EJERCICIO</td>
    <td id="column1" class="subcategory"></td>
    <td id="column2" class="subcategory"></td>
    <td id="column3" class="subcategory"></td>
    <td class="total">${utilidadEjercicio}</td>
    </tr>`;
  }else{
    type = "ABONO"
    resultTableBody.innerHTML += `
    <tr>
    <td class="category">PERDIDA DEL EJERCICIO</td>
    <td id="column1" class="subcategory"></td>
    <td id="column2" class="subcategory"></td>
    <td id="column3" class="subcategory"></td>
    <td class="total">${utilidadEjercicio}</td>
    </tr>`;
  }



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
      "ventas" :         {},
      "comprasNetas" :   {},
      "comprasTotales" : {},
      "totalMercancia" : {},
      "gastoVenta" :     {},
      "gastoAdmin" :     {},
      "prodFin" :        {},
      "gasFin" :         {},
      "otroGas" :        {},
      "otroPro" :        {}
    };
    let accountOrganizedSaleN = 0,
    accountOrganizeComprasNN = 0,
    accountOrganizeComprasTN = 0,
    accountOrganizeMercanciaTN= 0,
    accountOrganizedGastoVenN = 0,
    accountOrganizedGastoAdN= 0,
    accountOrganizedProdFN = 0,
    accountOrganizedGasFN = 0,
    accountOrganizedOtroGN = 0,
    accountOrganizedOtroPN = 0;
  
    accounts.ventas.forEach((account) => {
      if (accountsData[account]) {
        organizedAccounts.ventas[accountOrganizedSaleN] = { amount: accountsData[account] };
        accountOrganizedSale.push([account]);
        accountOrganizedSaleN++;
      }
    });
  
    accounts.comprasNetas.forEach((account) => {
      if (accountsData[account]) {
        organizedAccounts.comprasNetas[accountOrganizeComprasNN] = { amount: accountsData[account] };
        accountOrganizeComprasN.push([account]);
        accountOrganizeComprasNN++;
      }
    });
    accounts.comprasTotales.forEach((account) => {
        if (accountsData[account]) {
          organizedAccounts.comprasTotales[accountOrganizeComprasTN] = { amount: accountsData[account] };
          accountOrganizeComprasT.push([account]);
          accountOrganizeComprasTN++;
        }
      });

      accounts.totalMercancia.forEach((account) => {
        if (accountsData[account]) {
          organizedAccounts.totalMercancia[accountOrganizeMercanciaTN] = { amount: accountsData[account] };
          accountOrganizeMercanciaT.push([account]);
          accountOrganizeMercanciaTN++;
        }
      });

      accounts.gastoVenta.forEach((account) => {
        if (accountsData[account]) {
          organizedAccounts.gastoVenta[accountOrganizedGastoVenN] = { amount: accountsData[account] };
          accountOrganizedGastoVen.push([account]);
          accountOrganizedGastoVenN++;
        }
      });

      accounts.gastoAdmin.forEach((account) => {
        if (accountsData[account]) {
          organizedAccounts.gastoAdmin[accountOrganizedGastoAdN] = { amount: accountsData[account] };
          accountOrganizedGastoAd.push([account]);
          accountOrganizedGastoAdN++;
        }
      });

      accounts.prodFin.forEach((account) => {
        if (accountsData[account]) {
          organizedAccounts.prodFin[accountOrganizedProdFN] = { amount: accountsData[account] };
          accountOrganizedProdF.push([account]);
          accountOrganizedProdFN++;
        }
      });

      accounts.gasFin.forEach((account) => {
        if (accountsData[account]) {
          organizedAccounts.gasFin[accountOrganizedGasFN] = { amount: accountsData[account] };
          accountOrganizedGasF.push([account]);
          accountOrganizedGasFN++;
        }
      });

      accounts.otroGas.forEach((account) => {
        if (accountsData[account]) {
          organizedAccounts.otroGas[accountOrganizedOtroGN] = { amount: accountsData[account] };
          accountOrganizedOtroG.push([account]);
          accountOrganizedOtroGN++;
        }
      });

      accounts.otroPro.forEach((account) => {
        if (accountsData[account]) {
          organizedAccounts.otroPro[accountOrganizedOtroPN] = { amount: accountsData[account] };
          accountOrganizedOtroP.push([account]);
          accountOrganizedOtroPN++;
        }
      });

    return organizedAccounts;
  };