const modalBackground = document.getElementById("contact_modal");
const modalForm = document.querySelector(".modalForm");
const body = document.querySelector("body");
const bodyChildren = document.querySelectorAll(
  "body > *:not(#contact_modal):not(script)"
);
const modalCloseBtn = document.querySelector(".contact_button");
const openModalBtn = document.querySelector(".btn-contact");

const displayModal = () => {
  if (modalBackground.style.display !== "block") {
    modalBackground.style.display = "block";
    body.classList.add("no-scroll");
    modalBackground.setAttribute("aria-hidden", "false");
    modalCloseBtn.focus();

    bodyChildren.forEach(function (element) {
      // Traitez chaque élément ici
      element.setAttribute("aria-hidden", "true");
    });
  }
};

const closeModal = () => {
  if (modalBackground.style.display !== "none") {
    modalBackground.style.display = "none";
    body.classList.remove("no-scroll");
    modalBackground.setAttribute("aria-hidden", "true");

    bodyChildren.forEach(function (element) {
      // Traitez chaque élément ici
      element.setAttribute("aria-hidden", "false");
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

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});
const focusableElements =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
const modalFocusableElements = modalForm.querySelectorAll(focusableElements);
const firstElement = modalFocusableElements[0];
const lastElement = modalFocusableElements[modalFocusableElements.length - 1];

