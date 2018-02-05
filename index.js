"use strict";
const Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback) {
  const alexa = Alexa.handler(event, context); // handlerを登録
  alexa.registerHandlers(handlers);
  alexa.execute();
};

// ここに各intentに対する処理を書いていく
const handlers = {
  'LaunchRequest': function () { // 起動時
    const message = 'ポケモン言えるかなへようこそ。ポケモンを言ってください。'
    this.emit(':ask', message);
  },
  'AMAZON.HelpIntent': function () { // 使い方を聞かれたとき
    const message = 'ポケモンを言っていくゲームです。'
    this.emit(':ask', message);
  },
};