import { header, setMode } from "./modules/header.js";
import { getPlaylists } from "./modules/playlistHandler.js";
import { addTracks, getTracksFromPlaylists } from "./modules/trackHandler.js";
import { progressBar, updateProgressBar } from "./modules/modals.js";

/***** GLOBAL VARIABLES *****/
let allPlaylists = [];
let selected = 0;
let showTarget = false;
let merge = false;
let sourcePlaylists = [];
let targetPlaylist = { id: "a" };

/***** HTML ELEMENTS *****/
const mergeAction = document.getElementById("merge-action");
const listOfPlaylists = document.getElementById("list-of-playlists");
const searchPlaylistsMerge = document.getElementById("searchPlaylistsMerge");
const selectedPlaylists = document.getElementById("selected-playlists");
const showSelected = document.getElementById("showSelected");
const selectTargetBtn = document.getElementById("selectTargetBtn");

/***** FUNCTIONS *****/

window.onload = async () => {
  await header();
  setMode();
  await getAllPlaylists(0);
  searchPlaylistsMerge.value = "";
  displayPlaylists();
};

async function getAllPlaylists(offset) {
  let data = null;
  if (offset === 0) {
    // First call
    data = await getPlaylists(offset);
    allPlaylists = data.items;
  } else {
    data = await getPlaylists(offset);
    allPlaylists = allPlaylists.concat(data.items);
  }

  if (data.items.length >= 50) {
    offset += 50;
    await getAllPlaylists(offset);
  }
}

function displayPlaylists() {
  // Clear exisiting playlists, if any
  listOfPlaylists.innerHTML = "";

  for (let list of allPlaylists) {
    // Show all, or only selected?
    if (showSelected.checked) {
      // Show only selected
      if (list.selected && !list.hidden) {
        createPlaylistItem(list, false);
      }
    } else {
      if (!list.hidden) {
        createPlaylistItem(list, false);
      }
    }
  }
}

function createPlaylistItem(list, target) {
  // Create a div for the entire playlist
  let playlistDiv = document.createElement("div");
  if (target) {
    playlistDiv.classList.add("playlist", "playlist--target");
  } else {
    playlistDiv.classList.add("playlist", "playlist-untarget");
  }
  if (list.selected || list.id === targetPlaylist.id) {
    playlistDiv.classList.add("selected");
  }

  if (list.selected || list.id === targetPlaylist.id) {
    playlistDiv.classList.add("playlist--selected");
  }

  let playlistImage = document.createElement("img");
  playlistImage.classList.add("playlist--image");
  if (list.images[0]) {
    playlistImage.src = list.images[0].url;
  } else {
    playlistImage.src = "./assets/playlist_on_light.png";
    playlistImage.classList.add("playlist__icon");
  }

  // Create a div for the title and user
  let playlistInfoDiv = document.createElement("div");
  playlistInfoDiv.classList.add("playlist-info");

  // Create title
  let titleDiv = document.createElement("div");
  titleDiv.classList.add("playlist-title");
  titleDiv.innerHTML = list.name;

  // Create user
  let userDiv = document.createElement("div");
  userDiv.classList.add("playlist--owner");
  userDiv.innerHTML = list.owner.display_name;

  // Add elements
  playlistInfoDiv.appendChild(titleDiv);
  playlistInfoDiv.appendChild(userDiv);
  playlistDiv.appendChild(playlistImage);
  playlistDiv.appendChild(playlistInfoDiv);

  listOfPlaylists.appendChild(playlistDiv);

  // Add an event-listener to the div for selection
  playlistDiv.addEventListener("click", () => {
    if (!showTarget && !merge) {
      playlistDiv.classList.toggle("playlist--selected");
      if (playlistDiv.classList.contains("playlist--selected")) {
        list.selected = true;
        selected++;
        // Add playlist to array of source playlists
        sourcePlaylists.push(list);
      } else {
        list.selected = false;
        selected--;
        // Remove playlist from array of source playlists
        sourcePlaylists = sourcePlaylists.filter((el) => el.id !== list.id);
        displayPlaylists();
      }
      selectedPlaylists.innerHTML = selected;
    } else {
      if (list.id === targetPlaylist.id) {
        targetPlaylist = { id: "a" };
        merge = false;
        displayTargets();
      } else {
        targetPlaylist = list;
        merge = true;
        displayTargets();
      }

      /* if (targetPlaylist === null) {
        // Add playlist to variable for target
        targetPlaylist = list;
        // Add selected class
        playlistDiv.classList.add("selected");
        merge = true;
      } else {
        displayTargets();
        playlistDiv.classList.add("selected");
        targetPlaylist = null;
        merge = false;
      } */

      if (merge) {
        selectTargetBtn.innerHTML = "Merge";
      } else {
        selectTargetBtn.innerHTML = "Back";
      }
    }
  });
}

function displayTargets() {
  // Clear exisiting playlists, if any
  listOfPlaylists.innerHTML = "";
  for (let list of allPlaylists) {
    if (!list.hidden && !list.selected) {
      createPlaylistItem(list, true);
    }
  }
}

/***** EVENT LISTENERS *****/
window.addEventListener("modeChange", () => {
  // Get the mode from localStorage
  let mode = localStorage.getItem("mode");

  // All the icons
  const defaultIcons = document.querySelectorAll(".playlist__icon");

  for (let icon of defaultIcons) {
    if (mode === "light") {
      icon.src = "./assets/playlist_on_light.png";
    } else {
      icon.src = "./assets/playlist_on_dark.png";
    }
  }
});

searchPlaylistsMerge.addEventListener("input", () => {
  // Loop through all playlists and hide those who names doesn't fit
  for (let list of allPlaylists) {
    if (
      list.name
        .toUpperCase()
        .indexOf(searchPlaylistsMerge.value.toUpperCase()) < 0 &&
      list.owner.display_name
        .toUpperCase()
        .indexOf(searchPlaylistsMerge.value.toUpperCase()) < 0
    ) {
      // Hide
      list.hidden = true;
    } else {
      list.hidden = false;
    }
  }

  // Display playlists again
  if (showTarget) {
    displayTargets();
  } else {
    displayPlaylists();
  }
});

showSelected.addEventListener("change", () => {
  if (showTarget) {
    displayTargets();
  } else {
    displayPlaylists();
  }
});

selectTargetBtn.addEventListener("click", async () => {
  if (selected !== 0) {
    if (!merge) {
      showTarget ? (showTarget = false) : (showTarget = true);
      if (showTarget) {
        selectTargetBtn.innerHTML = "Previous";
        mergeAction.innerHTML = "Choose a target";
        displayTargets();
      } else {
        selectTargetBtn.innerHTML = "Next";
        mergeAction.innerHTML = "Click on the playlists you want to merge";
        displayPlaylists();
      }
    } else {
      console.log("Meeeergin");
      console.log(sourcePlaylists);
      console.log(targetPlaylist);
      await progressBar("merge.html");
      updateProgressBar(0, "Retrieving source tracks...");

      // Start the merging process
      // Get all tracks from the source lists
      console.log("Getting tracks from sources");
      let sourceTracks = await getTracksFromPlaylists(sourcePlaylists);
      console.log(sourceTracks);
      console.log("Tracks received");

      updateProgressBar(20, "Retrieving target tracks...");
      // Getting tracks from target list
      console.log("Getting tracks from target");
      let targetTracks = await getTracksFromPlaylists([targetPlaylist]);
      console.log("Target tracks received");
      console.log("Preparing tracks to merge");

      updateProgressBar(50, "Checking for existing tracks...");
      // Remove all tracks from source playlist that also exists in target playlist
      let tracksToMerge = sourceTracks.filter(
        (track) =>
          targetTracks.findIndex(
            (targetTrack) => track.track.id === targetTrack.track.id
          ) < 0
      );

      updateProgressBar(60, "Removing duplicates...");
      // Get all the uris to the tracks
      let tracksToMergeUri = [];
      for (let track of tracksToMerge) {
        tracksToMergeUri.push(track.track.uri);
      }
      // Remove duplicates
      tracksToMergeUri = [...new Set(tracksToMergeUri)];
      updateProgressBar(70, "Checking status...");
      // Check to see if there are no tracks to merge
      if (tracksToMergeUri.length === 0) {
        console.log("Playlist already up to date");
        updateProgressBar(100, "Playlist already up to date :)");
      } else {
        updateProgressBar(80, "Adding tracks to target...");
        console.log("Merging tracks");
        let mergeResult = await addTracks(tracksToMergeUri, targetPlaylist.id);
        console.log(mergeResult);
        updateProgressBar(100, "Playlists merged successfully!");
      }

      // Display progress bar or something similar

      // Display finish message

      // Reset
    }
  }
});
