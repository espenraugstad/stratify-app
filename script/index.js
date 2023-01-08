import { header, setMode } from "./modules/header.js";
import { login, getCode, getAccessToken } from "./modules/auth.js";

/***** HTML ELEMENTS *****/
const loginBtn = document.getElementById("loginBtn");

/***** GLOBAL VARS *****/

/***** EVENT LISTENERS *****/
loginBtn.addEventListener("click", async () => {
  await login();
});

/***** FUNCTIONS *****/
window.onload = async () => {
  await header();

  localStorage.setItem("mode", "light");
  setMode();
  getCode();
  if (getCode()) {
    await getAccessToken();
  }
};
