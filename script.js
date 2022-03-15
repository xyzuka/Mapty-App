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

// Geolocation API
navigator.geolocation.getCurrentPosition(
  function (position) {
    // creating a variable out of the latitude property out of the coords object
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    const coords = [latitude, longitude];

    const map = L.map("map").setView(coords, 13.5);

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
      
    // event listener for leaflet library
    map.on('click', function(mapEvent) {
      console.log(mapEvent);
        const {lat, lng} = mapEvent.latlng;
        
        L.marker([lat, lng])
        .addTo(map)
        .bindPopup(L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: 'running-popup',
        }))
        .setPopupContent('Workout')
        .openPopup();

    })
  },
  function () {
    alert("Could not get your position");
  }
);
