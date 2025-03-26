import { getAccess } from "./auth.js";

/***** GLOBAL VARIABLES *****/
export async function getPlaylists(offset) {
  let access = getAccess();
  if (access) {
    const url = `https://api.spotify.com/v1/me/playlists?offset=${offset}&limit=50`;

    const cfg = {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + access,
      },
    };

    try {
      let res = await fetch(url, cfg);
      if (res.status === 401) {
        //refresh();
      }
      let data = await res.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log("User is not logged in");
  }
}
