document.getElementById("toggle-button").addEventListener("click", () => {
    const aside1 = document.getElementById("aside1");
    const aside2 = document.getElementById("aside2");
    const main = document.getElementById("main");

    if (window.innerWidth < 700) {
      aside1.classList.add("hidden");
      aside2.classList.remove("hidden");
      main.classList.remove("ml-60");
      main.classList.add("ml-24");
    } else {
      if (aside1.classList.contains("hidden")) {
        aside1.classList.remove("hidden");
        aside2.classList.add("hidden");
        main.classList.remove("ml-24");
        main.classList.add("ml-60");
      } else {
        aside1.classList.add("hidden");
        aside2.classList.remove("hidden");
        main.classList.remove("ml-60");
        main.classList.add("ml-24");
      }
    }
  });