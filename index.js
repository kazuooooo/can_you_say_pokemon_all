"use strict";
const Alexa = require('alexa-sdk');

// ステートの定義
const states = {
  PLAYING_MODE: '_PLAYING_MODE'
};

// Pokemons
const pokemons = [
  'ピカチュウ',
  'カイリュー',
  'ヤドラン',
  'ピジョン',
  'コダック',
  'コラッタ',
  'ズバット',
  'ギャロップ'
]

exports.handler = function(event, context, callback) {
  var alexa = Alexa.handler(event, context);
  alexa.dynamoDBTableName = 'PokemonSkillTable'; 
  // alexa.appId = process.env.APP_ID;
  alexa.registerHandlers(handlers, synastriesHandlers); // 既存のハンドラに加えてステートハンドラ(後半で定義)も登録
  alexa.execute();
};
var handlers = {
  'LaunchRequest': function () {
    this.emit('AMAZON.HelpIntent');
  },
  'AMAZON.HelpIntent': function () {
    this.handler.state = states.PLAYING_MODE;
    // reset
    this.attributes['said_pokemons'] = [];
    var message = 'ポケモン言えるかなへようこそ。ポケモンを言ってください。'
    var bestScore = this.attributes['bestScore']
    if(bestScore){
      message = message + 'これまでのベストスコアは' + bestScore.toString() + 'です。';
    } else {
      this.attributes['bestScore'] = 0;
    }
    this.emit(':ask', message);
  },
  'SessionEndedRequest': function () {
    this.emit(':saveState', true);
  },
  'Unhandled': function() {
    this.emit(':tell', 'sorry unhandled');
  }
};
// ステートハンドラの定義
var synastriesHandlers = Alexa.CreateStateHandler(states.PLAYING_MODE, {
  'PokemonIntent': function() {
    var pokemon = this.event.request.intent.slots.Pokemon.value;
    if (pokemons.indexOf(pokemon) > -1) {

      // 言ったポケモンをsession attributeに保存する
      this.attributes['said_pokemons'].push(pokemon);
      this.attributes['score'] = this.attributes['said_pokemons'].length;
      var notSaidPokemons = getArrayDiff(pokemons, this.attributes['said_pokemons'])
      console.log(notSaidPokemons);
      // まだ残っている場合はあと何匹か言う
      if(notSaidPokemons.length > 0) {
        var message = '正解です!!あと' + notSaidPokemons.length.toString() + '匹です。次のポケモンを言ってください'
        var reprompt = 'ポケモンを言ってください〜'
        this.emit(':ask', message, reprompt);
      } else {
        // 全て終わった場合は終了する
        var message = 'おめでとうございます全てのポケモンが言えました！！'
        this.emit(':tell', message);
      }
      

    } else {
      console.log("unhandled in playing")
      var score = this.attributes['said_pokemons'].length
      var message = '残念。そんなポケモンはいません。結果は' + score.toString() + '匹でした。'
      
      if(this.attributes['bestScore'] < score){
        this.attributes['bestScore'] = this.attributes['said_pokemons'].length;
        message += "ベストスコアを更新しました！"
      }
      this.attributes['dummy'] = 'save from makemistake';
      this.attributes['STATE'] = undefined;
      this.attributes['said_pokemons'] = [];
      this.handler.state = '';
      this.emit(':tell', message);
    }
  },
  'SessionEndedRequest': function () {
    this.attributes['STATE'] = undefined;
    this.handler.state = '';
    console.log("session ended in playing")
    this.emit(':saveState', true);
  },
  'Unhandled': function() {
    console.log("unhandled in playing")
    var score = this.attributes['said_pokemons'].length
    var message = '残念。そんなポケモンはいません。結果は' + score.toString() + '匹でした。'
    if(this.attributes < score){
      this.attributes['bestScore'] = this.attributes['said_pokemons'].length;
      message += "ベストスコアを更新しました！"
    }
    this.attributes['dummy'] = 'save from unhandled';
    this.attributes['STATE'] = undefined;
    this.attributes['said_pokemons'] = [];
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

exports.makeMistake = function(){
  var score = this.attributes['said_pokemons'].length
  var message = '残念。そんなポケモンはいません。結果は' + score.toString() + '匹でした。'
  if(this.attributes < score){
    this.attributes['bestScore'] = this.attributes['said_pokemons'].length;
    message += "ベストスコアを更新しました！"
  }
  this.attributes['dummy'] = 'dummy value'
  this.emit(':saveState', true);
  this.emit(':tell', message);
}