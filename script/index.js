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
  let code = getCode();
  console.log(code);
  if (!code) {
    console.log("Clearing");
    localStorage.clear();
  } else {
    await header();
    localStorage.setItem("mode", "light");
    setMode();
    if (code) {
      await getAccessToken(code);
    }
  }
};
