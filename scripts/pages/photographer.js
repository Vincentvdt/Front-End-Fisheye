const gallery = document.querySelector(".gallery");
const select = document.getElementById("mediasFilter");

let medias = null;
let photographer = null;

const params = new URL(document.location).searchParams;
const id = params.get("id");
const fetchData = async (url) => {
  const res = await fetch(url);
  return await res.json();
};

const main = async () => {
  const datas = await fetchData("../../data/photographers.json");
  const getPhotographerByID = async (id) => {
    if (!photographer) {
      photographer = datas.photographers.find(
        (photograph) => photograph.id === parseInt(id)
      );
    }
    return photographer;
  };

  const getMedias = async (id) => {
    if (!medias) {
      medias = datas.media.filter(
        (media) => media.photographerId === parseInt(id)
      );
    }
    return medias;
  };

  const getGalleryCardDom = async (card) => {
    const resWidth = "350";
    const resHeight = "300";

    let path = "";
    let media = "";

    if (card.image) {
      path = `../../assets/medias/${resWidth}x${resHeight}-${card.image}`;
      media = `<img alt="${card.title}" src="${path}">`;
    } else if (card.video) {
      path = `../../assets/medias/${card.video}`;
      media = `<video controls>
                  <source src="${path}" type="video/mp4"/>
               </video>`;
    }

    const cardHTML = `
    <article id="${card.photographerId}-${card.id}" class="gallery-card">
      <a href="#" class="gallery-card__media">
        ${media}
      </a>
      <div class="gallery-card__description">
        <h3 class="gallery-card__title">${card.title}</h3>
        <div class="gallery-card__likes">
          <p>${card.likes}</p>
          <svg fill="none" height="19" viewBox="0 0 19 19" width="19" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 18.85L8.23125 17.53C3.725 12.86 0.75 9.78 0.75 6C0.75 2.92 2.8675 0.5 5.5625 0.5C7.085 0.5 8.54625 1.31 9.5 2.59C10.4538 1.31 11.915 0.5 13.4375 0.5C16.1325 0.5 18.25 2.92 18.25 6C18.25 9.78 15.275 12.86 10.7687 17.54L9.5 18.85Z" fill="#911C1C"/>
          </svg>
        </div>
      </div>
    </article>
  `;

    const parser = new DOMParser();
    const doc = parser.parseFromString(cardHTML, "text/html");
    return doc.body.firstChild;
  };

  const populatePhotographHeader = (photographer) => {
    const picture = `../assets/photographers/${photographer.portrait}`; // Modifié le chemin d'accès

    const headerElement = document.querySelector(".photograph-header");
    const nameElem = document.querySelector(".photograph-header__name");
    const locationElem = document.querySelector(".photograph-header__location");
    const taglineElem = document.querySelector(".photograph-header__tagline");
    const imgElem = document.querySelector(
      ".photograph-header__profile-wrapper img"
    );

    headerElement.classList.remove("await");
    nameElem.textContent = photographer.name;
    locationElem.textContent = `${photographer.city}, ${photographer.country}`;
    taglineElem.textContent = photographer.tagline;
    imgElem.src = picture;
    imgElem.alt = photographer.name;
  };

  const filterBy = (medias, sortType) => {
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
  };

  const sortMedia = async () => {
    filterBy(medias, select.value);
    await displayGallery(medias);
  };

  const displayGallery = async (medias) => {
    gallery.innerHTML = "";
    for (const [index, media] of Object.entries(medias)) {
      const mediaDom = await getGalleryCardDom(media);
      gallery.appendChild(mediaDom);
      console.log(index);
    }
  };

  await getPhotographerByID(id);
  await getMedias(id);

  populatePhotographHeader(photographer);
  await sortMedia();
};

main();
