var redis = require("redis");
var client = redis.createClient();
var appName = require('../package.json').name
client.on("error", function (err) {
    console.log("no-je-analytics - Could not connect to redis" + err);
    throw(err)
});

exports.get = function(next){
  if(!typeof next ==='function'){
    throw(new Error('No callback specified in get'))
  }

  client.get(appName, function(err, itemString){
    if(!err && itemString){
      try{
        var obj = JSON.parse(itemString);
        next(undefined, obj)
      }catch(e){
        next(e)
      }
    }else if(!itemString){
      return next(new Error(appName +': Got an empty or null value from redis'))
    }
    else{
      return err ? next(err) : next(new Error('Couldn\'t serialize Object'))
    }
  })
}


exports.set = function(value, type, next){
  if(!typeof next ==='function'){
    throw(new Error('No callback specified in set'))
  }

  serializeObject(value, function(err, item){
    if(err || !item){
      return err ? next(err) : next(new Error(appName +': Couldn\'t serialize Object'))
    }else{    
      client.set(appName, item, next);
    }
  })
}


function serializeObject(value, next){
  if(!typeof next ==='function'){
    throw(new Error(appName +': No callback specified in serializeObject'))
  }

  var type = typeof value 
  if(type === 'string'){
    next(null, value)
  }else if(type === 'object'){
    try{
      var stringValue = JSON.stringify(value)
      next(null, stringValue)
    }
    catch(err){
      next(err)
    }
  }else{
    next(new Error(appName +': Can only handle objects and strings in serializeObject'))
  }
}
