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

  let filter = null;
  let index = 0;

  const displayPhotographerPage = async (id) => {
    const photographerServices = await photographerService();
    photographer = await photographerServices.getPhotographerByID(id);
    medias = await photographerServices.getMedias(id);
    medias.sort((a, b) => b.likes - a.likes);

    await render();
  };

  const getTotalLikes = () => {
    totalLikes = medias.reduce((a, b) => a + b.likes, 0);
    return totalLikes;
  };

  const render = async () => {
    main.innerHTML = "";
    const photographerHeader = photographeHeader();
    const photographerPortfolio = await photographePortfolio();
    const aside = asideInfos();
    const contact = await contactModal();
    const lightbox = await lightboxModal();

    main.appendChild(photographerHeader);
    main.appendChild(photographerPortfolio);
    await photographerGallery();
    main.appendChild(aside);
    appendBody(contact);
    appendBody(lightbox);

    initEventListeners();
  };

  const asideInfos = () => {
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

  const photographeHeader = () => {
    const picture = `assets/photographers/${photographer.portrait}`;
    const htmlString = `
    <section class="photograph-header">
        <div class="photograph-header__content">
          <div class="photograph-header__infos">
            <h1 class="photograph-header__name">${photographer.name}</h1>
            <p class="photograph-header__location">${photographer.city}, ${photographer.country}</p>
            <p class="photograph-header__tagline"><${photographer.tagline}</p>
          </div>
          <button class="btn-contact">Contactez-moi</button>
        </div>
        <div class="photograph-header__profile">
          <div class="photograph-header__profile-wrapper">
            <img alt="${photographer.name}" src="${picture}">
          </div>
        </div>
      </section>`;

    return parseDOM(htmlString);
  };

  const photographePortfolio = async () => {
    const htmlString = `
      <section class="portfolio">
        <div class="filtersBtn" >
          <label for="mediasFilter">Trier par :</label>
          <select id="mediasFilter" name="medias">
            <option selected="selected" value="popularity">Popularité</option>
            <option value="date">Date</option>
            <option value="title">Titre</option>
          </select>
        </div>
        <div class="gallery"></div>
      </section>
    `;

    return parseDOM(htmlString);
  };
  const photographerGallery = async () => {
    const gallery = document.querySelector(".gallery");
    for (const [index, media] of Object.entries(medias)) {
      const galleryModel = galleryCardTemplate(media);
      const cardDOM = await galleryModel.getGalleryCardDOM();
      console.log(media.title, index);
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
    }

    const cards = gallery.querySelectorAll(".gallery-card");
    cardsEvent(cards);
  };

  const initEventListeners = () => {
    const lightboxPrevBtn = document.querySelector(
      ".carousel-arrow.arrow-prev"
    );
    const lightboxNextBtn = document.querySelector(
      ".carousel-arrow.arrow-next"
    );

    filter = document.querySelector("#mediasFilter");
    filter.addEventListener("change", () => void sortGallery());
    const openContactModalBtn = document.querySelector(".btn-contact");
    const closeContactModalBtn = document.querySelector(
      "#contact_modal .modal-close-btn"
    );
    openContactModalBtn.addEventListener("click", openContact);
    closeContactModalBtn.addEventListener("click", closeContact);

    const openLightboxModalBtn = document.querySelector(
      ".photograph-header__name"
    );
    const closeLightboxModalBtn = document.querySelector(
      ".lightbox-modal .close-lightbox_btn"
    );
    openLightboxModalBtn.addEventListener("click", openLightbox);
    closeLightboxModalBtn.addEventListener("click", closeLightbox);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeContact();
        closeLightbox();
      }
    });

    lightboxPrevBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (index === 0) {
        index = medias.length - 1;
      } else {
        index--;
      }
      displayImage(index);
    });
    lightboxNextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (index === medias.length - 1) {
        index = 0;
      } else {
        index++;
      }
      displayImage(index);
    });
  };

  const sortGallery = async () => {
    const gallery = document.querySelector(".gallery");
    const sortType = filter.value;
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
    await photographerGallery();
  };

  const cardsEvent = (cards) => {
    cards.forEach((card) => {
      card.addEventListener("click", (e) => {
        index = card.dataset.index;
        console.log(index);
        e.preventDefault();
        openLightbox(index);
      });
    });
  };
  const contactModal = () => {
    const template = contactModalTemplate();
    return template.getContactModalDOM();
  };

  const lightboxModal = () => {
    const template = lightboxModalTemplate();
    return template.getLightboxModalDOM();
  };

  const init = async (id) => {
    await displayPhotographerPage(id);
    return medias;
  };

  return { init };
};
const photographe = photographePage();
let medias = [];
photographe.init(id).then((_medias) => {
  medias = _medias;
});
