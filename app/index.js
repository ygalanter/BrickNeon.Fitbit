// importing libraries
import clock from "clock";
import document from "document";
import * as messaging from "messaging";
import * as fs from "fs";
import { me } from "appbit";
import {preferences} from "user-settings";
import dtlib from "../common/datetimelib";

// trying to get user settings if saved before
try {
  let json_object  = fs.readFileSync("json.txt", "json");
  dtlib.dowFormat = json_object.KEY_DOWFORMAT; // if found, reading day of the week format
} catch (e) {
  dtlib.dowFormat = dtlib.DOWFORMAT_SHORT;  // otherwise using short day of the week as default
}

// reading time format preferemces
dtlib.timeFormat = preferences.clockDisplay == "12h" ? 1: 0;

// Update the clock every minute
clock.granularity = "minutes";

// Get a handle 3 textboxes that display time in "neon" effect
let lbltime1 = document.getElementById("lbltime1");
let lbltime2 = document.getElementById("lbltime2");
let lbltime3 = document.getElementById("lbltime3");

// Get a handle 3 textboxes that display day of the week in "neon" effect
let dow1 = document.getElementById("dow1");
let dow2 = document.getElementById("dow2");
let dow3 = document.getElementById("dow3");

// Get a handle 3 textboxes that display day of the date in "neon" effect
let day1 = document.getElementById("day1");
let day2 = document.getElementById("day2");
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
  lbltime1.text = `${hours}:${mins}`;
  lbltime2.text = lbltime1.text;
  lbltime3.text = lbltime1.text;
  
  // getting short name of the month in English
  let month = dtlib.getMonthNameShort(dtlib.LANGUAGES.ENGLISH, today.getMonth());
  
  // getting 0-preprended day of the month
  let day = dtlib.zeroPad(today.getDate())
  
  // assigning date to 3 textboxes for "neon" effect
  day1.text = `${month} ${day}`;
  day2.text = day1.text;
  day3.text = day1.text
  
  // getting day of the week
  let dow = today.getDay();
  
  // depending on user preferences assigning either short or long DOW in English
  if (dtlib.dowFormat == dtlib.DOWFORMAT_SHORT) {
     dow1.text = `${dtlib.getDowNameShort(dtlib.LANGUAGES.ENGLISH, dow)}`;
  } else {
     dow1.text = `${dtlib.getDowNameLong(dtlib.LANGUAGES.ENGLISH, dow)}`;
  }
  
  // adding "neon" effect
  dow2.text = dow1.text;
  dow3.text = dow1.text;
  
}

// Update the clock every tick event
clock.ontick = () => updateClock();

// Don't start with a blank screen
updateClock();


// Message is received
messaging.peerSocket.onmessage = evt => {
  
  // getting value of settings from the phone
  let value = JSON.parse(evt.data.newValue).values[0].value;
  
  switch (evt.data.key) {
      case dtlib.KEY_DOWFORMAT: // if this is DoW format - remember the value
          dtlib.dowFormat= value;
          break;
  };
  
  updateClock(); // and refresh the clock
      
}

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("App Socket Open");
};

// Message socket closes
messaging.peerSocket.close = () => {
  console.log("App Socket Closed");
};

// on app exit collect settings 
me.onunload = () => {
    let json_data = {
      "dowformat": dtlib.dowFormat
    };

    fs.writeFileSync("json.txt", json_data, "json");
}

