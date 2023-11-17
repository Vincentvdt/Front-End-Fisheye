// eslint-disable-next-line no-unused-vars
const _lightbox = (_medias) => {
  const lightboxDOM = document.querySelector(".lightbox-modal");
  // eslint-disable-next-line no-undef
  const modal = _modal(lightboxDOM);
  let index = 0;
  let medias = _medias;
  const arrowRight = document.querySelector(".carousel-arrow.arrow-next");

  const nextImage = async (e) => {
    e.preventDefault();
    if (index === medias.length - 1) {
      index = 0;
    } else {
      index++;
    }
    await displayImage();
  };

  const previousImage = async (e) => {
    e.preventDefault();
    if (index === 0) {
      index = medias.length - 1;
    } else {
      index--;
    }
    await displayImage();
  };

  const open = (_index) => {
    index = Number(_index);
    displayImage()
      .then(() => {
        modal.show();
        document.activeElement.blur();
        arrowRight.focus();
        document.addEventListener("keydown", setNavigation);
      });

  };

  const close = () => {
    modal.hide();
    document.removeEventListener("keydown", setNavigation);
  };

  const displayImage = async () => {
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
      videoElem.setAttribute("aria-label", currentMedia.title);
      elem = videoElem;
    }

    lightTitle.textContent = currentMedia.title;
    lightImage.appendChild(elem);
  };

  const setNavigation = async (e) => {
    if (e.code === "ArrowLeft") {
      await previousImage(e);
    } else if (e.code === "ArrowRight") {
      await nextImage(e);
    }
  };

  const prevBtn = lightboxDOM.querySelector(".carousel-arrow.arrow-prev");
  const nextBtn = lightboxDOM.querySelector(".carousel-arrow.arrow-next");

  prevBtn.addEventListener("click", previousImage);
  nextBtn.addEventListener("click", nextImage);

  return {
    open,
    close
  };

};