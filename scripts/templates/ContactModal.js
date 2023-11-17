// eslint-disable-next-line no-unused-vars
const contactModalTemplate = (photographerName) => {
  const getContactModalDOM = async () => {
    const cardHTML = `
      <div aria-hidden="true" id="contact_modal">
            <div aria-hidden="true" aria-labelledby="modalTitle" aria-modal="true" class="modal" role="dialog">
              <header>
                <h2 id="modalTitle">Contactez-moi ${photographerName}</h2>
                <button aria-label="Close Contact form" class="modal-close-btn" type="button">
                  <img alt="modal" src="../../assets/icons/close.svg"/>
                </button>
              </header>
              <form
                class="modalForm"
                method="post"
                name="reserve"
                novalidate>

              <div class="formInput">
                <label class="formLabel" for="first">
                  Prénom <span class="input-required">*</span>
                </label>
                <input class="text-control" id="first" minlength="2" name="first" required type="text" value="Jean"/>
                <span class="validation-error">Veuillez entrer 2 caractères valides ou plus.</span>
              </div>

              <div class="formInput">
                <label class="formLabel" for="last">
                  Nom <span class="input-required">*</span>
                </label>
                <input class="text-control" id="last" minlength="2" name="last" required type="text" value="Nebra"/>
                <span class="validation-error">Veuillez entrer 2 caractères valides ou plus.</span>
              </div>

              <div class="formInput">
                <label class="formLabel" for="email">
                  Email <span class="input-required">*</span>
                </label>
                <input class="text-control" id="email" minlength="2" name="email" required type="email" value="j.nebra@gmail.com"/>
                <span class="validation-error">Veuillez entrer un adresse email valide.</span>
              </div>
              
              <div class="formInput">
                <label class="formLabel" for="message">
                  Message <span class="input-required">*</span>
                </label>
                <input class="text-control" id="message" minlength="2" name="message" required type="text" value="Ceci est un text"/>
                <span class="validation-error">Veuillez entrer un adresse email valide.</span>
              </div>
              <button class="button btn-submit" type="submit">Envoyer</button>
            </form>
            </div>
          </div>
  `;

    const parser = new DOMParser();
    const doc = parser.parseFromString(cardHTML, "text/html");
    return doc.body.firstChild;
  };

  return {getContactModalDOM};
};
