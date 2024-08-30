const printAccounts = () => {
    const user = JSON.parse(localStorage.getItem("usuarioLogueado"));

    const cuentas = JSON.parse(localStorage.getItem("accounts")).filter(
      (cuenta) => cuenta.user.uuid === user.login.uuid
    );

    const container = document.getElementById("cuentas-container");

    container.innerHTML = "";

    cuentas.forEach((cuenta, index) => {
      const accountElement = document.createElement("a");
      accountElement.href = `/accounts?id=${index + 1}`;
      accountElement.className = `m-4 border rounded-lg border-stone-400 p-8 flex flex-col gap-2 shadow-md shadow-stone-800/50 border-l-8 border-l-green-600 w-full max-w-[550px] dark:bg-gray-800 hover:bg-gray-600`;
      accountElement.innerHTML = `
    <h2 class="font-bold text-xl uppercase">Cuenta</h2>
    <p class="font-bold text-xl uppercase">${cuenta.code}</p>
    <div class="flex justify-between flex-col md:flex-row">
        <p class="font-medium">Saldo disponible:</p>
        <p class="font-bold">$ ${cuenta.ARS.toLocaleString()}</p>
    </div>
    <div class="flex justify-between flex-col md:flex-row">
        <p class="font-medium">Saldo disponible:</p>
        <p class="font-bold">u$s ${cuenta.USD.toLocaleString()}</p>
    </div>
    <div class="flex justify-between flex-col md:flex-row">
        <p class="font-bold">Tipo de Cuenta:</p>
        <p class="font-bold uppercase">${cuenta.type}</p>
    </div>
`;

      container.appendChild(accountElement);
    });
  };

  printAccounts();