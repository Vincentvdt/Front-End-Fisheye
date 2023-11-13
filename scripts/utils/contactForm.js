// eslint-disable-next-line no-unused-vars
const _contact = () => {
  const contactDOM = document.querySelector("#contact_modal");
  const form = contactDOM.querySelector(".modalForm");
  // eslint-disable-next-line no-undef
  const modal = _modal(contactDOM);
  const open = () => {
    modal.show();
  };

  const close = () => {
    modal.hide();
  };

  contactDOM.addEventListener("submit", (e) => {
    e.preventDefault();
    let formData = new FormData(form);
    console.log(Object.fromEntries(formData));
    close();
  });

  return {close, open,};

};

