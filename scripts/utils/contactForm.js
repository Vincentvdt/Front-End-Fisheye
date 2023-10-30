const modalBackground = document.getElementById("contact_modal");
const modalForm = document.querySelector(".modalForm");
const body = document.querySelector("body");
const modalCloseBtn = document.querySelector(".contact_button");
const openModalBtn = document.querySelector(".btn-contact");

const displayModal = () => {
  if (modalBackground.style.display !== "block") {
    modalBackground.style.display = "block";
    body.classList.add("no-scroll");
    modalBackground.setAttribute("aria-hidden", "false");
    modalBackground.setAttribute("tabindex", "0");
    modalCloseBtn.focus();

    focusableElements.forEach(function (element) {
      // Traitez chaque élément ici
      element.setAttribute("aria-hidden", "true");
      element.setAttribute("tabindex", "-1");
    });
  }
};

const closeModal = () => {
  if (modalBackground.style.display !== "none") {
    modalBackground.style.display = "none";
    body.classList.remove("no-scroll");
    modalBackground.setAttribute("aria-hidden", "true");
    modalBackground.setAttribute("tabindex", "-1");

    focusableElements.forEach(function (element) {
      // Traitez chaque élément ici
      element.setAttribute("aria-hidden", "false");
      element.removeAttribute("tabindex");
    });
  }
  openModalBtn.focus();
};

modalForm.addEventListener("submit", (e) => {
  e.preventDefault();
});

document.addEventListener("click", (e) => {
  if (e.target === modalBackground) {
    closeModal();
  }
});

const validate = (form) => {
  const values = {};
  for (const input of form) {
    if (input.name) {
      values[input.name] = input.value;
    }
  }
  console.log(values);
  closeModal();
};
