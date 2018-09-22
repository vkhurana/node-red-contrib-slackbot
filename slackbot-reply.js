var Botkit = require('botkit');

module.exports = function(RED) {
    'use strict';

    function Node(n) {
      
        RED.nodes.createNode(this,n);

        var node = this;
        
        var slackbot = RED.nodes.getNode(n.slackbot);

        function start_rtm() {
            node.bot.startRTM(function(err,bot,payload) {
                if (err) {
                    setTimeout(start_rtm, 5000);
                }
            });
        }
        
        if (slackbot.bot_token) {
            
            node.controller = Botkit.slackbot({
                debug: false,
            });

            node.bot = this.controller.spawn({
                token: slackbot.bot_token,
            });
            
            start_rtm();
        }

        node.controller.on('rtm_close', function(bot, err) {
            start_rtm();
        });
        
        this.on('input', function (msg) {

            node.bot.reply(msg.message, msg.payload);  
        });
    }

    RED.nodes.registerType('slackbot-reply', Node);
};
