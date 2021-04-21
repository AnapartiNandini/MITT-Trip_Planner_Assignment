let mapboxApiKey = "pk.eyJ1IjoibmFuZGluaS1hIiwiYSI6ImNrbW1iN2xqdjFqYmYycG80bmo2bDYwN24ifQ.GQN5FI2XaZYpt8KKxYcMQQ";
let transitApiKey = "p7qbH-VgW-2M5BRlkbwv";
let originForm = document.querySelector(".origin-form");
let originInput = document.querySelector(".origin-form input");
let destinationForm = document.querySelector(".destination-form");
let destinationInput = document.querySelector(".destination-form input");
let origins = document.querySelector(".origins");
let destinations = document.querySelector(".destinations");
let planTripBtn = document.querySelector(".plan-trip");
let myTrip = document.querySelector(".my-trip");
let originLong;
let originLat;
let destinationLong;
let destingationLat;
origins.innerHTML = "";
destinations.innerHTML = "";
myTrip.innerHTML = "";

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

planTripBtn.onclick = function () {
  if (originLong !== null && originLat !== null && destinationLong !== null && destingationLat !== null) {
    getRoute(originLong, originLat, destinationLong, destinationLat);
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

  origins.onclick = e => {
    let originElement = e.target.closest('li');
    if (originElement !== null) {
      originElement.className = "selected";
      originLong = originElement.dataset.long;
      originLat = originElement.dataset.lat;
    }
  }
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

  destinations.onclick = e => {
    let destinationElement = e.target.closest('li');
    if (destinationElement !== null) {
      destinationElement.className = "selected";
      destinationLong = destinationElement.dataset.long;
      destinationLat = destinationElement.dataset.lat;
    }
  }
}

async function getRoute(originLong, originLat, destinationLong, destinationLat) {
  const routeResponse = await fetch(`https://api.winnipegtransit.com/v2/trip-planner.json?api-key=${transitApiKey}&origin=geo/${originLat},${originLong}&destination=geo/${destinationLat},${destinationLong}`);
  const routeData = await routeResponse.json();
  let hourArray = [];
  let minutesArray = [];
  let durationsArray = [];
  let minHour;
  let minMinutes;
  let minDuration;

  routeData.plans.forEach(route => {
    let date = new Date(route.times.end);
    let hours = date.getHours();
    let minutes;
    if (hours === minHour) {
      minutes = date.getMinutes();
      minutesArray.push(minutes);
    }
    hourArray.push(hours);
  });

  minHour = Math.min(...hourArray);
  console.log(minHour);

  routeData.plans.forEach(route => {
    let date = new Date(route.times.end);
    let hours = date.getHours();
    let minutes;
    if (hours === minHour) {
      minutes = date.getMinutes();
      minutesArray.push(minutes);
    }
  });

  minMinutes = Math.min(...minutesArray);
  console.log(minMinutes);

  routeData.plans.forEach(route => {
    let date = new Date(route.times.end);
    let hours = date.getHours();
    let minutes;
    let durations;
    if (hours === minHour) {
      minutes = date.getMinutes();
      if (minMinutes === minMinutes) {
        durations = route.times.durations.total;
        durationsArray.push(durations);
      }
    }
  });

  minDuration = Math.min(...durationsArray);
  console.log(minDuration);

  routeData.plans.forEach(route => {
    let date = new Date(route.times.end);
    let hours = date.getHours();
    let minutes;
    let durations;
    let getSegmentDuration;
    let icon;
    let stepInfo;

    if (hours === minHour) {
      minutes = date.getMinutes();
      if (minMinutes === minMinutes) {
        durations = route.times.durations.total;
        if (durations === minDuration) {
          let startDate = new Date(route.times.start);
          let startHour = startDate.getHours();
          let startTime;
          let endTime;

          if (startHour <= 12) {
            startTime = `${startHour}:${startDate.getMinutes()}:${startDate.getSeconds()} AM`;
          } else {
            startTime = `${startHour - 12}:${startDate.getMinutes()}:${startDate.getSeconds()} PM`;
          }

          if (hours <= 12) {
            endTime = `${hours}:${date.getMinutes()}:${date.getSeconds()} AM`;
          } else {
            endTime = `${hours - 12}:${date.getMinutes()}:${date.getSeconds()} PM`;
          }

          let myTripText = "";

          //<li><span class="material-icons">exit_to_app</span> Depart at ${startTime}.</li>

          route.segments.forEach(segment => {
            getSegmentDuration = segment.times.durations.total

            if (segment.type === "walk") {
              icon = `<span class="material-icons">directions_walk</span>`;

              if (segment.to.stop !== null) {
                stepInfo = `Walk for ${getSegmentDuration} minutes to stop #${segment.to.stop.key.value} - ${segment.to.stop.name}`
              } else if (segment.to.stop === null && segment.to.destination !== null) {
                stepInfo = `Walk for ${getSegmentDuration} to your destination, arriving at ${endTime}`;
              }

            } else if (segment.type === "ride") {
              icon = `<span class="material-icons">directions_bus</span>`;
              stepInfo = `Ride the ${segment.route.name} for ${getSegmentDuration} minutes`;
            } else if (segment.type === "transfer") {
              icon = `<span class="material-icons">transfer_within_a_station</span>`;
              stepInfo = `Transfer from stop #${segment.from.stop.key} - ${segment.from.stop.name} to stop #${segment.to.stop.key} - ${segment.to.stop.name}`;
            }

              myTripText += `<li>${icon}${stepInfo}<li>`;
          });
          console.log(myTripText);
          myTrip.innerHTML = myTripText;
        }
      }
    }
  });

  // let date = new Date("2021-04-19T20:12:00");
  // let time = date.getHours();
  console.log(routeData);
  // console.log(time);
}