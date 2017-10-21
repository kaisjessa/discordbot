var firebase = require('firebase').initializeApp({
  serviceAccount: "./THacksBot-6eff64e90619.json",
  databaseURL: "https://thacksbot.firebaseio.com/"

});

//var message = {text: "hello", timestamp: "true"};
var ref = firebase.database().ref().child('events');
//var logsRef = ref.child('logs');
//var messagesRef = ref.child('messages');
//var messageRef = messagesRef.push(message);

// var config = {
//   apiKey: "AIzaSyA5N8baj97JFKy5izoLvglaxI98wmvRlJA",
//   authDomain: "thacksbot.firebaseapp.com",
//   databaseURL: "https://thacksbot.firebaseio.com",
//   projectId: "thacksbot",
//   storageBucket: "",
//   messagingSenderId: "479466171172"
// };
//
// firebase.initializeApp(config);
// var database = firebase.database();
// console.log("Database: " + database);
// var ref = database.ref('events');
// console.log("ref: " + ref);
// var obj = {test: true};
// console.log("obj: " + obj);

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log('I am ready!');
});


client.on('message', message => {
  if (message.content === '--ping') {
    message.channel.send('pang');
  }

  else if(message.content.startsWith("--map")) {
    var mapString = new Array();
    mapString = message.content.substring(5).split(" ");
    var linkString = "https://www.google.ca/maps/place/";
    for(var i =0; i<mapString.length; i++) {
      if(i != mapString.length-1) linkString += mapString[i]+'+';
      else linkString += mapString[i];
    }
    message.channel.send(linkString);
  }



  else if (message.content.startsWith("--create")) {
       var eventArr = new Array();
       eventArr = message.content.substring(9).split(", ");
       var name = eventArr[0];
       var date = eventArr[1];
       var start = eventArr[2];
       var duration = eventArr[3];
       var location = eventArr[4];
       message.channel.send({embed: {
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
       var dataToSub = {
         eventName: name,
         eventDate: date,
         eventStart: start,
         eventDuration: duration,
         eventLocation: location
       };
       ref.push(dataToSub);
     }




  else if (message.content === '--help') {
    message.channel.send({embed: {
        color: 3447003,
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL
        },
        title: "--help",
        //url: "http://google.com",
        description: "Here is a list of all the commands and what they do",
        fields: [{
          {
            name: "--exit",
            value: "Closes the bot"
          },
          {
            name: "--event [name, date, start, duration, location]",
            value: "name - Name of the event _(e.g. Halloween)_ \n" +
            "date - Date the event starts _(e.g. Oct 31 2017)_ \n" +
            "start - Time the event starts _(e.g. 18:30)_ \n" +
            "duration - How long the event will be _(e.g. 3 hours)_ \n" +
            "location - Space separated address of the location _(e.g. 123 Fake Avenue City)_ **NO COMMAS** \n" +
            "``Make sure all parameters are comma separated and that there are no commas within each parameter``"
          },
          {
            name: "--map [space seperated address]",
            value: "Gives you a Google Maps link to the address provided"
          }

        ],
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,

        }
      }
    });
  }


});





client.login('MzcxMzU3OTA2NDkyMTk0ODI3.DM0dvg.yn6MJW5Upj_imhAz93izoEcWCw4');
