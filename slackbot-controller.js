
module.exports = function(RED) {
    function SlackbotNode(n) {
        RED.nodes.createNode(this,n);
        this.bot_token = n.bot_token;
        this.bot_retries = 500;
    }
    RED.nodes.registerType("slackbot-controller", SlackbotNode);
}