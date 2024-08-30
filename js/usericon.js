const printImageIcon = () => {
    const menu = document.getElementById("user-menu-button");
    const user = JSON.parse(localStorage.getItem("usuarioLogueado"));

    menu.innerHTML += `<img src=${user.picture.thumbnail} alt=${user.login.username} width="24px" height="24px" class="rounded-full">`;
  };

  printImageIcon();

  const cerrarSesion = () => {
    localStorage.removeItem("usuarioLogueado");
    window.location.href = "/paginas/login.html";
  };

  const toggleDropdown=() =>{
    const dropdown = document.getElementById("user-menu");
    dropdown.classList.toggle("hidden");
    dropdown.classList.toggle("opacity-0");
    dropdown.classList.toggle("scale-95");
    dropdown.classList.toggle("opacity-100");
    dropdown.classList.toggle("scale-100");

    if (!dropdown.classList.contains("hidden")) {
      document.addEventListener("click", closeDropdownOnClickOutside);
    } else {
      document.removeEventListener("click", closeDropdownOnClickOutside);
    }
  }

 const closeDropdownOnClickOutside=(event)=> {
    const dropdown = document.getElementById("user-menu");
    const button = document.getElementById("user-menu-button");

    if (
      !dropdown.contains(event.target) &&
      !button.contains(event.target)
    ) {
      dropdown.classList.add("hidden", "opacity-0", "scale-95");
      dropdown.classList.remove("opacity-100", "scale-100");
      document.removeEventListener("click", closeDropdownOnClickOutside);
    }
  }

  