const clientId = "79aab9b8746344ebb0edb4367327f0fb";
//const redir = "http://localhost:8888/";
//const redir = "https://stratify-app.com/";
const redirectUri = "http://localhost:3000/";

const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

const sha256 = async (plain) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return window.crypto.subtle.digest('SHA-256', data)
}

const base64encode = (input) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}


export async function login() {
  const codeVerifier  = generateRandomString(64);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  const scope = 'user-read-private user-read-email playlist-read-collaborative playlist-read-private playlist-modify-private playlist-modify-public';
  const authUrl = new URL("https://accounts.spotify.com/authorize");

  window.localStorage.setItem('code_verifier', codeVerifier);

  const params =  {
    response_type: 'code',
    client_id: clientId,
    scope,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  }
  
  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();
  //let requestUrl = `https://accounts.spotify.com/authorize?client_id=${cid}&response_type=code&redirect_uri=${redir}&show_dialog=true&scope=playlist-read-collaborative playlist-read-private playlist-modify-private playlist-modify-public&code_challenge_method=S256&code_challenge=${cc}`;

  //window.location.href = requestUrl;
}

export function getCode() {
  return new URLSearchParams(location.search).get("code");
}

export async function getAccessToken(code) {
  //const code = getCode();
  console.log(localStorage.getItem("cv"));
  const searchString = new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: localStorage.getItem("code_verifier"),
  });

  const url = "https://accounts.spotify.com/api/token";
  const cfg = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: searchString,
  };

  try {
    let tokenData = await fetch(url, cfg);
    if (tokenData.status === 200) {
      let data = await tokenData.json();
      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);
      location.href = "home.html";
    } else {
      console.log(tokenData);
    }
  } catch (err) {
    console.log("An error occurred");
    console.loge(err);
  }
}

export function getAccess() {
  const access = localStorage.getItem("accessToken");
  if (access && access !== "undefined") {
    return access;
  } else {
    return false;
  }
}

export async function refresh() {
  let refreshToken = localStorage.getItem("refreshToken");

  const searchString = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: cid,
  });

  const url = "https://accounts.spotify.com/api/token";

  const cfg = {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: searchString,
  };

  try {
    let result = await fetch(url, cfg);
    let data = await result.json();

    if (result.status === 200) {
      console.log(data);
    }
  } catch (err) {
    console.log(err);
    return { error: err };
  }
}
