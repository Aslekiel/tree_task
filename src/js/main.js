import {
  checkInputValue,
  getFormatedInputValue,
  renderBranch,
} from "./utils/index.js";

const form = document.querySelector("#form");
const input = document.querySelector("#tree-input");
const tree = document.querySelector("#tree");

const handleSubmit = (ev) => {
  ev.preventDefault();

  const isInpurValueValid = checkInputValue(input.value);

  if (!isInpurValueValid) {
    const pElement = document.createElement("p");
    pElement.classList.add('error-message');
    pElement.innerText = "Неправильное выражение";
    tree.appendChild(pElement);
    return;
  }

  const formated = getFormatedInputValue(input.value);
  const branches = renderBranch({
    startBranch: formated[0],
    branches: formated,
  });

  const code = document.createElement("code");
  code.classList.add("tree-item");

  branches.forEach((el) => {
    code.insertAdjacentHTML(
      "beforeend",
      `<pre class="tree-item__row">${el}</pre>`
    );
  });

  tree.appendChild(code);
};

form.addEventListener("submit", handleSubmit, true);
