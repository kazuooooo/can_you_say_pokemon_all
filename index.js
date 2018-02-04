"use strict";
const Alexa = require('alexa-sdk');

// Pokemons
const pokemons = [
  'ピカチュウ',
  'カイリュー',
  'ヤドラン',
  'ピジョン',
  'コダック'
]

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
     this.emit('AMAZON.HelpIntent');
  },
  'AMAZON.HelpIntent': function () {
    this.handler.state = states.PLAYING_MODE; // stateにPLAYING_MODEをセット
    this.attributes['said_pokemons'] = [];
    var message = 'ポケモンを言っていくゲームです。ポケモンを言ってください。'
    this.emit(':ask', message);
  }
};

// PLAYING_MODEの場合はこのhandlerがintentを処理する
var pokemonHandlers = Alexa.CreateStateHandler(states.PLAYING_MODE, {
  'PokemonIntent': function() {
    var pokemon = this.event.request.intent.slots.Pokemon.value;
    if (pokemons.indexOf(pokemon) > -1) {

      // 言ったポケモンをsession attributeに保存する
      this.attributes['said_pokemons'].push(pokemon);
      var notSaidPokemons = getArrayDiff(pokemons, this.attributes['said_pokemons'])
      console.log(notSaidPokemons);
      // まだ残っている場合はあと何匹か言う
      if(notSaidPokemons.length > 0) {
        var message = '正解です!!あと' + notSaidPokemons.length.toString() + '匹です。次のポケモンを言ってください'
        var reprompt = 'ポケモンを言ってください〜'
        this.emit(':ask', message, reprompt); // しばらく何も回答しなかった場合にrepromptが呼ばれる
      } else {
        // 全て終わった場合は終了する
        var message = 'おめでとうございます全てのポケモンが言えました！！'
        this.emit(':tell', message);
      }
      

    } else {
      var message = '残念。そんなポケモンはいません。'
      this.handler.state = '';
      this.emit(':tell', message);
    }
  },
  'Unhandled': function() {
    var message = '残念。そんなポケモンはいません。'
    this.handler.state = '';
    this.emit(':tell', message);
  }
});

function getArrayDiff(arr1, arr2) {
  let arr = arr1.concat(arr2);
  return arr.filter((v, i)=> {
    return !(arr1.indexOf(v) !== -1 && arr2.indexOf(v) !== -1);
  });
}