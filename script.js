"use strict";

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

// Creating a global variable for map and mapEvent
let map, mapEvent;

// Geolocation API
navigator.geolocation.getCurrentPosition(
  function (position) {
    // creating a variable out of the latitude property out of the coords object
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    const coords = [latitude, longitude];

    map = L.map("map").setView(coords, 13.5);

    L.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken:
          "pk.eyJ1IjoieHl6dWthIiwiYSI6ImNsMHJnMWZwajAzMmUzZHFwd2tpOHByeHkifQ.HOCAEgTtij9iRnK77Fn1BA",
      }
    ).addTo(map);

    // Handling clicks on map
    map.on("click", function (mapE) {
      mapEvent = mapE;
      form.classList.remove("hidden");
      inputDistance.focus(); // focuses on the distance form as soon as the user clicks the map
    });
  },
  function () {
    alert("Could not get your position");
  }
);

// Event listener: User pressing enter to submit form
form.addEventListener("submit", function (e) {
  // Prevents page from reloading when form is submitted
  e.preventDefault();

  // Resets input fields
  form.reset();

  // Display marker
  console.log(mapEvent);
  const { lat, lng } = mapEvent.latlng;

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: "running-popup",
      })
    )
    .setPopupContent("Workout")
    .openPopup();
});

// Event listener: Switches form input type when switching between running and cycling
inputType.addEventListener('change', function() {
  // toggling the hidden class on the .form__row parent of inputElevation and inputCadence
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
})