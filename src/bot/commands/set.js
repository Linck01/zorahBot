const discord_guildModel = require('../models/discord_guildModel.js');
const fct = require('../../util/fct.js');
const errorMsgs = require('../../const/errorMsgs.js');
const embeds = require('../util/embeds.js');

module.exports = (msg,args) => {
  return new Promise(async function (resolve, reject) {
    try {
      if (!msg.member.hasPermission("MANAGE_GUILD")) {
        await msg.channel.send('You need the permission to manage the server, in order to use this command.');
        return resolve();
      }
      if (args.length < 1) {
        await msg.channel.send(embeds.genericSmall(errorMsgs.get('tooFewArguments').replace('<prefix>',msg.guild.appData.prefix)));
        return resolve();
      }

      let field = args[0].toLowerCase();
      const value = args.slice(1,args.length+1).join(' ');

      // SET - BASIC
      if (field == 'prefix')
        await prefix(msg,value);
      else if (field == 'entriesperpage')
        await entriesperpage(msg,value);
      else if (field == 'showNicknames')
        await showNicknames(msg,value);
      else {
        await msg.channel.send(embeds.genericSmall('Invalid argument. Type ``'+msg.guild.appData.prefix+'help`` for more information'));
        return resolve();
      }
    } catch (e) { reject(e); }
    resolve();
  });
}


function prefix(msg,value) {
  return new Promise(async function (resolve, reject) {
    try {
      if (value.length < 1 || value.length > 32) {
        await msg.channel.send(embeds.genericSmall('Please use 1 to 32 characters as prefix.'));
        return resolve();
      }

      await discord_guildModel.storage.set(msg.guild,'prefix',value);
      await msg.channel.send(embeds.genericSmall('Setting updated.'));
      resolve();
    } catch (e) { reject(e); }
  });
}

function entriesperpage(msg,value) {
  return new Promise(async function (resolve, reject) {
    try {
      if (isNaN(value) || value < 4 || value > 20) {
        await msg.channel.send(embeds.genericSmall('The entriesperpage needs to be a value within 4 and 20.'));
        return resolve();
      }

      await discord_guildModel.storage.set(msg.guild,'entriesPerPage',value);
      await msg.channel.send(embeds.genericSmall('Setting updated.'));
      resolve();
    } catch (e) { reject(e); }
  });
}

function showNicknames(msg,value) {
  return new Promise(async function (resolve, reject) {
    try {
      const myGuild = await discord_guildModel.storage.get(msg.guild);

      if (myGuild.showNicknames) {
        await discord_guildModel.storage.set(msg.guild,'showNicknames',0);
        await msg.channel.send(embeds.genericSmall('Users *usernames* will show on all embeds and messages.'));
      } else {
        await discord_guildModel.storage.set(msg.guild,'showNicknames',1);
        await msg.channel.send(embeds.genericSmall('Users *nicknames* will show on all embeds and messages.'));
      }
      resolve();
    } catch (e) { reject(e); }
  });
}
