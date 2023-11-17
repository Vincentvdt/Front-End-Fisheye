// eslint-disable-next-line no-unused-vars
const lightboxModalTemplate = () => {
  const getLightboxModalDOM = async () => {
    const cardHTML = `
      <div aria-describedby="lightboxTitle" aria-hidden="true" class="lightbox-modal" role="dialog">
        <div aria-label="image closeup view" class="lightbox">
          <button aria-label="Close dialog" class="close-lightbox_btn">
            <svg fill="none" height="72" viewBox="0 0 72 72" width="72" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M57 19.23L52.77 15L36 31.77L19.23 15L15 19.23L31.77 36L15 52.77L19.23 57L36 40.23L52.77 57L57 52.77L40.23 36L57 19.23Z"
                  fill="#911C1C"/>
            </svg> 
          </button>
          <div class="lightbox-carousel">
            <a aria-label="Previous image" class="carousel-arrow arrow-prev" href="">
              <svg fill="none" height="96" viewBox="0 0 96 96" width="96" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_120_800)">
                  <path d="M61.6399 66.36L43.3199 48L61.6399 29.64L55.9999 24L31.9999 48L55.9999 72L61.6399 66.36Z"
                        fill="#911C1C"/>
                </g> 
                <defs>
                  <clipPath id="clip0_120_800">
                    <rect fill="white" height="96" transform="translate(96) rotate(90)" width="96"/>
                  </clipPath>
                </defs>
              </svg>
            </a>
            <div class="carousel-content">
              <div class="carousel-gallery">
              </div>
              <h2 class="carousel-img_title" id="lightboxTitle">Title</h2>
            </div>
            <a aria-label="Next image" class="carousel-arrow arrow-next" href="">
              <svg fill="none" height="96" viewBox="0 0 96 96" width="96" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_120_803)">
                  <path d="M34.3601 29.64L52.6801 48L34.3601 66.36L40.0001 72L64.0001 48L40.0001 24L34.3601 29.64Z"
                        fill="#911C1C"/>
                </g>
                <defs>
                  <clipPath id="clip0_120_803">
                    <rect fill="white" height="96" transform="translate(0 96) rotate(-90)" width="96"/>
                  </clipPath>
                </defs>
              </svg>
            </a>
          </div>
        </div>
      </div>
  `;

    const parser = new DOMParser();
    const doc = parser.parseFromString(cardHTML, "text/html");
    return doc.body.firstChild;
  };

  return {getLightboxModalDOM};
};
