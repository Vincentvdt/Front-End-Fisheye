const _contact = () => {
  const contactDOM = document.querySelector("#contact_modal");
  const form = contactDOM.querySelector(".modalForm");
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

  return {close, open};

};

