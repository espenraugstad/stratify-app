const cid = "79aab9b8746344ebb0edb4367327f0fb";
const redir = "http://localhost:8888/";

function generateRandomString(length) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let ranString = "";

  for (let i = 0; i < length; i++) {
    ranString += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return ranString;
}

async function generateCodeChallenge(code_verifier) {
  const textEncoder = new TextEncoder().encode(code_verifier);
  const hashBuffer = await crypto.subtle.digest("SHA-256", textEncoder);
  //const hashArray = Array.from(new Uint8Array(hashBuffer));
  /* const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); */

  //return hashHex;
  return btoa(String.fromCharCode.apply(null, new Uint8Array(hashBuffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function login() {
  let codeVerifier = generateRandomString(64);
  console.log(codeVerifier);
  localStorage.setItem("cv", codeVerifier);

  let cc = await generateCodeChallenge(codeVerifier);

  let requestUrl = `https://accounts.spotify.com/authorize?client_id=${cid}&response_type=code&redirect_uri=${redir}&show_dialog=true&scope=playlist-read-collaborative playlist-read-private playlist-modify-private playlist-modify-public&code_challenge_method=S256&code_challenge=${cc}`;

  window.location.href = requestUrl;
}

export function getCode() {
  return new URLSearchParams(location.search).get("code");
}

export async function getAccessToken() {
  const code = getCode();
  const searchString = new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    redirect_uri: redir,
    client_id: cid,
    code_verifier: localStorage.getItem("cv"),
  });

  const url = "https://accounts.spotify.com/api/token";
  const cfg = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: searchString,
  };
  console.log(searchString);

  try {
    let tokenData = await fetch(url, cfg);
    if(tokenData.status === 200){
      let data = await tokenData.json();
      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);
      console.log(data);
    } else {
      console.log(tokenData.status);
    }
  } catch (err) {
    console.log("An error occurred");
    console.loge(err);
  }
}
