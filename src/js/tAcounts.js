function loadAccounts() {
    axios.get('http://localhost:3000/api/getData')
        .then(response => {
            const accountsData = response.data; // Obtener los datos de la respuesta

            // Inicializar un objeto para almacenar las cuentas
            const accountsMap = {};

            // Transformar los datos en el formato esperado
            accountsData.forEach(row => {
                const accountName = row.acount;

                // Verificar si ya existe una cuenta para el nombre de cuenta actual
                if (!accountsMap[accountName]) {
                    // Si no existe, crear una nueva cuenta
                    accountsMap[accountName] = {
                        id: Object.keys(accountsMap).length + 1, // ID único para cada cuenta
                        name: accountName,
                        records: []
                    };
                }

                // Determinar el tipo de registro (debito o credito)
                const recordType = row.type === 'CARGO' ? 'debit' : 'credit';

                // Agregar el registro a la cuenta correspondiente
                accountsMap[accountName].records.push({
                    type: recordType,
                    amount: parseFloat(row.amount),
                    description: `Actividad ${row.numberActivity}`
                });
            });

            // Convertir el objeto en un array de cuentas
            const accounts = Object.values(accountsMap);

            // Agregar cada cuenta al contenedor
            accounts.forEach(account => {
                addAccount(account);
            });
        })
        .catch(error => {
            console.error('Error al cargar las cuentas:', error);
        });
}



document.addEventListener('DOMContentLoaded', function() {
    loadAccounts();
});

// función para agregar una nueva cuenta T
function addAccount(account) {
    const accountHTML = `
        <div class="t-account">
            <h2>${account.name}</h2>
            <div class="debit">
                <h3>Cargos</h3>
                <ul id="debit-list-${account.id}"></ul>
                <p class="total" id="debit-total-${account.id}">Total: 0</p>
            </div>
            <div class="credit">
                <h3>Abonos</h3>
                <ul id="credit-list-${account.id}"></ul>
                <p class="total" id="credit-total-${account.id}">Total: 0</p>
            </div>
            <p class="result" id="result-${account.id}"></p>
        </div>
    `;
    const accountsContainer = document.querySelector('.accounts');
    accountsContainer.insertAdjacentHTML('beforeend', accountHTML);

    // función para agregar un nuevo registro a la cuenta T
    function addRecord(type, amount, description) {
        const list = type === 'debit'? `debit-list-${account.id}` : `credit-list-${account.id}`;
        const listElement = document.getElementById(list);
        const listItem = document.createElement('li');
        listItem.textContent = `${amount} - ${description}`;
        listElement.appendChild(listItem);

        // actualizar el total de la sección correspondiente
        const totalElement = document.getElementById(`${type}-total-${account.id}`);
        let total = parseFloat(totalElement.textContent.replace('Total: ', ''));
        total += amount;
        totalElement.textContent = `Total: ${total}`;

        // actualizar el resultado final
        const debitTotalElement = document.getElementById(`debit-total-${account.id}`);
        const creditTotalElement = document.getElementById(`credit-total-${account.id}`);
        const debitTotal = parseFloat(debitTotalElement.textContent.replace('Total: ', ''));
        const creditTotal = parseFloat(creditTotalElement.textContent.replace('Total: ', ''));
        let result = '';
        if (debitTotal > creditTotal) {
            result = `Cargo: ${debitTotal - creditTotal}`;
        } else if (creditTotal > debitTotal) {
            result = `Abono: ${creditTotal - debitTotal}`;
        } else {
            result = 'Iguales';
        }
        document.getElementById(`result-${account.id}`).textContent = result;
    }

    // función para actualizar la cuenta T con los datos iniciales
    function updateAccount() {
        account.records.forEach((record) => {
            addRecord(record.type, record.amount, record.description);
        });
    }

    // actualizar la cuenta T con los datos iniciales
    updateAccount();
}