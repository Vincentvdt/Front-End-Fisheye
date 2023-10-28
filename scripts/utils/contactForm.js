const modalBackground = document.getElementById("contact_modal");
const modal = document.querySelector(".modal");
const modalForm = document.querySelector(".modalForm");
const displayModal = () => {
  modalBackground.style.display = "block";
};

const closeModal = () => {
  modalBackground.style.display = "none";
};

modalForm.addEventListener("submit", (e) => {
  e.preventDefault();
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

document.addEventListener("click", (e) => {
  if (e.target === modalBackground) {
    closeModal();
  }
});
