const params = new URL(document.location).searchParams;
const id = params.get("id");
const main = document.querySelector("main");
const body = document.querySelector("body");

const parseDOM = (htmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  return doc.body.firstChild;
};

const appendBody = (elem) => {
  const firstScript = document.querySelector("body script:first-of-type");
  body.insertBefore(elem, firstScript);
};

const photographePage = () => {
  let photographer = null;
  let medias = [];
  let totalLikes = 0;
  let visibleOptions = [];

  let filter = "popularity";
  const frTradMap = {
    popularity: "Popularité",
    date: "Date",
    title: "Titre",
  };

  let contact;
  let lightbox;
  let cards = [];

  const fetchPhotographerData = async id => {
    // eslint-disable-next-line no-undef
    const photographerServices = await photographerService();
    photographer = await photographerServices.getPhotographerByID(id);
    medias = await photographerServices.getMedias(id);
    medias.sort((a, b) => b.likes - a.likes);
  };
  const renderPhotographerPage = async () => {
    main.innerHTML = "";
    const photographerHeader = createPhotographerHeader();
    const photographerPortfolio = await createPhotographerPortfolio();
    const aside = createAsideInfos();
    const contactModalDOM = await createContactModal();
    const lightboxModalDOM = await createLightboxModal();

    main.appendChild(photographerHeader);
    main.appendChild(photographerPortfolio);
    await createPhotographerGallery();
    main.appendChild(aside);
    appendBody(contactModalDOM);
    appendBody(lightboxModalDOM);
    // eslint-disable-next-line no-undef
    contact = _contact();
    // eslint-disable-next-line no-undef
    lightbox = _lightbox(medias);
    initEventListeners();
  };
  const createPhotographerHeader = () => {
    const picture = `assets/photographers/${photographer.portrait}`;
    const htmlString = `
    <section class="photograph-header">
        <div class="photograph-header__content">
          <div class="photograph-header__infos">
            <h1 class="photograph-header__name">${photographer.name}</h1>
            <h2 class="photograph-header__location">${photographer.city}, ${photographer.country}</h2>
            <p class="photograph-header__tagline">${photographer.tagline}</p>
          </div>
          <button class="btn-contact" aria-label="Contact Me">Contactez-moi</button>
        </div>
        <div class="photograph-header__profile">
          <div class="photograph-header__profile-wrapper">
            <img alt="${photographer.name}" src="${picture}">
          </div>
        </div>
      </section>`;

    return parseDOM(htmlString);
  };
  const createPhotographerPortfolio = async () => {

    const htmlString = `
      <section class="portfolio">
        <div class="filters-wrapper" >
          <p class="filter-label">Trier par :</p>
            <div class="filter-selected" id="selectedInput" data-selected="${filter}" tabindex="0" aria-haspopup="listbox">
              <p>${frTradMap[filter] || filter}</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M22.12 11.4531L16 17.5598L9.88 11.4531L8 13.3331L16 21.3331L24 13.3331L22.12 11.4531Z" fill="red"/>
              </svg>
              <ul class="filter-options" role="listbox" aria-labelledby="selectedInput">
                <li class="filter-item" role="option" data-value="popularity" tabindex="1">Popularité</li>
                <li class="filter-item" role="option" data-value="date" tabindex="1">Date</li>
                <li class="filter-item" role="option" data-value="title" tabindex="1">Titre</li>
              </ul>
            </div>
        </div>
        <div class="gallery">
        
        </div>
      </section>
    `;

    return parseDOM(htmlString);
  };
  const createAsideInfos = () => {
    getTotalLikes();
    const htmlString = `
    <aside aria-hidden="false" class="tarif">
      <div class="totalLikes">
        <p>${totalLikes}</p>
        <svg fill="none" height="19" viewBox="0 0 18 19" width="18" xmlns="http://www.w3.org/2000/svg">
          <path
              d="M9.125 18.35L7.85625 17.03C3.35 12.36 0.375 9.28 0.375 5.5C0.375 2.42 2.4925 0 5.1875 0C6.71 0 8.17125 0.81 9.125 2.09C10.0787 0.81 11.54 0 13.0625 0C15.7575 0 17.875 2.42 17.875 5.5C17.875 9.28 14.9 12.36 10.3938 17.04L9.125 18.35Z"
              fill="black"/>
        </svg>
      </div>
      <div class="price">
        <p>${photographer.price || "-"}€ / jour</p>
      </div>
    </aside>
    `;

    return parseDOM(htmlString);
  };
  const createPhotographerGallery = async () => {
    cards = [];
    const gallery = document.querySelector(".gallery");
    for (const [index, media] of Object.entries(medias)) {
      // eslint-disable-next-line no-undef
      const galleryModel = galleryCardTemplate(media);
      const cardDOM = await galleryModel.getGalleryCardDOM();
      cardDOM.dataset.index = String(index);
      cardDOM.querySelector(".likeBtn").addEventListener("click", async (e) => {
        e.stopPropagation();
        const cardID = galleryModel.id;
        const post = medias.find((post) => post.id === cardID);

        if (post.liked) {
          post.liked = false;
          post.likes--;
          cardDOM.classList.remove("liked");
        } else {
          post.liked = true;
          post.likes++;
          cardDOM.classList.add("liked");
        }

        cardDOM.querySelector(".gallery-card__likes p").textContent =
          post.likes;
        const aside = main.querySelector(".tarif");
        aside.querySelector(".totalLikes p").textContent = getTotalLikes();
      });
      gallery.appendChild(cardDOM);
      cards.push(cardDOM);
    }

    cards.forEach(card => {
      card.addEventListener("click", (e) => {
        e.preventDefault();
        lightbox.open(card.dataset.index);
      });
    });
  };
  const createContactModal = () => {
    // eslint-disable-next-line no-undef
    const template = contactModalTemplate(photographer.name);
    return template.getContactModalDOM();
  };
  const createLightboxModal = () => {
    // eslint-disable-next-line no-undef
    const template = lightboxModalTemplate();
    return template.getLightboxModalDOM();
  };
  const getTotalLikes = () => {
    totalLikes = medias.reduce((a, b) => a + b.likes, 0);
    return totalLikes;
  };

  const selectNavigationHandler = () => {
    const filterBtn = document.querySelector(".filter-selected");
    const filtersOptions = filterBtn.querySelectorAll(".filter-item");
    const handleEscapeKey = () => {
      contact.close();
      lightbox.close();
      closeSelect();
    };

    const handleEnterKey = () => {
      const focusedElement = document.activeElement;
      if (focusedElement.classList.contains("filter-selected") && !filterBtn.classList.contains("open")) {
        toggleSelect();
      } else if (focusedElement.classList.contains("filter-item") && filterBtn.classList.contains("open")) {
        selectOption(focusedElement);
      } else if (focusedElement.classList.contains("likeBtn")) {
        console.log("like");
      }
    };

    const handleTabKey = () => {
      if (filterBtn.classList.contains("open")) {
        let activeElementIndex = visibleOptions.indexOf(document.activeElement);

        if (activeElementIndex + 1 >= visibleOptions.length) {
          activeElementIndex = 0;
        } else {
          activeElementIndex++;
        }

        // Use setTimeout to ensure focus takes effect
        setTimeout(() => {
          visibleOptions[activeElementIndex].focus();
        }, 0);
      }
    };

    const toggleOptions = () => {
      const selected = Array.from(filtersOptions).find(option => option.dataset.value === filter);
      filtersOptions.forEach(option => {
        option.style.display = option === selected ? "none" : "block";
        option === selected ? option.setAttribute("aria-selected", true) : option.removeAttribute("aria-selected");
      });
      visibleOptions = Array.from(filtersOptions).filter(option => option !== selected);
    };

    const toggleSelect = () => {
      if (filterBtn.classList.contains("open")) {
        // Close select
        closeSelect();
        toggleOptions();
        document.activeElement.blur();
        filterBtn.focus();
      } else {
        // Open Select
        openSelect();
      }
    };
    const selectOption = (option) => {
      filter = option.dataset.value;
      sortGallery().then(() => {
        document.querySelector(".filter-selected p").textContent = frTradMap[filter] || filter;
        toggleSelect();
      });
    };

    const getFocusableElements = () => {
      const focusableElementsString =
        "video, a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex=\"0\"], [contenteditable]";
      return document.querySelectorAll(focusableElementsString);
    };
    const openSelect = () => {
      const focusableElements = getFocusableElements();
      focusableElements.forEach((elem) => {
        if (!filterBtn.contains(elem)) {
          elem.setAttribute("tabindex", "-1");
        }
      });
      for (const element of body.children) {
        if (!filterBtn.contains(element) && element.tagName !== "SCRIPT") {
          element.setAttribute("aria-hidden", "true");
        }
      }
      filterBtn.removeAttribute("tabindex");
      filterBtn.setAttribute("aria-expanded", "");
      filtersOptions.forEach(option => {
        option.setAttribute("tabindex", "1");
        option.setAttribute("aria-hidden", "false");
      });
      filterBtn.classList.add("open");
      visibleOptions[0].focus();
    };
    const closeSelect = () => {
      const focusableElements = getFocusableElements();
      focusableElements.forEach((elem) => {
        if (!filterBtn.contains(elem)) {
          elem.removeAttribute("tabindex");
        }
      });
      for (const element of body.children) {
        if (!filterBtn.contains(element) && element.tagName !== "SCRIPT") {
          element.setAttribute("aria-hidden", "false");
        }
      }
      filterBtn.setAttribute("tabindex", "0");
      filterBtn.removeAttribute("aria-expanded");
      filtersOptions.forEach(option => {
        option.removeAttribute("tabindex");
        option.setAttribute("aria-hidden", "true");
      });
      filterBtn.classList.remove("open");
    };

    toggleOptions();

    filterBtn.addEventListener("click", toggleSelect);

    filtersOptions.forEach((option) => {
      option.addEventListener("click", (e) => {
        e.stopPropagation();
        selectOption(option);
      });
    });
    return {handleEscapeKey, handleEnterKey, handleTabKey};
  };

  const initEventListeners = () => {
    const openContactModalBtn = document.querySelector(".btn-contact");
    const closeContactModalBtn = document.querySelector(
      "#contact_modal .modal-close-btn"
    );
    const closeLightboxModalBtn = document.querySelector(".close-lightbox_btn");

    const {handleEscapeKey, handleEnterKey, handleTabKey} = selectNavigationHandler();

    const eventHandlers = {
      "Escape": handleEscapeKey,
      "Enter": handleEnterKey,
      "Tab": handleTabKey
    };

    openContactModalBtn.addEventListener("click", contact.open);
    closeContactModalBtn.addEventListener("click", contact.close);
    closeLightboxModalBtn.addEventListener("click", lightbox.close);
    document.addEventListener("keydown", e => {
      const handler = eventHandlers[e.key];
      if (handler) {
        handler();
      }
    });
  };

  const sortGallery = async () => {
    const gallery = document.querySelector(".gallery");
    const sortType = filter;
    medias.sort((a, b) => {
      switch (sortType) {
      case "date":
        return new Date(a.date) - new Date(b.date);
      case "popularity":
        return b.likes - a.likes;
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
      }
    });

    gallery.innerHTML = "";
    await createPhotographerGallery();
  };

  const init = async (id) => {
    await fetchPhotographerData(id);
    await renderPhotographerPage();
    return medias;
  };

  return {init};
};
const photographe = photographePage();

photographe.init(id).then(() => "success");

// TODO :
//  - Responsive


