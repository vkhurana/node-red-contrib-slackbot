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
                        console.log('Failed to start RTM')
                        return setTimeout(start_rtm, 60000);
                }
                console.log("RTM started!");
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

        node.controller.on('direct_message,direct_mention,mention',function(bot, message) {
            
            var msg = { 
                message: message,
                payload: message.text 
            };
            
            console.log(msg);
            
            node.send(msg);
        });
        
        node.on('close', function(done) {
            node.controller.shutdown();
            node.bot.closeRTM();
            done();
        });
    }

    RED.nodes.registerType('slackbot-listen', Node);
};
