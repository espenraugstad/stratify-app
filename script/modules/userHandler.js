import { getAccess } from "./auth.js";

export async function getCurrentUser() {
  if (getAccess) {
    const url = "https://api.spotify.com/v1/me";

    const cfg = {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    };

    try {
      let res = await fetch(url, cfg);
      if (res.status === 401) {
        //refresh();
      } else if (res.status === 200) {
        let data = await res.json();

        return data;
      } else {
        throw "Unable to get current user";
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log("Log in");
    location.href = "index.html";
  }
}
