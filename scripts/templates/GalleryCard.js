const galleryCardTemplate = (card) => {
  const { id, photographerId, title, image, video, likes, date, price } = card;
  const resWidth = "350";
  const resHeight = "300";

  let path = "";
  let media = "";

  if (image) {
    path = `../../assets/medias/${resWidth}x${resHeight}-${image}`;
    media = `<img alt="${title}" src="${path}">`;
  } else if (video) {
    path = `../../assets/medias/${video}`;
    media = `<video controls>
                  <source src="${path}" type="video/mp4"/>
               </video>`;
  }

  const getGalleryCardDOM = async () => {
    const cardHTML = `
    <article id="${photographerId}-${id}" class="gallery-card">
      <a href="#" class="gallery-card__media">
        ${media}
      </a>
      <div class="gallery-card__description">
        <h3 class="gallery-card__title">${title}</h3>
        <div class="gallery-card__likes">
          <p>${likes}</p>
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
  return { getGalleryCardDOM };
};
