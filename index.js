"use strict";
const Alexa = require('alexa-sdk');

// ステートの定義
const states = {
  PLAYING_MODE: '_PLAYING_MODE'
};

exports.handler = function(event, context, callback) {
  var alexa = Alexa.handler(event, context);
  // alexa.appId = process.env.APP_ID;
  alexa.registerHandlers(handlers, pokemonHandlers); // 既存のハンドラに加えてpokemonHandlers(下で定義を登録)
  alexa.execute();
};
var handlers = {
  'LaunchRequest': function () {
    this.handler.state = states.PLAYING_MODE; // stateにPLAYING_MODEをセット
    var message = 'ポケモン言えるかなへようこそ。ポケモンを言ってください。'
    this.emit(':ask', message);
  },
  'AMAZON.HelpIntent': function () {
    this.handler.state = states.PLAYING_MODE; // stateにPLAYING_MODEをセット
    this.handler.state = states.PLAYING_MODE;
    var message = 'ポケモンを言っていくゲームです。ポケモンを言ってください。'
    this.emit(':ask', message);
  }
};

// PLAYING_MODEの場合はこのhandlerがintentを処理する
var pokemonHandlers = Alexa.CreateStateHandler(states.PLAYING_MODE, {
  'PokemonIntent': function() {
    var pokemon = this.event.request.intent.slots.Pokemon.value;
    if (pokemons.indexOf(pokemon) > -1) {
      var message = '正解です!!次のポケモンを言ってください'
      var reprompt = 'ポケモンを言ってください〜'
      this.emit(':ask', message, reprompt); // 正解の場合は継続
    } else {
      var message = '残念。そんなポケモンはいません。'
      this.handler.state = '';
      this.emit(':tell', message); // 不正解の場合は終了
    }
  }
});