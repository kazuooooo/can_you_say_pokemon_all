"use strict";
const Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback) {
  var alexa = Alexa.handler(event, context); // handlerを登録
  alexa.registerHandlers(handlers);
  alexa.execute();
};

// ここに各intentに対する処理を書いていく
var handlers = {
  'LaunchRequest': function () { // 起動時
    var message = 'ポケモン言えるかなへようこそ。ポケモンを言ってください。'
    this.emit(':ask', message);
  },
  'AMAZON.HelpIntent': function () { // 使い方を聞かれたとき
    var message = 'ポケモンを言っていくゲームです。'
    this.emit(':ask', message);
  },
};