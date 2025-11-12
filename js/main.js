//Search for cities starting with Lond:
// https://api.weatherapi.com/v1/search.json?key=90654e3fa1894e3fab0162052250811&q=lond
//To get current weather for London: JSON:
//  http://api.weatherapi.com/v1/current.json?key=90654e3fa1894e3fab0162052250811&q=London
//To get 7 day weather for US Zipcode 07112: JSON
//http://api.weatherapi.com/v1/forecast.json?key=90654e3fa1894e3fab0162052250811&q=cairo&days=7

const searchInputElem = document.getElementById("searchInput");
const currentDayDiv = document.getElementById("currentDay");
const mapFrame = document.getElementById("mapFrame");
const searchBtn = document.getElementById("searchBtn");
const loadingDiv = document.getElementById("loading");
const nextDaysDiv = document.getElementById("nextDays");
const forecastSammaryDiv = document.getElementById("forecastSammary");

let myHour12;
let today;
let todayNum;
let myMonth;
function getDate() {
  let dayObj = new Date();
  // console.log(dayObj);
  myHour12 = dayObj.toLocaleTimeString([], {
    hour: "2-digit",
  });
  // console.log(myHour12);
  today = dayObj.toLocaleDateString("en-GB", {
    weekday: "long",
  });
  todayNum = dayObj.toLocaleDateString("en-GB", {
    day: "2-digit",
  });
  myMonth = dayObj.toLocaleDateString("en-GB", {
    month: "long",
  });
  console.log(today, " today num ", todayNum, " My Month", myMonth);
}

////////////////////////////////////////////////////////
// let daysOfWeak = [
//   "Saturday",
//   "Sunday",
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
// ];
let forecastList = [];
let myAllData;

// function getForCastDays() {
//   for (let i = 0; i < daysOfWeak.length; i++) {
//     if (daysOfWeak[i].toLowerCase() === today.toLowerCase()) {
//       console.log("today is : ", daysOfWeak[i]);
//       tomorrowDay = daysOfWeak[++i];
//       console.log("Tomorrow : ", tomorrowDay);
//       afterTomorrow = daysOfWeak[++i];
//       console.log("after Tomorrow : ", afterTomorrow);
//     }
//   }
// }

// getForCastDays();
async function getCountry(country) {
  let res = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=90654e3fa1894e3fab0162052250811&q=${country}&days=3`
  );

  myAllData = await res.json();
  // console.log(myAllData, "My All Data");
  forecastList = myAllData.forecast.forecastday;
  console.log("ForCaaaaaaaaaaaaaast", forecastList);
  // console.log(myAllData.location.name);
  // console.log(myAllData.location.tz_id);
  // console.log(Math.ceil(forecastList.forecast.forecastday[0].day.maxtemp_c));
  await displayCurrentDay();
  await displaynextDays();
  loadingDiv.classList.replace("d-flex", "d-none");
}

searchInputElem.addEventListener("input", function () {
  getCountry(searchInputElem.value);
});

searchBtn.addEventListener("click", function () {
  console.log(searchInputElem.value);
  getCountry(searchInputElem.value);
});

async function displayCurrentDay() {
  let currentDayCartona = `
               <div class="card-header d-flex justify-content-between">
                        <span class="header-card-span">${today}</span>
                        <span class="header-card-span">${todayNum} ${myMonth}</span>
               </div>
              <div class="d-flex justify-content-between py-4 px-4">
                  <div class="about-loc">
                    <h2>${myAllData.location.name}</h2>
                    <span>${myHour12}</span>
                    <h3 class="mt-2">${myAllData.current.temp_c}°C</h3>
                    <span>${Math.ceil(
                      forecastList[0].day.maxtemp_c
                    )}/${Math.ceil(forecastList[0].day.mintemp_c)}°C</span>
                  </div>
                  <div class="about-shiny text-center">
                  
                    <img src="${
                      myAllData.current.condition.icon
                    }" alt="current-icon">
                  
                    <p >
                     ${myAllData.current.condition.text}
                    </p>
                  </div>
                </div>
                <div class="card-footer summary d-flex justify-content-evenly">
                  <div>
                  <i class="fa-solid fa-umbrella"></i>
                  ${forecastList[0].day.daily_chance_of_rain}%</div>
                  <div>
                  <i class="fa-solid fa-wind"></i>
                  ${Math.ceil(myAllData.current.wind_kph)}km/h</div>
                  <div>
                  <i class="fa-solid fa-location-crosshairs"></i>
                  ${myAllData.location.lon > 0 ? "East" : "West"}</div>
                </div>
                
                
                `;
  currentDayDiv.innerHTML = currentDayCartona;
  console.log(myAllData.location.lon);
  forMap(myAllData.location.name);
}

async function displaynextDays() {
  let nextDaysCartona = "";
  let forecastSammaryCartone = "";
  for (let i = 1; i < forecastList.length; i++) {
    let forecastDate = new Date(forecastList[i].date);
    let nextDayName = forecastDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    nextDaysCartona += `<div class="col">
                  <div class="inner">
                    <div class="card">
                      <div class="next-days text-center px-5 pt-3">
                         <img src="${
                           forecastList[i].day.condition.icon
                         }" alt="day-icon">
                        <p class="mt-2">${nextDayName}</p>
                        <h3 class="mt-3">${forecastList[i].day.maxtemp_c}°C</h3>
                        <span>${forecastList[i].day.mintemp_c}°C</span>
                        <p class="mt-2">${forecastList[i].day.condition.text
                          .split(" ", 2)
                          .join(" ")}</p>
                      </div>
                    </div>
                  </div>
                </div>`;

    forecastSammaryCartone += ` 
                 <div class="next-days text-center pt-3">
                    <p class="mt-2">${nextDayName}</p>
                     <img src="${forecastList[i].day.condition.icon}" alt="day-icon">
                    <p class="mt-3">${forecastList[i].day.maxtemp_c}/${forecastList[i].day.mintemp_c}°C</p>
                  </div>`;
  }

  nextDaysDiv.innerHTML = nextDaysCartona;
  forecastSammaryDiv.innerHTML = forecastSammaryCartone;
}

if (navigator.geolocation) {
  loadingDiv.classList.replace("d-none", "d-flex");

  getDate();
  navigator.geolocation.getCurrentPosition(function (pos) {
    let lat = pos.coords.latitude;
    let lon = pos.coords.longitude;
    let posCountry = lat + "," + lon;
    console.log(lon);

    // console.log(lat, lon);
    getCountry(posCountry);

    forMap(posCountry);
  });
}

function forMap(location) {
  mapFrame.setAttribute(
    "src",
    `https://www.google.com/maps?q=${encodeURIComponent(location)}
  &output=embed`
  );
}
