// importing libraries
import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import dtlib from "../common/datetimelib";


let callback = (timestamp) => {
  document.getElementById('rotate').groupTransform.rotate.angle = timestamp % 60000 * 3 / 300;
  requestAnimationFrame(callback);
}
requestAnimationFrame(callback);


// reading time format preferemces
dtlib.timeFormat = preferences.clockDisplay == "12h" ? 1 : 0;

// Update the clock every minute
clock.granularity = "minutes";

let lbltime3 = document.getElementById("lbltime3");
let dow3 = document.getElementById("dow3");
let day3 = document.getElementById("day3");

// Clock tick
function updateClock() {
  // getting current date time
  let today = new Date();

  // formatting hours based on user preferences
  let hours = dtlib.format1224hour(today.getHours());

  // if this is 24H format - prepending 1-digit hours with 0
  if (dtlib.timeFormat == dtlib.TIMEFORMAT_24H) {
    hours = dtlib.zeroPad(hours);
  }

  // getting 0-preprended minutes
  let mins = dtlib.zeroPad(today.getMinutes());

  // assigning time to 3 textboxes for "neon" effect
  lbltime3.text = `${hours}:${mins}`;

  // getting short name of the month in English
  let month = dtlib.getMonthNameShort(dtlib.LANGUAGES.ENGLISH, today.getMonth());

  // getting 0-preprended day of the month
  let day = dtlib.zeroPad(today.getDate())

  // assigning date to 3 textboxes for "neon" effect
  day3.text = `${month} ${day}`;


  // getting day of the week
  let dow = today.getDay();

  dow3.text = `${dtlib.getDowNameShort(dtlib.LANGUAGES.ENGLISH, dow)}`;

}

// Update the clock every tick event
clock.ontick = () => updateClock();

// Don't start with a blank screen
updateClock();




