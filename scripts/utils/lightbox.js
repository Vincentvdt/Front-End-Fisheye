const openLightbox = (index) => {
  const modal = document.querySelector(".lightbox-modal");
  displayImage(index).then(() => displayModal(modal));
};

const closeLightbox = () => {
  const modal = document.querySelector(".lightbox-modal");
  closeModal(modal);
};

const displayImage = async (index) => {
  const modal = document.querySelector(".lightbox-modal");
  const lightImage = modal.querySelector(".carousel-gallery");
  const lightTitle = modal.querySelector(".carousel-img_title");
  lightImage.innerHTML = "";

  const currentMedia = medias[index];
  let elem = null;

  if (currentMedia.image) {
    const imgElem = document.createElement("img");
    imgElem.className = "carousel-item";
    imgElem.src = `assets/medias/${currentMedia.image}`;
    imgElem.alt = currentMedia.title;
    elem = imgElem;
  } else if (currentMedia.video) {
    const videoElem = document.createElement("video");
    videoElem.className = "carousel-item";
    videoElem.src = `assets/medias/${currentMedia.video}`;
    videoElem.controls = true;
    elem = videoElem;
  }

  lightTitle.textContent = currentMedia.title;
  lightImage.appendChild(elem);
};
