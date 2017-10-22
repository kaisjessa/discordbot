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

var database = firebase.database();
var ref = database.ref('events');

ref.on('value', gotData, errData);

function gotData(data) {
  events = data.val();
  keys = Object.keys(events);
  console.log("something good happened Andy");
  console.log(keys);
}

function errData(err) {
  console.log("sad face");
  console.log(err);

}

const Discord = require('discord.js');
const client = new Discord.Client();


// Adding Discord.js

//Setup Message
client.on('ready', () => {
    console.log('I am loaded!');
});


//COMMENTED OUT FOR NOW BUT ITS IMPORTANT DONT DELETE PLS

//--------------------------Reminders------------------------

// var today = new Date()
//
// function CheckReminders() {
//     var currentDate = today.getFullMonth() + '-' + today.getFullDate() + '-' + today.getFullYear();
//     var currentTimeMinutes = (60 * today.getHours()) + today.getMinutes();
//
//     var infoArray = [];
//     for (var i = 0; i < keys.length; i++) {
//         var k = keys[i];
//         infoArray[0] = events[k].eventName;
//         infoArray[1] = events[k].eventDate;
//         infoArray[2] = events[k].eventStart;
//
//
// 	eventStartMinutesArr[] = infoarray[2].split(':');
// 	eventStartMinutes = (60 * eventStartMinutesArr[0]) + eventStartMinutesArr[1];
//
// 	//if its the day of the event and it is 60 minutes away from the start of the event
// 	if (eventStartMinutes - 60 == currentTimeMinutes && currentDate == infoArray[1]) {
// 	    SendReminder(infoarray[0], infoArray[1], infoArray[2]);
// 	}
//      }
// }
//
// function SendReminder(eventName, eventDate, eventTime) {
//
//      message.channel.send("!!Reminder that " + eventName + " starts in an Hour !!");
// }

//Scanning all messages
client.on('message', message => {

    //Map Command - Returns google map link
    //--------------------------Map-----------------------------------
    if (message.content.startsWith("--map") || message.content.startsWith("--Map")) {
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
        if(tempMap == ":(") message.channel.send("No event specified :(");
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
    else if (message.content.startsWith("--create") || message.content.startsWith("--Create")) {
        var eventArr = new Array();

        //Splitting message to get individual variables
        eventArr = message.content.substring(9).split(", ");
        var name = eventArr[0];
        var date = eventArr[1];
        var start = eventArr[2];
        var duration = eventArr[3];
        var location = eventArr[4];
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
    }

    //----------------------------Info------------------------------
    else if (message.content.startsWith("--info") || message.content.startsWith("--Info")) {
        var ret = "It didn't work, buddy.";
        var infoArray = [];
        var eventName = message.content.substring(7);
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            var temp = events[k].eventName;
            if (temp.toLowerCase() == eventName.toLowerCase()) {
                ret = events[k].eventLocation;
                infoArray[0] = events[k].eventName;
                infoArray[1] = events[k].eventDate;
                infoArray[2] = events[k].eventStart;
                infoArray[3] = events[k].eventDuration;
                infoArray[4] = events[k].eventLocation;
            }
        }
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
    }

    //-----------------------ListEvents---------------------------

    else if (message.content == '--listevents' || message.content == ("--Listevents")) {
      var listIndex = 1;
	     for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            var temp = events[k].eventName;
            message.channel.send(```listIndex + ". " + temp```);
            listIndex++;
        }
    }

    //----------------------Delete-------------------------------

    else if (message.content.startsWith("--delete") || message.content.startsWith("--Delete")) {

	var del = false;
	for(var i=0; i<keys.length; i++) {
            var k = keys[i];
            if(!del && events[k].eventName.toLowerCase()==message.content.substring(9).toLowerCase()) {
		message.channel.send("``"  + events[k].eventName + " has been deleted``");
		del = true;
		ref.child(keys[i]).remove();
            }
	}

	if(!del) {
            message.channel.send("``Event could not be found``");
	}

    }

    else if(message.content.startsWith("--imgoing")) {
      var userId = message.author.id;
      var userName = message.author.username;
      message.channel.send("<@" + userId + ">");

      for(var i=0; i<keys.length; i++) {
        var k = keys[i]
        if(events[k].eventName.toLowerCase() == message.content.substring(10).toLowerCase()) {
          var userData = {};
          userData[userName] = userId;
          ref.child(k).child('guestlist').update(userData);
          console.log(userData);
        }
      }

    }

    else if(message.content.startsWith("--guestlist")) {
      for(var i = 0; i<keys.length; i++) {
        k = keys[i];
        if(events[k].eventName.toLowerCase() == message.content.substring(12)) {
          var attList = Object.keys(events[k].guestlist);
          for(int j=0; j<attList.length;j++) {
            message.channel.send(attList[i]);
          }
        }
      }
    }

    //--------------------------Help-------------------------------
    else if (message.content === '--help' || message.content == "--Help") {
        message.channel.send({
            embed: {
                color: 3447003,
                author: {
                    name: client.user.username,
                    icon_url: client.user.avatarURL
                },
                title: "--help",
                //url: "http://google.com",
                description: "This is a test embed to showcase what they look like and what they can do.",
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
    }

    else if(message.content.startsWith("--")) {
      message.channel.send("``Invalid Command``");
    }
});

/*

Checklist:

- Setup reminders (mentions in general chat or dms)
- Figure out adding members to events (will need firebase integration)
- Firebase - Delete event from database after it is finished
- Figure out how block Ansh from using bot
- --events : list all events and their parameters

*/

client.login('MzcxNDYyMzY0NjA5OTA0NjYx.DM1_QQ.ihUJA1Pdl_BRyf12zGclLhgA05c');
