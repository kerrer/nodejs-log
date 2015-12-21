/**
 * Created by jun.li on 10/29.
 */

var log4js = require('log4js');
var fs = require('fs');
var path = require('path');
var config = require('config')();
var fn = require('fn.js');

const SEQ = '\n';
const DEFAULT_CONFIG = {
    "appenders": [
        {
            "type": "console"
        },
        {
			"type": "file",
			"filename": "logs/abc.log",
			"maxLogSize": 20480,
			"backups": 15
		}
    ],
    "levels": {
        "default": "trace"
    },
    "replaceConsole": true
};

function Log(category) {
	checklogs();
    var logconfig =  config.get('log4js').appenders ?  config.get('log4js') : DEFAULT_CONFIG; 
    log4js.configure(logconfig);
    
    var logger = function (logconfig) {
        var logger = category ? log4js.getLogger(category) : log4js.getLogger();
        var level= 'TRACE';
        if(category){
			level = logconfig.levels[category];
		}else if(logconfig.levels['default']){
			level = logconfig.levels['default'];
		}
        logger.setLevel(level);
        return logger;
    }(logconfig);

    var getStack = function () {
        var sta = new Error().stack;
        if (typeof sta == 'undefined') {
            return 'no stack1';
        }
        var sts = sta.split('\n');
        if (typeof sts == 'undefined' || sts.length < 4) {
            return 'no stack2';
        }
        return sts[3].trim();
    };
    

     var log= {
		trace: function () {	
			var args = fn.toArray( arguments );
			process.nextTick(function() {
				logger.trace.apply(logger,args);    
			});			 		
        },
        debug: function () {		
			var args = fn.toArray( arguments );
			process.nextTick(function() {
				logger.debug.apply(logger,args);       
			});	                   
        },
        info: function () {
			var args = fn.toArray( arguments );
			process.nextTick(function() {
				logger.info.apply(logger,args);      
			});
            
        },
        warn: function () {
            var args = fn.toArray( arguments );
			process.nextTick(function() {
				logger.warn.apply(logger,args);    
			});	
        },
        error: function () {
            var args = fn.toArray( arguments );
			process.nextTick(function() {
				logger.error.apply(logger,args);    
			});	
        },
        fatal: function () {
            var args = fn.toArray( arguments );
			process.nextTick(function() {
				logger.fatal.apply(logger,args);    
			});	
        }		 
	 };
     var stack= {
        trace: function () {
			var args = fn.toArray( arguments );
			args.push(SEQ);
			args.push(getStack());
			process.nextTick(function() {
				logger.trace.apply(logger,args);    
			});
        },
        debug: function () {
			var args = fn.toArray( arguments );
			args.push(SEQ);
			args.push(getStack());
			process.nextTick(function() {
				logger.debug.apply(logger,args);    
			});
        },
        info: function (msg) {
			var args = fn.toArray( arguments );
			args.push(SEQ);
			args.push(getStack());
			process.nextTick(function() {
				logger.info.apply(logger,args);    
			});
        },
        warn: function (msg) {
			var args = fn.toArray( arguments );
			args.push(SEQ);
			args.push(getStack());
			process.nextTick(function() {
				logger.warn.apply(logger,args);    
			});
        },
        error: function (msg) {
			var args = fn.toArray( arguments );
			args.push(SEQ);
			args.push(getStack());
			process.nextTick(function() {
				logger.error.apply(logger,args);    
			});
        },
        fatal: function (msg) {
			var args = fn.toArray( arguments );
			args.push(SEQ);
			args.push(getStack());
			process.nextTick(function() {
				logger.fatal.apply(logger,args);    
			});
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
    
    var getLogger = function(){
	   	
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
