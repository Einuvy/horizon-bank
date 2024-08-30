const ACCESS_KEY = "910a4208af08ad0ed446e023edcd5ebe";
const URI_BASE_PATH = "https://data.fixer.io/api/";

const CURRENCY_LAYER_URI_BASE_PATH = "https://api.currencylayer.com/";
const CURRENCY_LAYER_ACCESS_KEY = "97f7577130cb3bd6253e518af8719d5c";

const $monedaBaseSelect = document.getElementById("moneda-base");
const $monedaReceptorSelect = document.getElementById("moneda-receptor");

const $formularioConvertir = document.getElementById("hi-convertir-plata");

const $CBUInput = document.getElementById("receptor-tranferencia");
const $amountInput = document.getElementById("amount-transfer");
const $selectAccount = document.getElementById("emisor-transferencia");
const $currency = document.getElementById("currency");

const $selecCuentaConvertir = document.getElementById("cuenta-conversion");

const converter = async (from, to, amount) => {
  if (!from || !to || !amount) return;

  try {
    const response = await fetch(`${URI_BASE_PATH}latest?access_key=${ACCESS_KEY}&symbols=${from},${to}`);
    if (!response.ok) {
      throw new Error("Status: " + response.statusText);
    }
    const data = await response.json();
    const rates = data.rates;
    const valorFrom = from === "EUR" ? 1 : rates[from];
    const valorTo = rates[to];

    return (amount * valorTo) / valorFrom;
  } catch (error) {
    console.error("Error en la petición: ", error);
    return null;
  }
};

$formularioConvertir.addEventListener("submit", async (event) => {
  event.preventDefault();

  const monedaBase = $monedaBaseSelect.value;
  const monedaReceptor = $monedaReceptorSelect.value;
  const monto = document.getElementById("amount-convertir").value;
  const selectedAccount = $selecCuentaConvertir.value;

  if (monto < 0) {
    console.error("Monto negativo");
    return;
  }

  const cuentas = JSON.parse(localStorage.getItem("accounts"));
  const miCuenta = cuentas.find((cuenta) => cuenta.code === selectedAccount);

  if (!miCuenta) {
    console.error("Una de las cuentas no fue encontrada");
    return;
  }

  const montoConvertir = await converter(monedaBase, monedaReceptor, monto);

  if (!montoConvertir) {
    console.error("No existe monto a convertir");
    return;
  }

  swal({
    title: "¿Estás seguro?",
    className:"swalModal",
    text: `Estás por cambiar $${monto} ${monedaBase} a ${montoConvertir} ${monedaReceptor}.`,
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
      if (monedaBase === "ARS") {
        miCuenta.ARS -= monto;
        miCuenta.USD += montoConvertir;
      } else {
        miCuenta.USD -= monto;
        miCuenta.ARS += montoConvertir;
      }
      
      const cuentasActualizadas = cuentas.filter((cuenta) => 
        cuenta.code !== selectedAccount
      );

      cuentasActualizadas.push(miCuenta);

      localStorage.setItem("accounts", JSON.stringify(cuentasActualizadas));
      swal("¡Excelente! Has convertido el dinero a la moneda deseada!", {
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

const createForm = () => {
  fetch(
    `${CURRENCY_LAYER_URI_BASE_PATH}list?access_key=${CURRENCY_LAYER_ACCESS_KEY}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Status: " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      const currencies = Object.entries(data.currencies);

      currencies.forEach(([code, name]) => {
        const option = document.createElement("option");
        option.value = code;
        option.textContent = `${code} - ${name}`;

        monedaBaseSelect.appendChild(option.cloneNode(true));
        monedaReceptorSelect.appendChild(option.cloneNode(true));
      });
    })
    .catch((error) => {
      console.error("Error en la peticion: ", error);
    });
};

const $listaContactos = document.getElementById("lista-contactos");

const imprimirContactos = () => {
  const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));
  const usuarios = JSON.parse(localStorage.getItem("users"));

  const contactos = usuarios.filter(
    (usuario) => usuario.email !== usuarioLogueado.email
  );

  contactos.forEach((contacto) => {
    $listaContactos.innerHTML += `             
      <li class="flex justify-between gap-x-6 py-5 hover:bg-gray-700 rounded-sm cursor-pointer" onclick="cambiarCBU('${contacto.email}')">
        <div class="flex min-w-0 gap-x-4">
          <img
            class="h-12 w-12 flex-none rounded-full bg-gray-50"
            src="${contacto.picture.thumbnail}"
            alt="imagen-${contacto.name.first}"
          />
          <div class="min-w-0 flex-auto">
            <p class="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
              ${contacto.name.first} ${contacto.name.last}
            </p>
            <p class="mt-1 truncate text-xs leading-5 dark:text-gray-500 dark:text-gray-400">
              ${contacto.email}
            </p>
          </div>
        </div>
      </li>`;
  });
};

const cambiarCBU = (email) => {
  const usuarios = JSON.parse(localStorage.getItem("users"));

  const contactoSeleccionado = usuarios.find(
    (usuario) => usuario.email === email
  );
  const cuentaDelContacto = JSON.parse(localStorage.getItem("accounts")).find(
    (cuenta) =>
      cuenta.user.uuid === contactoSeleccionado.login.uuid &&
      cuenta.type === "Corriente"
  );

  $CBUInput.value = cuentaDelContacto.CBU;
};


document
  .getElementById("hi-transferir-plata")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    const cbu = $CBUInput.value;
    const amount = parseFloat($amountInput.value);
    const selectedAccount = $selectAccount.value;
    const moneda = $currency.value;

    if (amount < 0) {
      console.error("Amount negativo");
      return;
    }

    const cuentas = JSON.parse(localStorage.getItem("accounts"));
    const cuentaDelContacto = cuentas.find((cuenta) => cuenta.CBU === cbu);
    const miCuenta = cuentas.find((cuenta) => cuenta.code === selectedAccount);

    if (!cuentaDelContacto || !miCuenta) {
      console.error("Una de las cuentas no fue encontrada");
      return;
    }

    swal({
      title: "¿Estas seguro?",
      className:"swalModal",
      text: `Estas por enviar $${amount} ${moneda}, a la cuenta de ${cuentaDelContacto.email}.`,
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
        if (moneda === "ARS") {
          cuentaDelContacto.ARS += amount;
          miCuenta.ARS -= amount;
        } else {
          cuentaDelContacto.USD += amount;
          miCuenta.USD -= amount;
        }
        const cuentasActualizadas = cuentas.filter((cuenta) => 
          cuenta.code !== selectedAccount && cuenta.CBU !== cbu
        );
    
        cuentasActualizadas.push(cuentaDelContacto);
        cuentasActualizadas.push(miCuenta);
    
        localStorage.setItem("accounts", JSON.stringify(cuentasActualizadas));
        swal("Excelente! Haz transferido la plata al contacto deseado!", {
          icon: "success",
        })
        .then(()=>{
          window.location.reload();
        })
      } else {
        swal("Se ha cancelado la operacion");
      }
    });   
  });

  const printAccountsSelector = (selectId) => {
    const user = JSON.parse(localStorage.getItem("usuarioLogueado"));
    const selectForm = document.getElementById(selectId);

    const cuentas = JSON.parse(localStorage.getItem("accounts")).filter(
      (cuenta) => cuenta.user.uuid === user.login.uuid
    );

    cuentas.forEach((cuenta) => {
      

      const option = document.createElement("option");
      option.value = cuenta.code;
      option.textContent = `${cuenta.code}`;

      selectForm.appendChild(option.cloneNode(true));
    });
  };
  printAccountsSelector("cuenta-conversion");
  printAccountsSelector("emisor-transferencia");

  

/* createForm(); */
imprimirContactos();
