const contactModalTemplate = () => {
  const getContactModalDOM = async (parseStr = false) => {
    const cardHTML = `
       <div aria-hidden="true" id="contact_modal">
            <div aria-hidden="true" aria-labelledby="modalTitle" aria-modal="true" class="modal" role="dialog">
              <header>
                <h2 id="modalTitle">Contactez-moi</h2>
                <button aria-label="Close Contact form" class="modal-close-btn" type="button">
                  <img alt="modal" src="assets/icons/close.svg"/>
                </button>
              </header>
              <form class="modalForm"
                    method="post"
                    name="reserve"
                    novalidate>
                <div class="formInput">
                  <label for="first">
                    Prénom <span class="input-required">*</span>
                  </label>
                  <input class="text-control" id="first" minlength="2" name="first" required type="text"/>
                </div>
      
                <div class="formInput">
                  <label for="last">
                    Nom <span class="input-required">*</span>
                  </label>
                  <input class="text-control" id="last" minlength="2" name="last" required type="text"/>
                </div>
      
                <div class="formInput">
                  <label for="email">
                    Email <span class="input-required">*</span>
                  </label>
                  <input aria-label="Send" class="text-control" id="email" minlength="2" name="email" required type="email"/>
                </div>
      
                <div class="formInput">
                  <label for="message">
                    Votre message <span class="input-required">*</span>
                  </label>
                  <textarea class="text-control" id="message" minlength="2" name="message" required></textarea>
                </div>
                <button class="contact_button">Envoyer</button>
              </form>
            </div>
          </div>
  `;

    const parser = new DOMParser();
    const doc = parser.parseFromString(cardHTML, "text/html");
    return doc.body.firstChild;
  };

  return { getContactModalDOM };
};
