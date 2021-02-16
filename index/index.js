// WEATHER NOW
let submit = document.getElementById("submit");
let eachTag = document.getElementById("eachTag");
let inputForm = document.getElementById("input");
// inputForm.addEventListener("keyup", function (event) {
//   if (event.keyCode == 13) {
//     event.preventDefault();
//     SubMit();
//   }
// });
function SubMit(city) {
  let input = document.getElementById("input").value;
  // console.log(city);
  if (input == "" && city == undefined) {
    alert("Please give the name of city !");
  } else if (input !== "" && city == undefined) {
    createTag(input);
  } else if (city !== undefined) {
    createTag(city);
  }
}
function createTag(input) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=ffb53bbdace7d0b05094aef809bd2445`
  )
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      document.getElementById("Temperature").innerHTML = `${(
        data.main.temp - 273
      ).toFixed(2)}°C`;
      document.getElementById("Cloud").innerHTML = String(
        data.weather[0].description
      );
      document.getElementById("Cloud").style.textTransform = "Capitalize";
      document.getElementById("Humid").innerHTML = `${data.main.humidity}%`;
      document.getElementById(
        "Pressure"
      ).innerHTML = `${data.main.pressure} hPa`;
      document.getElementById(
        "location"
      ).innerHTML = `${data.name} (${data.sys.country})`;
    });
}
SubMit("Saigon");
// TIME
setInterval(function () {
  let date = new Date();
  document.getElementById("Hour").innerHTML = date.getHours();
  document.getElementById("Minute").innerHTML = date.getMinutes();
  document.getElementById("Second").innerHTML = date.getSeconds();
}, 1000);
