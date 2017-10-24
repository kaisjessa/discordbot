/*
 * Discord Calendar Reminder Event Bot
 * THacks2 - Oct 21-22 2017
 * Kais, Andy, Zach, and...
 * A
 * N
 * S
 * H
 *
 */
var firebase = require('firebase').initializeApp({
  serviceAccount: "./THacksBot-6eff64e90619.json",
  databaseURL: "https://thacksbot.firebaseio.com/"

});


const Discord = require('discord.js');
const client = new Discord.Client();

var database = firebase.database();
// IMPORTANT: CHANGE THIS TO SERVER ID
// So that every server has their own list of events
// Instead of all the events being jumbled together
var serverId = 'events';
var ref = database.ref(serverId);

ref.on('value', gotData, errData);

function gotData(data) {
  events = data.val();
  keys = Object.keys(events);
  //console.log("something good happened Andy");
  console.log("Event Keys: " + keys);
}

function errData(err) {
  console.log("ERROR " + err);

}

//var $ = require('jQuery');



// Adding Discord.js

//Setup Message
client.on('ready', () => {
  console.log('I am loaded!');
  client.user.setGame('https://goo.gl/K9FkJS');


});


//COMMENTED OUT FOR NOW BUT ITS IMPORTANT DONT DELETE PLS

//--------------------------Reminders------------------------


function CheckReminders() {
  var today = new Date()
  console.log("Checking Reminders...");
  var currentDate = (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear();
  var currentTimeMinutes = (60 * today.getHours()) + today.getMinutes();

  var infoArray = [];

  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    //  var attList = Object.keys(events[k].guestlist);
    //  var betterList = [];
    infoArray[0] = events[k].eventName;
    infoArray[1] = events[k].eventDate;
    infoArray[2] = events[k].eventStart;
    /*  for(var j = 0; j<attList.length; j++) {
        betterList[j]=attList[j].toString();
        console.log(betterList[j]);
      }

        */

    //Grab Guestlist information and add to array

    eventStartMinutesArr = [];
    eventStartMinutesArr = infoArray[2].split(':');
    var eventStartMinutes = (60 * parseInt(eventStartMinutesArr[0])) + parseInt(eventStartMinutesArr[1]);
    console.log("EVENT NAME: " + infoArray[0]);
    console.log("eventStartMinutes: " + eventStartMinutes);
    console.log("currentTimeMinutes: " + currentTimeMinutes);
    console.log("currentDate: " + currentDate);
    console.log("eventDate: " + infoArray[1]);


    var dateArr = [];
    dateArr = infoArray[1].split('-');
    var dateMonth = parseInt(dateArr[0]);
    var dateDay = parseInt(dateArr[1]);
    var dateYear = parseInt(dateArr[2]);

    function deleteMessage() {

      ref.child(keys[i]).remove();




      //delete event
      console.log(infoArray[0] + " - Deleted becaues it is already over");
    }

    console.log("dateDay: " + dateDay);
    console.log("todayDay" + today.getDate());


    if (parseInt(dateYear) < today.getFullYear()) {
      console.log("Deleting - function problem");
      deleteMessage();
    } else if (parseInt(dateYear) == today.getFullYear() && parseInt(dateMonth) < (today.getMonth() + 1)) {
      deleteMessage();
    } else if (parseInt(dateMonth) == (today.getMonth() + 1) && parseInt(dateDay) < today.getDate()) {
      deleteMessage();
    } else if ((parseInt(dateDay) == today.getDate()) && currentTimeMinutes > eventStartMinutes) {
      deleteMessage();
    }

    //if its the day of the event and it is 60 minutes away from the start of the event
    else if (
      (
        ((eventStartMinutes - 60) == currentTimeMinutes) ||
        ((eventStartMinutes - 30) == currentTimeMinutes) ||
        ((eventStartMinutes - 10) == currentTimeMinutes) ||
        (eventStartMinutes == currentTimeMinutes)) &&
      currentDate == infoArray[1]) {

      console.log("reminder sent");
      SendReminder(infoArray[0], infoArray[1], infoArray[2], (eventStartMinutes - currentTimeMinutes));
    }
  }
}

function SendReminder(eventName, eventDate, eventTime, MinutesToEvent) {

  console.log("Reminders have been sent");

  //for each person in the guestlist send a reminder to them


  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    if (events[k].eventName.toLowerCase() == eventName.toLowerCase()) {
      var attList = Object.keys(events[k].guestlist);
      var idList = events[k].guestlist;
      var bestList = [];
      for (var j = 0; j < attList.length; j++) {
        var tempUserName = attList[j];
        bestList[j] = idList[tempUserName];
      }
      console.log("Guest ids: " + bestList);
    }
  }

  //removing any sign of < @ ! >...
  //the exclamation symbol comes if the user has a nickname on the server.

  for (var i = 0; i < bestList.length; i++) {
    let str = bestList[i];
    let id = str.replace(/[<@!>]/g, '');

    client.fetchUser(id)
      .then(user => {
        user.send("Reminder: " + eventName + " starts in : ```" + MinutesToEvent + " minutes!```")
      })
  }

}

setInterval(function() {
  CheckReminders();
}, 59000);


//Scanning all messages
client.on('message', message => {

  //Map Command - Returns google map link
  //--------------------------Map-----------------------------------
  if (message.content.toLowerCase().startsWith("--map")) {
    var eventName = message.content.substring(6);
    var linkString = "https://www.google.ca/maps/place/";
    var tempMap = ":(";
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (events[k].eventName.toLowerCase() == eventName.toLowerCase()) {
        tempMap = events[k].eventLocation;
      }
    }

    var mapString = new Array();
    if (tempMap == ":(") message.channel.send("No event specified :(");
    else {
      mapString = tempMap.split(" ");
      for (var j = 0; j < mapString.length; j++) {
        if (j != mapString.length - 1) linkString += mapString[j] + '+';
        else linkString += mapString[j];
      }
      message.channel.send(linkString);
    }
  }

  //Create Command
  //-------------------------Create--------------------------------
  else if (message.content.toLowerCase().startsWith("--create")) {
    var eventArr = new Array();

    //Splitting message to get individual variables
    eventArr = message.content.substring(9).split(", ");


    var name = eventArr[0];
    var date = eventArr[1];
    var start = eventArr[2];
    var duration = eventArr[3];
    var location = eventArr[4];

    //Regex Expressions


    //var dateREG = new RegExp("\d\d-\d\d-\d\d\d\d");
    var dateREG = "/\d\d-\d\d-\d\d\d\d/";
    //var startdurationREG = new RegExp("\d\d:\d\d");
    var startdurationREG = "/\d\d:\d\d/";


    if (!/\d\d-\d\d-\d\d\d\d/.test(date) || !/\d\d:\d\d/.test(start) || !/\d\d:\d\d/.test(duration)) {

      message.channel.send("Please follow this date and time format \n Date : `` MM-DD-YYYY`` \n Start Time : ``HH:MM`` \n Duration : ``HH:MM`` ");


    } else {

      message.channel.send({
        embed: {
          color: 342145,
          author: {
            name: "A new event has been created: " + name + "!",

          },
          title: "Event name",
          //url: "http://google.com",
          description: name,
          fields: [{
              name: "Date",
              value: date
            },
            {
              name: "Start",
              value: start
            },
            {
              name: "Duration",
              value: duration
            },
            {
              name: "Location",
              value: location
            }

          ],
          timestamp: new Date(),
          footer: {
            icon_url: client.user.avatarURL,

          }
        }
      });

      console.log("Event array: " + eventArr);
      //Prepping data for pushing
      var dataToSub = {
        eventName: name,
        eventDate: date,
        eventStart: start,
        eventDuration: duration,
        eventLocation: location
      };

      //pushing to firebase
      ref.push(dataToSub);

      var userId = message.author.id;
      var userName = message.author.username;
      message.channel.send("<@" + userId + ">" + ", you have been added to the guest list!");

      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (events[k].eventName.toLowerCase() == name.toLowerCase()) {
          var userData = {};
          userData[userName] = userId;
          ref.child(k).child('guestlist').update(userData);
          console.log("User Data: " + userData);
        }
      }




    }
  }

  //----------------------------Info------------------------------
  else if (message.content.toLowerCase().startsWith("--info")) {
    var ret = "It didn't work, buddy.";
    var eventExists = false;
    var infoArray = [];
    var eventName = message.content.substring(7);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var temp = events[k].eventName;
      if (temp.toLowerCase() == eventName.toLowerCase()) {
        eventExists = true;
        ret = events[k].eventLocation;
        infoArray[0] = events[k].eventName;
        infoArray[1] = events[k].eventDate;
        infoArray[2] = events[k].eventStart;
        infoArray[3] = events[k].eventDuration;
        infoArray[4] = events[k].eventLocation;
      }
    }
    if (eventExists) {
      message.channel.send({
        embed: {
          color: 342145,
          author: {
            name: "Info about your event: " + infoArray[0],

          },
          title: "Event name",
          //url: "http://google.com",
          description: infoArray[0],
          fields: [{
              name: "Date",
              value: infoArray[1]
            },
            {
              name: "Start",
              value: infoArray[2]
            },
            {
              name: "Duration",
              value: infoArray[3]
            },
            {
              name: "Location",
              value: infoArray[4]
            }

          ],
          timestamp: new Date(),
          footer: {
            icon_url: client.user.avatarURL,

          }
        }
      });
    } else {
      message.channel.send("Event " + eventName + " could not be found");
    }
  }

  //-----------------------ListEvents---------------------------
  else if (message.content.toLowerCase().startsWith('--listevents')) {
    var listIndex = 1;
    var eventsExist = false;
    for (var i = 0; i < keys.length; i++) {
      eventsExist = true;
      var k = keys[i];
      var temp = events[k].eventName;
      message.channel.send("```" + listIndex + ". " + temp + "```");
      listIndex++;
    }
    if (!eventsExist) {
      message.channel.send("```No events exist. Create one using: '--create'```");
    }
  }

  //----------------------Delete-------------------------------
  else if (message.content.toLowerCase().startsWith("--delete")) {

    var del = false;
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (!del && events[k].eventName.toLowerCase() == message.content.substring(9).toLowerCase()) {
        message.channel.send("```" + events[k].eventName + " has been deleted```");
        del = true;
        ref.child(keys[i]).remove();
      }
    }

    if (!del) {
      message.channel.send("```Event " + message.content.substring(9) + " could not be found```");
    }

  }


  //-------------------Guests----------------------------------
  else if (message.content.toLowerCase().startsWith("--imgoing")) {
    var userId = message.author.id;
    var userName = message.author.username;
    var eventFound = false;

    for (var i = 0; i < keys.length; i++) {
      var k = keys[i]
      if (events[k].eventName.toLowerCase() == message.content.substring(10).toLowerCase()) {
        eventFound = true;
        var userData = {};
        userData[userName] = userId;
        ref.child(k).child('guestlist').update(userData);
        console.log(userData);
      }
    }

    if (eventFound) {
      message.channel.send("<@" + userId + ">" + ", you have been added to the guest list for " + message.content.substring(10) + "!");
    } else {
      message.channel.send("<@" + userId + ">" + " Error, event " + message.content.substring(10) + " could not be found");
    }

  } else if (message.content.toLowerCase().startsWith("--imnotgoing")) {
    var eventExists = false;
    var correctEvent = message.content.substring(13)
    var userName = message.author.username;
    var userId = message.author.id;
    for (var i = 0; i < keys.length; i++) {
      k = keys[i];
      if (events[k].eventName.toLowerCase() == correctEvent.toLowerCase()) {
        eventExists = true;
        var attList = Object.keys(events[k].guestlist);
        var idList = events[k].guestlist;
        var bestList = [];
        for (var j = 0; j < attList.length; j++) {
          //attlist[j] = userName;
          if (userName == attList[j] || userId == idList[attList[j]]) {
            ref.child(k).child('guestlist').child(userName).remove();
            message.channel.send("<@" + userId + ">" + ", you have been removed from the guest list for " + correctEvent);
            console.log("@" + userName + " has been removed from the guest list for " + correctEvent);
          }

        }
      }
    }
    if (!eventExists) message.channel.send("```Event " + correctEvent + " could not be found```")
  } else if (message.content.toLowerCase().startsWith("--guestlist")) {
    var eventExists = false;
    for (var i = 0; i < keys.length; i++) {
      k = keys[i];
      var count = 1;
      if (events[k].eventName.toLowerCase() == message.content.substring(12).toLowerCase()) {
        eventExists = true;
        try {
          var attList = Object.keys(events[k].guestlist);
        } catch (err) {
          message.channel.send("No one is going to " + message.content.substring(12) + " :(");
          break;
        }
        var idList = events[k].guestlist;
        var bestList = [];
        for (var j = 0; j < attList.length; j++) {
          var tempUserName = attList[j];
          bestList[j] = idList[tempUserName];
          message.channel.send(count + ". " + attList[j]);

          count++;
        }
        console.log("Ids: " + bestList);
      }
    }

    if (!eventExists) message.channel.send("```Event " + message.content.substring(12) + " could not be found```");
  }

  //--------------------------Help-------------------------------
  else if (message.content.toLowerCase().startsWith('--help')) {
    message.channel.send({
      embed: {
        color: 3447003,
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL
        },
        title: "--help",
        //url: "http://google.com",
        description: "This page lists all the EventBot commands",
        fields: [{
            name: "--create [name, date, start, duration, location]",
            value: "name - Name of the event _(e.g. Halloween)_ \n" +
              "date - Date the event starts _(e.g. MM-DD-YYYY (31-10-2017))_ \n" +
              "start - Time the event starts _(e.g. 18:30)_ \n" +
              "duration - How long the event will be _(e.g. 03:00 (3 Hours))_ \n" +
              "location - Space separated address of the location _(e.g. 123 Fake Avenue City) \n"

          },
          {
            name: "--map [eventname]",
            value: "Gives you a Google Maps link to the address provided"
          },

          {
            name: "--listevents",
            value: "Gives a list of all the current events"
          },

          {
            name: "--delete [eventName]",
            value: "Deletes that event"
          },
          {
            name: "--info [eventName]",
            value: "Shows you all the details of the event"
          },
          {
            name: "--imgoing [eventName]",
            value: "Adds your name to the guest list"
          },
          {
            name: "--guestlist [eventName]",
            value: "Shows you the guest list"
          },
          {
            name: "--imnotgoing [eventName]",
            value: "Removes you from the guest list"
          }

        ],

        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,

        }
      }
    });
  } else if (message.content.startsWith("--")) {
    message.channel.send("```Invalid Command```");
  }
});

/*

Checklist:

- Figure out how to separate events by server by using server IDs as nodes in Firebase


*/

client.login('MzcxNDYyMzY0NjA5OTA0NjYx.DM1_QQ.ihUJA1Pdl_BRyf12zGclLhgA05c');
