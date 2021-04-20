let mapboxApiKey = "pk.eyJ1IjoibmFuZGluaS1hIiwiYSI6ImNrbW1iN2xqdjFqYmYycG80bmo2bDYwN24ifQ.GQN5FI2XaZYpt8KKxYcMQQ";
let originForm = document.querySelector(".origin-form");
let originInput = document.querySelector(".origin-form input");
let destinationForm = document.querySelector(".destination-form");
let destinationInput = document.querySelector(".destination-form input");
let origins = document.querySelector(".origins");
let destinations = document.querySelector(".destinations");
origins.innerHTML = "";
destinations.innerHTML = "";

originForm.onsubmit = e => {
  e.preventDefault();
  if (originInput.value.length > 0) {
    getOriginLocations(originInput.value);
  }
}

originForm.onclick = function () {
  if (originInput.value.length > 0) {
    origins.innerHTML = "";
    originInput.value = "";
  }
}

destinationForm.onsubmit = e => {
  e.preventDefault();
  if (destinationInput.value.length > 0) {
    getDestinationLocations(destinationInput.value);
  }
}

destinationForm.onclick = function () {
  if (originInput.value.length > 0) {
    destinations.innerHTML = "";
    destinationInput.value = "";
  }
}

async function getOriginLocations(searchedOrigin) {
  const originResponse = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchedOrigin}.json?bbox=-97.325875,49.766204,-96.953987,49.99275&access_token=${mapboxApiKey}`);
  const originData = await originResponse.json();
  originData.features.forEach(originLocation => {
    let originPlaceNameData = originLocation.place_name.split(", ");
    let originLocationName = originPlaceNameData[0];
    let originLocationAddress = originPlaceNameData[1];

    origins.insertAdjacentHTML("afterbegin", `
      <li data-long="${originLocation.geometry.coordinates[0]}" data-lat="${originLocation.geometry.coordinates[1]}">
      <div class="name">${originLocationName}</div>
      <div>${originLocationAddress}</div>
      </li>
    `);
  });
}

async function getDestinationLocations(searchedDestination) {
  const destinationResponse = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchedDestination}.json?bbox=-97.325875,49.766204,-96.953987,49.99275&access_token=${mapboxApiKey}`);
  const destinationData = await destinationResponse.json();
  destinationData.features.forEach(destinationLocation => {
    let destinationPlaceNameData = destinationLocation.place_name.split(", ");
    let destinationLocationName = destinationPlaceNameData[0];
    let destinationLocationAddress = destinationPlaceNameData[1];

    destinations.insertAdjacentHTML("afterbegin", `
    <li data-long="${destinationLocation.geometry.coordinates[0]}" data-lat="${destinationLocation.geometry.coordinates[1]}">
    <div class="name">${destinationLocationName}</div>
    <div>${destinationLocationAddress}</div>
  </li>
    `);
  });
}