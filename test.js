const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log('I am ready!');
});


client.on('message', message => {
  if (message.content === '--ping') {
    message.channel.send('pang');
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
        description: "This is a test embed to showcase what they look like and what they can do.",
        fields: [{
            name: "--help",
            value: "right here big boi"
          },
          {
            name: "--exit",
            value: "Make the bot quit :("
          },
          {
            name: "--event",
            value: "all dat fun event stuff"
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
