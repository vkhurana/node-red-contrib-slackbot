var Botkit = require('botkit');

module.exports = function(RED) {
    'use strict';

    function Node(n) {
      
        RED.nodes.createNode(this,n);

        var node = this;
        
        var slackbot = RED.nodes.getNode(n.slackbot);
        
        if (slackbot.bot_token) {
            
            node.controller = Botkit.slackbot({
                debug: false,
            });

            node.bot = this.controller.spawn({
                token: slackbot.bot_token
            }).startRTM();
            
        }
        
        this.on('input', function (msg) {

            node.bot.reply(msg.message, msg.payload);  
        });
    }

    RED.nodes.registerType('slackbot-reply', Node);
};
