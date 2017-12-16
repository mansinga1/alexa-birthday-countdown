/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 **/

"use strict";
const Alexa = require("alexa-sdk");
const differenceInCalendarDays = require("date-fns/differenceInCalendarDays");
const parse = require("date-fns/parse");

const APP_ID = "";

const SKILL_NAME = "Geburtstags Countdown";
const BIRTHDAY_COUNTDOWN_MESSAGE = "Dein Geburtstag ist in ";
const HELP_MESSAGE =
  "Geburtstags Countdown kann dir sagen in wie vielen Tagen du Geburtstag hast. Willst du wissen wie viele Tage es noch bis zu deinem Geburtstag sind?";
const REPROMPT = "Wann hast du Geburtstag?";
const STOP_MESSAGE = "Tschüss!";

exports.handler = function(event, context, callback) {
  const alexa = Alexa.handler(event, context);
  alexa.appId = APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
};

const handlers = {
  LaunchRequest: function() {
    this.response.speak(REPROMPT).listen(REPROMPT);
    this.emit(":responseReady");
  },
  GeburtstagCountdownIntent: function() {
    const filledSlots = delegateSlotCollection.call(this);
    const birthday = this.event.request.intent.slots.birthday.value;
    const now = new Date();

    const parsedBirthday = parse(birthday, "YYYY-MM-DD", now);
    const days = differenceInCalendarDays(parsedBirthday, now);

    const speechOutput = "Dein Geburtstag ist also am " + birthday + ". ";
    let daysSentence;

    if (days === 0) {
      daysSentence = "Du hast heute Geburtstag. Alles Gute!";
    } else if (days == 1) {
      daysSentence = "Du hast morgen Geburtstag.";
    } else if (days > 1) {
      daysSentence = "Du hast in " + days + " Tagen Geburtstag.";
    } else if (days < 0) {
      daysSentence = "Du hattest vor " + days * -1 + " Tagen Geburtstag.";
    }

    this.response.speak(speechOutput + daysSentence);
    this.emit(":responseReady");
  },
  Unhandled: function() {
    this.emit(":ask", "Ich verstehe leider nicht was du gesagt hast.");
  },
  "AMAZON.HelpIntent": function() {
    this.response.speak(HELP_MESSAGE).listen(REPROMPT);
    this.emit(":responseReady");
  },
  "AMAZON.CancelIntent": function() {
    this.response.speak(STOP_MESSAGE);
    this.emit(":responseReady");
  },
  "AMAZON.StopIntent": function() {
    this.response.speak(STOP_MESSAGE);
    this.emit(":responseReady");
  },
  "AMAZON.YesIntent": function() {
    this.response.speak(REPROMPT).listen(REPROMPT);
    this.emit(":responseReady");
  },
  "AMAZON.NoIntent": function() {
    this.response.speak("Alles klar!");
    this.emit(":responseReady");
  },
  SessionEndedRequest: function() {
    console.log("session ended!");
  }
};

function delegateSlotCollection() {
  console.log("in delegateSlotCollection");
  console.log("current dialogState: " + this.event.request.dialogState);
  if (this.event.request.dialogState === "STARTED") {
    console.log("in Beginning");
    const updatedIntent = this.event.request.intent;
    //optionally pre-fill slots: update the intent object with slot values for which
    //you have defaults, then return Dialog.Delegate with this updated intent
    // in the updatedIntent property
    this.emit(":delegate", updatedIntent);
  } else if (this.event.request.dialogState !== "COMPLETED") {
    console.log("in not completed");
    // return a Dialog.Delegate directive with no updatedIntent property.
    this.emit(":delegate");
  } else {
    console.log("in completed");
    console.log("returning: " + JSON.stringify(this.event.request.intent));
    // Dialog is now complete and all required slots should be filled,
    // so call your normal intent handler.
    return this.event.request.intent;
  }
}
