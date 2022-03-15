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

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
}

class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }

  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevation = elevationGain;
    this.calcSpeed();
  }

  calcSpeed() {
    // km/hr
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

const run1 = new Running([39, -12], 5, 24, 188) 
const cycle1 = new Cycling([39, -12], 38, 90, 523)
console.log(run1, cycle1);

// ******************* APPLICATION ARCHITECTURE ******************* //
class App {
  #map;
  #mapEvent;
  
  constructor() {
    this._getPosition();

    // Event listener: User pressing enter to submit form to create a new workout
    // Since the this keyword for _newWorkout will point to the form, we need to bind to the object itself 
    form.addEventListener("submit", this._newWorkout.bind(this));

    // Event listener: Switches form input type when switching between running and cycling
    inputType.addEventListener("change", this._toggleElevationField);
  }

  _getPosition() {
    // Geolocation API
    navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {
        alert("Could not get your position");
      }
    );
  }

  _loadMap(position) {
      // creating a variable out of the latitude property out of the coords object
      const { latitude } = position.coords;
      const { longitude } = position.coords;

      const coords = [latitude, longitude];

      this.#map = L.map("map").setView(coords, 13.5);

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
      ).addTo(this.#map);

      // Handling clicks on map
      this.#map.on("click", this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove("hidden");
    inputDistance.focus(); // focuses on the distance form as soon as the user clicks the map
  }

  _toggleElevationField() {
          // toggling the hidden class on the .form__row parent of inputElevation and inputCadence
          inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
          inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }

  _newWorkout(e) {
    // Prevents page from reloading when form is submitted
    e.preventDefault();

    // Resets input fields
    form.reset();

    // Display marker
    const { lat, lng } = this.#mapEvent.latlng;

    L.marker([lat, lng])
      .addTo(this.#map)
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
    }
}

// Creating a new object to trigger the constructor function and _getPosition() and _loadMap(position)
const app = new App();