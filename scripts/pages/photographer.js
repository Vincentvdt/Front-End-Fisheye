const params = new URL(document.location).searchParams;
const id = params.get("id");

const getPhotographer = async (id) => {
  const response = await fetch("../../data/photographers.json");
  const data = await response.json();

  return data.photographers.find(
    (photograph) => photograph.id === parseInt(id)
  );
};

getPhotographer(id)
  .then((photographer) => {
    console.log(photographer);
  })
  .catch((error) => {
    console.error(error);
  });
