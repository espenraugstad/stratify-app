import { getAccess } from "./auth.js";

export async function getTracksFromPlaylists(source) {
  let access = await getAccess();
  if (access) {
    // Source is an array of playlists
    let tracks = [];

    for (let list of source) {
      //console.log(list);
      let max = false;
      let offset = 0;

      while (!max) {
        const url = `https://api.spotify.com/v1/playlists/${list.id}/tracks?offset=${offset}`;
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
          } else if (res.status !== 200) {
            console.log(res.status);
            throw `Error ${res.status}`;
          } else {
            let data = await res.json();
            tracks = tracks.concat(data.items);
            if (data.items.length === 100) {
              offset += 100;
            } else {
              max = true;
              //return tracks;
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    }

    return tracks;
  } else {
    console.log("User is not logged in");
  }
}

export async function addTracks(trackList, listId) {
  let access = await getAccess();
  if (access) {
    // Note, only possible to add 100 tracks per request.
    const url = `https://api.spotify.com/v1/playlists/${listId}/tracks`;

    let results = [];

    for (let i = 0; i < trackList.length; i += 100) {
      const cfg = {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + getAccess(),
        },
        body: JSON.stringify(trackList.slice(i, i + 100)),
      };

      try {
        let res = await fetch(url, cfg);
        if (res.status === 401) {
          //refresh();
        } else if (res.status !== 201) {
          console.log(res.status);
          throw `Error adding tracks ${res.status}`;
        } else {
          results.push(true);
        }
      } catch (err) {
        console.log(err);
        results.push(err);
      }
    }

    return results;
  } else {
    console.log("User not logged in");
  }
}
