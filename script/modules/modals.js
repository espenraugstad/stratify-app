export async function progressBar(redir) {
  const body = document.querySelector("body");
  const progressWindow = document.createElement("div");
  progressWindow.classList.add("progress");

  body.appendChild(progressWindow);

  let progressBar = document.createElement("div");
  progressBar.classList.add("progress__bar");

  let progressTitle = document.createElement("h2");
  progressTitle.classList.add("progress__title");
  progressTitle.innerHTML = "Progress";

  let progressFill = document.createElement("div");
  progressFill.classList.add("progress__fill");

  let progressText = document.createElement("div");
  progressText.classList.add("progress__text");

  let progressButton = document.createElement("button");
  progressButton.classList.add("button--inactive");
  progressButton.innerHTML = "Done";

  progressButton.addEventListener("click", () => {
    if (!progressButton.classList.contains("button--inactive")) {
      body.removeChild(progressWindow);
      location.href = redir;
    }
  });

  progressBar.appendChild(progressFill);
  progressWindow.appendChild(progressTitle);
  progressWindow.appendChild(progressBar);
  progressWindow.appendChild(progressText);
  progressWindow.appendChild(progressButton);
}

export function updateProgressBar(value, text) {
  console.log("Updating");
  let progressBar = document.querySelector(".progress__fill");
  progressBar.style.width = `${value}%`;

  let progressText = document.querySelector(".progress__text");
  progressText.innerHTML = text;

  if (value === 100) {
    document
      .querySelector(".button--inactive")
      .classList.remove("button--inactive");
  }
}
