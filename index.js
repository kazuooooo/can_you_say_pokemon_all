"use strict";
const Alexa = require('alexa-sdk');

// ステートの定義
const states = {
  PLAYING_MODE: '_PLAYING_MODE'
};

// Pokemons スロットに登録したものと同じものを配列で代入
const pokemons = [
  'ピカチュウ',
  'カイリュー',
  'ヤドラン',
  'ピジョン',
  'コダック'
]

exports.handler = function(event, context, callback) {
  const alexa = Alexa.handler(event, context);
  // 既存のハンドラに加えてpokemonHandlers(下で定義を登録)
  alexa.registerHandlers(handlers, pokemonHandlers);
  alexa.execute();
};
const handlers = {
  'LaunchRequest': function () {
    this.handler.state = states.PLAYING_MODE; // stateにPLAYING_MODEをセット
    const message = 'ポケモン言えるかなへようこそ。ポケモンを言ってください。'
    this.emit(':ask', message);
  },
  'AMAZON.HelpIntent': function () {
    this.handler.state = states.PLAYING_MODE; // stateにPLAYING_MODEをセット
    const message = 'ポケモンを言っていくゲームです。ポケモンを言ってください。'
    this.emit(':ask', message);
  }
};

// PLAYING_MODEの場合はこのhandlerがintentを処理する
const pokemonHandlers = Alexa.CreateStateHandler(states.PLAYING_MODE, {
  'PokemonIntent': function() {
　　 // 言ったポケモンをスロットから取得する
    const pokemon = this.event.request.intent.slots.Pokemon.value;
    if (pokemons.indexOf(pokemon) > -1) {
      const message = '正解です!!次のポケモンを言ってください'
      const reprompt = 'ポケモンを言ってください〜'
      this.emit(':ask', message, reprompt); // 正解の場合は継続
    } else {
      const message = '残念。そんなポケモンはいません。'
      this.handler.state = '';
      this.emit(':tell', message); // 不正解の場合は終了
    }
  }
});