const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log('I am ready!');
});


client.on('message', message => {
<<<<<<< HEAD
  if (message.content === '--ping') {
    message.channel.send('pang');
  }
  if (message.content === '--exit') {
    process.exit(0);
  }
  if (message.content === '--help') {
    message.channel.send('COMMANDS:');
    message.channel.send(' --ping : pang');
    message.channel.send(' --exit : exit,');
    message.channel.send(' --event : create an event');
=======
  if (message.content === '--help') {
    message.reply('Here is the correct format: \n --event');
>>>>>>> origin/master
  }

});



client.login('MzcxMzU3OTA2NDkyMTk0ODI3.DM0dvg.yn6MJW5Upj_imhAz93izoEcWCw4');
