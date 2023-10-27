const photographerService = async () => {
  const res = await fetch("../../data/photographers.json");
  const data = await res.json();

  let medias = null;
  let photographer = null;

  const getAllPhotographers = async () => {
    return data.photographers;
  };

  const getPhotographerByID = async (id) => {
    const { photographers } = data;
    if (!photographer) {
      photographer = photographers.find(
        (photograph) => photograph.id === parseInt(id)
      );
    }
    return photographer;
  };

  const getMedias = async (id) => {
    if (!medias) {
      medias = data.media.filter(
        ({ photographerId }) => photographerId === parseInt(id)
      );
    }
    return medias;
  };

  const getPostByID = async (id) => {
    return medias.find((media) => media.id === parseInt(id));
  };

  return { getAllPhotographers, getPhotographerByID, getMedias, getPostByID };
};
