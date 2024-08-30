const $formPagarFactura = document.getElementById("hi-pagar-cuenta");
const $formPedirPrestamo = document.getElementById("hi-pedir-prestamo");

const printAccountsSelector = (selectId) => {
  const user = JSON.parse(localStorage.getItem("usuarioLogueado"));
  const cuentaDestino = document.getElementById(selectId);

  const cuentas = JSON.parse(localStorage.getItem("accounts")).filter(
    (cuenta) => cuenta.user.uuid === user.login.uuid
  );

  cuentas.forEach((cuenta) => {
    const option = document.createElement("option");
    option.value = cuenta.code;
    option.textContent = `${cuenta.code}`;
    console.log(cuenta);

    cuentaDestino.appendChild(option.cloneNode(true));
  });
};
printAccountsSelector("emisor-transferencia");

printAccountsSelector("cuenta-destino");

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
`;

    container.appendChild(accountElement);
  });
};

printAccounts();

$formPagarFactura.addEventListener("submit", (event)=>{
  event.preventDefault();

  const amount = document.getElementById("amount-pago").value;
  const moneda = document.getElementById("moneda-pago").value

  swal({
    title: "¿Estas seguro?",
    className:"swalModal",
    text: `Estas por pagar la factura, por un monto de $${amount} ${moneda}.`,
    icon: "warning",
    buttons:{
      cancel:{
        text:"Cancelar",
        visible:true
      },
      confirm:{
        text:"Enviar"
      }
    }
  })
  .then((acepted) => {
    if (acepted) {
  
      swal("Excelente! Haz pagado la factura!", {
        icon: "success",
      })
      .then(()=>{
        window.location.reload();
      })
    } else {
      swal("Se ha cancelado la operacion");
    }
  }); 
})

$formPedirPrestamo.addEventListener("submit", (event) => {
  event.preventDefault();

  const amount = parseFloat(document.getElementById("amount-prestamo").value);
  const moneda = document.getElementById("moneda-prestamo").value;
  const cuotas = parseInt(document.getElementById("cantidad-cuotas").value);
  const cuenta = document.getElementById("cuenta-destino").value;

  const valorBaseCuota = amount / cuotas;
  const valorDeCuota = valorBaseCuota * 1.05;

  const cuentas = JSON.parse(localStorage.getItem("accounts"));
  const miCuenta = cuentas.find((cuenta) => cuenta.code === selectedAccount);

  if (!miCuenta) {
    console.error("Una de las cuentas no fue encontrada");
    return;
  }

  swal({
    title: "¿Estás seguro?",
    className: "swalModal",
    text: `Estás por pedir un préstamo de $${amount.toFixed(2)} ${moneda}, en ${cuotas} cuotas de $${valorDeCuota.toFixed(2)} ${moneda}.`,
    icon: "warning",
    buttons: {
      cancel: {
        text: "Cancelar",
        visible: true
      },
      confirm: {
        text: "Enviar"
      }
    }
  })
  .then((acepted) => {
    if (acepted) {

      if (moneda === "ARS") {
        miCuenta.ARS += monto;
      } else {
        miCuenta.USD += monto;
      }

      const cuentasActualizadas = cuentas.filter((cuenta) => 
        cuenta.code !== selectedAccount
      );

      cuentasActualizadas.push(miCuenta);

      localStorage.setItem("accounts", JSON.stringify(cuentasActualizadas));
      swal(`¡Excelente! El préstamo ha sido enviado a la cuenta ${cuenta}!`, {
        icon: "success",
      })
      .then(() => {
        window.location.reload();
      })
    } else {
      swal("Se ha cancelado la operación");
    }
  });
});