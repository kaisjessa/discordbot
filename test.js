/*
* Discord Calendar Reminder Event Bot
* THacks2 - Oct 21-22 2017
* Kais, Andy, Zach, and...
* A
* N
* S
* H
*/

var firebase = require('firebase').initializeApp({
  serviceAccount: "./THacksBot-6eff64e90619.json",
  databaseURL: "https://thacksbot.firebaseio.com/"

});

var ref = firebase.database().ref().child('events');


// Adding Discord.js
const Discord = require('discord.js');
const client = new Discord.Client();

//Setup Message
client.on('ready', () => {
  console.log('I am loaded!');
});


function pullFirebase() {
  ref.on('value', gotData, errData);

  function gotData(data) {
    events = data.val();
    return events;
  //  keys = Object.keys(events);
  //  return keys;
    }
  }



  function errData(data) {
    console.log("error");
    return "error";
  }
}

//Scanning all messages
client.on('message', message => {



    
    //Map Command - Returns google map link
//--------------------------Map-----------------------------------
  if(message.content.startsWith("--map")) {
    var mapString = new Array();
    mapString = message.content.substring(5).split(" ");
    var linkString = "https://www.google.ca/maps/place/";
    for(var i =0; i<mapString.length; i++) {
      if(i != mapString.length-1) linkString += mapString[i]+'+';
      else linkString += mapString[i];
    }
    message.channel.send(linkString);
  }

    //Create Command
//-------------------------Create--------------------------------
  else if (message.content.startsWith("--create")) {
       var eventArr = new Array();

      //Splitting message to get individual variables
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
  }

    //--------------------------AllEvents--------------------------

    else if (message.content.startsWith("--AllEvents")) {
	keys = pullFirebase();

	for(var i = 0; i < keys.length; i++) {
	    message.channel.send({embed: {
		
	    }});
	}
	
    }
    
//----------------------------Info------------------------------
       else if (message.content.startsWith("--info")) {
         var ret = "It didn't work, buddy.";
         var events = pullFirebase();
         var keys = Object.keys(events);
         var eventName = message.content.substring(7);
         for(var i = 0; i<keys.length; i++) {
           var k = keys[i];
           var temp = events[k].eventName;
           if(temp==eventName) {
             var ret = events[k].eventLocation;
           }
         }
            message.channel.send(ret);
          }


//--------------------------Help-------------------------------
  else if (message.content === '--help') {
    message.channel.send({embed: {
        color: 3447003,
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL
        },
        title: "--help",
        //url: "http://google.com",
        description: "This is a test embed to showcase what they look like and what they can do.",
        fields: [{
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

/*

Checklist:

- Figure out how to pull from firebase
- Setup reminders (mentions in general chat or dms)
- Figure out adding members to events (will need firebase integration)
- Firebase - Delete event from database after it is finished
- Figure out how block Ansh from using bot
- --events : list all events and their parameters

*/




client.login('MzcxMzU3OTA2NDkyMTk0ODI3.DM0dvg.yn6MJW5Upj_imhAz93izoEcWCw4');
