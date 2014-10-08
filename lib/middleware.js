var useragent = require('express-useragent')
  , redisWrapper = require('./redisWrapper.js')
  , ONE_MINUTE = 1000 * 60;


var analyticsObj = {
  uses : {

  },
  paths : {

  },
  overallUses : 0
}


redisWrapper.get(function(err, item){
  if(!err && item){
    analyticsObj = item
  }
})

function recordUse(incrementables, path, query) {
  for (var i = 0; i < incrementables.length; i++) {
    analyticsObj['uses'][incrementables[i]] ? 
      analyticsObj['uses'][incrementables[i]]++ : analyticsObj['uses'][incrementables[i]] = 1;
  };

  analyticsObj.overallUses += 1;

  analyticsObj['paths'][path] ? 
    analyticsObj['paths'][path].uses++ : 
    analyticsObj['paths'][path] = { uses : 1 };
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


var stats = function () {
  return analyticsObj;
};

/**
 * Automatically save analyticsObj object once in every two hours
 */
setInterval(function() {
  redisWrapper.set(analyticsObj)
}, ONE_MINUTE);

module.exports = function (req, res, next) {

  //If analyticsObj isn't defined we shouldn't worry about recording traffic. 
  if (analyticsObj && req.headers['user-agent'] !== undefined) {
    var ua = useragent.parse(req.headers['user-agent']);

    if (req.headers['accept-language'] === undefined) {
      req.headers['accept-language'] = 'unknown';
    }

    var incrementableFields = [
      ua.Browser,
      ua.Platform, 
      checkType(ua),
      constructLanguage(req.headers['accept-language'])
    ]; 

    recordUse(incrementableFields, req._parsedUrl['pathname']);
  }

  next();

};
module.exports.get = function(req, res) {
  res.send(200, analyticsObj)
};
