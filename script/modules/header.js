import { getCurrentUser } from "./userHandler.js";

export async function header() {
  console.log("Loading header");
  setMode();
  // Toggle dark/light-mode
  // Create an event for changing of mode
  const modeChange = new Event("modeChange");

  // Mode changer
  const mode = document.querySelector(".nav__mode");

  mode.addEventListener("click", async () => {
    const body = document.querySelector("body");
    body.classList.toggle("dark");
    if (body.classList.contains("dark")) {
      localStorage.setItem("mode", "dark");
    } else {
      localStorage.setItem("mode", "light");
    }

    await setMode();

    // Notify that the mode has changed
    window.dispatchEvent(modeChange);
  });

  // Mobile menu
  const primaryMenu = document.querySelector(".nav__primary");

  // Show mobile menu
  const menuId = document.querySelector(".nav__user");
  menuId.addEventListener("click", () => {
    const vis = primaryMenu.getAttribute("mobile-visible");
    if (vis === "false" && document.body.clientWidth <= 700) {
      primaryMenu.setAttribute("mobile-visible", true);
    } else {
      console.log("Not relevant");
    }
  });

  // Close mobile menu
  const mobileMenuClose = document.querySelector(".nav__close");
  mobileMenuClose.addEventListener("click", () => {
    const vis = primaryMenu.getAttribute("mobile-visible");
    if (vis === "true") {
      primaryMenu.setAttribute("mobile-visible", false);
    } else {
      console.log("An error occured");
    }
  });

  // Show user info
  const userImg = document.querySelector(".nav__img");
  const userName = document.querySelector(".nav__username");

  if (localStorage.getItem("accessToken")) {
    let user = await getCurrentUser();

    userImg.src = user.images[0].url;
    userName.innerHTML = user.display_name;
  }

  // Logout button
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("cv");
    localStorage.removeItem("mode");

    location.replace("index.html");
    location.href = "index.html";
  });
}

export async function setMode() {
  const mode = document.querySelector(".nav__mode");
  const body = document.querySelector("body");
  let user = false;
  if (localStorage.getItem("accessToken")) {
    user = await getCurrentUser();
  }

  let currentMode = localStorage.getItem("mode");
  if (!currentMode) {
    currentMode = "light";
  }

  // If dark mode
  if (currentMode === "dark") {
    body.classList.add("dark");

    // Change mode icon
    mode.src = "./assets/lightmode.png";

    // Change placeholder image if user is not logged in
    if (!user) {
      document.querySelector(".nav__img").src =
        "./assets/placeholder_on_dark.png";
    }

    // Change logo
    document.querySelector(".nav__logo").src = "./assets/logo_on_dark.png";
  }
  // Else (light mode)
  else {
    body.classList.remove("dark");
    localStorage.setItem("mode", "light");

    // Change mode icon
    mode.src = "./assets/darkmode.png";

    // Change placeholder image if user is not logged in
    if (!user) {
      document.querySelector(".nav__img").src =
        "./assets/placeholder_on_light.png";
    }

    // Change logo
    document.querySelector(".nav__logo").src = "./assets/logo_on_light.png";
  }
}
