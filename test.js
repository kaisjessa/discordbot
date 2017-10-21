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
    message.channel.send('*COMMANDS:*');
    message.channel.send("``` --ping : pang \n --exit : exit \n --event : create an event```");
    message.channel.send(" **--exit** : exit");
    // message.channel.send(" --event : create an event```");
  }

});




client.login('MzcxMzU3OTA2NDkyMTk0ODI3.DM0dvg.yn6MJW5Upj_imhAz93izoEcWCw4');
