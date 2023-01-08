import { header } from "./modules/header.js";

window.onload = async () => {
  await header();
  setMode();
};

/***** Changes when mode is changed *****/
window.addEventListener("modeChange", setMode);

function setMode() {
  // Get the mode from localStorage
  let mode = localStorage.getItem("mode");

  // Options icons
  const mergePlaylistsIcon = document.getElementById("merge-playlists-icon");
  const deletePlaylistsIcon = document.getElementById("delete-playlists-icon");
  const addSongsIcon = document.getElementById("add-songs-icon");

  if (mode === "light") {
    mergePlaylistsIcon.src = "./assets/merge_on_light.png";
    deletePlaylistsIcon.src = "./assets/delete_on_light.png";
    addSongsIcon.src = "./assets/add_on_light.png";
  } else {
    mergePlaylistsIcon.src = "./assets/merge_on_dark.png";
    deletePlaylistsIcon.src = "./assets/delete_on_dark.png";
    addSongsIcon.src = "./assets/add_on_dark.png";
  }
}

// Menus
document.getElementById("merge-playlists").addEventListener("click", () => {
  location.href = "merge.html";
});
document.getElementById("delete-playlists").addEventListener("click", () => {
  console.log("delete");
});
document.getElementById("add-songs").addEventListener("click", () => {
  console.log("add");
});
