var _ = require('underscore.string')
  , useragent = require('express-useragent')
  , redisWrapper = require('./redisWrapper.js')
  , ONE_MINUTE = 1000 * 60;

var db = {}
      , pageviews = 1;

    db.Browser = {}
      , db.Platform = {}
      , db.Type = {}
      , db.Path = {
        "get"   : {},
        "post"  : {},
        "put"   : {},
        "delete": {}
      }
      , db.Language = {};

redisWrapper.get(function(err, item){
  console.log('in redis cb');
  console.log(err, item);
  if(!err && item){
    db = item
  }
})

var middleware = function (req, res, next) {

  //If db isn't defined we shouldn't worry about recording traffic. 
  if (db && req.headers['user-agent'] !== undefined) {
    var ua = useragent.parse(req.headers['user-agent']);

    if (req.headers['accept-language'] === undefined) {
      req.headers['accept-language'] = 'unknown';
    }

    recordUse(ua.Browser, 
      ua.Platform, 
      checkType(ua), 
      req._parsedUrl['path'], 
      constructLanguage(req.headers['accept-language']) );
  }

  next();

};

var get = function(req, res) {
  res.send(200, db)
}


function recordUse(browser, platform, type, path, language) {

  db.Browser[browser] = {
    'views': counter(browser, 'Browser')
  };

  db.Platform[platform] = {
    'views': counter(platform, 'Platform')
  };

  db.Type[type] = {
    'views': counter(type, 'Type')
  };

  db.Path[path] = {
    'views': counter(path, 'Path')
  };

  db.overall = {
    'views': pageviews++
  };

  db.Language[language] = {
    'views': counter(language, 'Language')
  };
}


function checkType (ua) {
  if (ua.isMobile === true) {
    return 'mobile';
  }
  else {
    return 'desktop';
  }
}


function constructLanguage(str){
  if(typeof str === 'string'){
    return str.split(',')[0]
  }else{
    return '';
  }
}


function counter (index, root) {
  if (db[root][index] === undefined) {
    return 1;
  }
  else {
    db[root][index].views++;
    return db[root][index].views;
  }

}

var stats = function () {
  return db;
};

/**
 * Automatically save db object once in every two hours
 */
setInterval(function() {
  redisWrapper.set(db)
}, ONE_MINUTE);

module.exports = middleware;
module.exports.get = get;
