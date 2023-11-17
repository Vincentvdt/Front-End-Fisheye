// eslint-disable-next-line no-unused-vars
const _contact = () => {
  const contactDOM = document.querySelector("#contact_modal");
  const form = contactDOM.querySelector(".modalForm");
  const modalWrapper = document.querySelector(".modal");
  const inputsWrapper = document.querySelectorAll(".formInput");

  // eslint-disable-next-line no-undef
  const modal = _modal(contactDOM);
  const open = () => {
    modal.show();
  };

  const close = () => {
    modal.hide();
  };

  let formData = {};
  let hasError = false;

  const getAllInputs = () => {
    formData = {
      first: form["first"],
      last: form["last"],
      email: form["email"],
      message: form["message"],
    };
  };

  getAllInputs();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      displaySuccessMessage();
    } else {

      errorSubmit();
    }
  });

  const inlineValidation = () => {
    inputsWrapper.forEach((input) => {
      input.addEventListener("input", (e) => {
        let input = formData[e.target.name];
        resetError(input);
        if (isRequired(input)) {
          handleErrorValidation(input, "Ce champs ne peut pas être vide.");
        }
        validateInput(input);
      });
    });
  };

  const validateForm = () => {
    hasError = false;
    for (const name in formData) {
      let input = formData[name];
      resetError(input);

      if (isRequired(input)) {
        handleErrorValidation(input, "Ce champs ne peut pas être vide.");
        hasError = true;
        continue;
      }

      if (!validateInput(input) && !hasError) {
        hasError = true;
      }
    }

    // Start inline validation
    inlineValidation();

    return !hasError;
  };

  const validateInput = (input) => {
    const name = input.name;
    const value = input.value;
    if ((name === "first" || name === "last") && !isValidName(value)) {
      handleErrorValidation(input, "Nom invalide : minimum 2 caractères et caractères spéciaux non autorisés.",);
      return false;
    } else if (name === "email" && !isValidEmail(value)) {
      handleErrorValidation(input, "Adresse e-mail invalide. Veuillez entrer une adresse e-mail valide.",);
      return false;
    }
    return true;
  };

  // Functions to validate input values
  const isValidEmail = (value) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value);
  };

  const isValidName = (value) => {
    const regex = /^(?!.*[.'-]{2})[a-zA-Z][a-zA-Z ,.'-]+$/;
    return regex.test(value);
  };

  const isRequired = (input) => {
    return input.required && !input.value;
  };

  const getInputWrapper = (input) => {
    return input.closest(".formInput");
  };

  // Function to display an error message below the input
  const handleErrorValidation = (input, message) => {
    const inputWrapper = getInputWrapper(input);
    const errorElement = inputWrapper.querySelector(".validation-error");
    inputWrapper.dataset.error = "true";
    if (errorElement) {
      errorElement.innerText = String(message);
    }
  };

  // Function to remove an error
  const resetError = (input) => {
    const wrapper = getInputWrapper(input);
    wrapper.dataset.error = "false";
  };

  const shaker = document.querySelector(".modal");
  // Function to trigger a shake animation if there's an error in the form
  const errorSubmit = () => {
    shaker.classList.add("shake");
    setTimeout(() => {
      shaker.classList.remove("shake");
    }, 1000);
  };

  // Function to display a success validation message and close the modal
  const displaySuccessMessage = () => {
    form.style.display = "none";
    let successMessage = "Merci pour votre message";
    let successDom = document.createElement("p");
    successDom.classList.add("successMessage");
    successDom.innerText = successMessage;
    modalWrapper.append(successDom);
    successDom.animate({
      opacity: [0, 1], transform: ["translateY(70px)", "translateY(0)"],
    }, {
      duration: 400, iterations: 1, easing: "ease-in-out",
    },);
    setTimeout(() => {
      let result = [];
      for (const [name, input] of Object.entries(formData)) {
        result[name] = input.value;
        input.removeAttribute("value");
        getInputWrapper(input).removeAttribute("data-error");
      }

      console.log(result);
      modalWrapper.removeChild(successDom);
      form.style.display = "flex";
      close();
    }, 2000);

  };

  return {close, open,};

};

