var http = require("http");
var qs = require('querystring');
// var dbhandler = require('dbhandlerv');
var mongojs = require("mongojs");

http.createServer(function(request, response) {
	if (request.method == 'POST') {
		var body = '';
		request.on('data', function(data){
			body += data;
			if(body.length > 1e6){
				request.connection.destroy();
			}
		});

		request.on('end',function(){
			var postData = qs.parse(body);
			// Insert POST into mongodb
			console.log(postData);
				// Connect to mongodb
			var MongoClient = require('mongodb').MongoClient
			, format = require('util').format;
			MongoClient.connect('mongodb://104.236.123.60:27017/test', function (err, db) {
				if (err) {
					throw err;
				} else {

					// Insert some data
					var collection = db.collection('users');
			    	collection.insert(postData, function(err, docs) {
			        	collection.count(function(err, count) {
			            	console.log(format("count = %s", count));
			        	});
			        });

			        // Verify insertion
				    collection.find().toArray(function(err, results) {
				        console.log(results);
				        // Let's close the db
				        db.close();
				    });
				}
			});

		});
	};
	


	// Return the OK code
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("Hello World");
	response.end();

}).listen(8888);
