/**
 * Created by jun.li on 10/29.
 */

var fs = require('fs');
var path = require('path');
var fn = require('fn.js');

function Log(category) {
	checklogs();
    var fork = require('child_process').fork, logger;
	logger = fork(__dirname+'/child.js');

    var log= {
		trace: function () {	
			var args = fn.toArray( arguments );			
			logger.send({type:'trace',data:args});	 		
        },
        debug: function () {		
			var args = fn.toArray( arguments );
			logger.send({type:'debug',data:args})	                   
        },
        info: function () {
			var args = fn.toArray( arguments );
			logger.send({type:'info',data:args})
            
        },
        warn: function () {
            var args = fn.toArray( arguments );
			logger.send({type:'warn',data:args})
        },
        error: function () {
            var args = fn.toArray( arguments );
			logger.send({type:'error',data:args})
        },
        fatal: function () {
            var args = fn.toArray( arguments );
			logger.send({type:'fatal',data:args})
        }		 
	 };
     var stack= {
        trace: function () {
			var args = fn.toArray( arguments );
			logger.send({type:'trace',data:args,stack:true});
        },
        debug: function () {
			var args = fn.toArray( arguments );
			logger.send({type:'debug',data:args,stack:true});
        },
        info: function (msg) {
			var args = fn.toArray( arguments );
			logger.send({type:'info',data:args,stack:true});
        },
        warn: function (msg) {
			var args = fn.toArray( arguments );
			logger.send({type:'warn',data:args,stack:true});
        },
        error: function (msg) {
			var args = fn.toArray( arguments );
			logger.send({type:'error',data:args,stack:true});
        },
        fatal: function (msg) {
			var args = fn.toArray( arguments );
			logger.send({type:'fatal',data:args,stack:true});
        },
        traceObj: function (msg, obj) {
            logger.trace(getStack() + SEQ + (msg || ''));
            logger.trace(obj);
        },
        errorObj: function (msg, obj) {
            logger.error(getStack() + SEQ + (msg || ''));
            logger.error(obj);
        },
        fatalObj: function (msg, obj) {
            logger.fatal(getStack() + SEQ + (msg || ''));
            logger.fatal(obj);
        }
    };
    
    log.stack=stack;
    
    return log;
}

function checklogs() {
	var logdir= path.join(process.env.PWD,"logs");
    if(!fs.existsSync(logdir)){
		fs.mkdirSync(logdir)
	}	
}
module.exports = Log;
