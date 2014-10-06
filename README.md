#no-js-analytics
##simple analytics middleware for [express](http://expressjs.com/)


##Installation:   
```$ npm install no-js-analytics```

##Usage:
```javascript
var analytics = require('no-js-analytics');

app.configure(function(){
  ... (start of your express configuration)

  app.use(express.bodyParser());
  // Add analytics below express.bodyParser()
  app.use(analytics);

  ... (rest of your configuration)
});
```

##Methods
###analytics.save()
   Writes the current data of db object into a new .txt file in ./analytics-logs
###analytics.stats()
   Renders the current data of db object in JSON format..
```
app.get('/analytics', function(req, res){
  res.send(200, analytics.stats());
});
```

###License (MIT)
   Copyright (c) 2013 Juuso Haavisto <juuso@mail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
