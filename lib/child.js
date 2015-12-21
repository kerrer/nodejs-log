/**
 * Created by jun.li on 10/29.
 */

var log4js = require('log4js');
var path = require('path');
var config = require('nodejs-config')();
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

var logger = getLogger();
process.on('message',function(obj){
	if(!obj.stack){
	   switch(obj.type){
		   case "trace":
				log.trace(obj.data);
				break;
		   case "debug":
				log.debug(obj.data);
				break;
		    case "info":
				log.info(obj.data);
				break;
		    case "warn":
				log.warn(obj.data);
				break;
		    case "error":
				log.error(obj.data);
				break;
		    case "fatal":
				log.fatal(obj.data);
				break;		   
	   }	
	}else{
	   switch(obj.type){
		   case "trace":
				stack.trace(obj.data);
				break;
		   case "debug":
				stack.debug(obj.data);
				break;
		    case "info":
				stack.info(obj.data);
				break;
		    case "warn":
				stack.warn(obj.data);
				break;
		    case "error":
				stack.error(obj.data);
				break;
		    case "fatal":
				stack.fatal(obj.data);
				break;		   
	   }	
	}
});

function getLogger(category) {
	var logconfig =  config.get('log4js').appenders ?  config.get('log4js') : DEFAULT_CONFIG; 
    log4js.configure(logconfig);
    
    var logger = category ? log4js.getLogger(category) : log4js.getLogger();
    var level= 'TRACE';
    if(category){
		level = logconfig.levels[category];
	}else if(logconfig.levels['default']){
		level = logconfig.levels['default'];
	}
    logger.setLevel(level);
    return logger;
}
    
function getStack() {
        var sta = new Error().stack;
        if (typeof sta == 'undefined') {
            return 'no stack1';
        }
        var sts = sta.split('\n');
        if (typeof sts == 'undefined' || sts.length < 4) {
            return 'no stack2';
        }
        return sts[3].trim();
}

var log= {
		trace: function (args) {	
			process.nextTick(function() {
				logger.trace.apply(logger,args);    
			});			 		
        },
        debug: function (args) {		
			process.nextTick(function() {
				logger.debug.apply(logger,args);       
			});	                   
        },
        info: function (args) {
			process.nextTick(function() {
				logger.info.apply(logger,args);      
			});            
        },
        warn: function (args) {
            process.nextTick(function() {
				logger.warn.apply(logger,args);      
			});  
        },
        error: function (args) {
            process.nextTick(function() {
				logger.error.apply(logger,args);      
			}); 
        },
        fatal: function (args) {
            process.nextTick(function() {
				logger.fatal.apply(logger,args);      
			}); 
        }		 
	 };
var stack= {
        trace: function (args) {
			args.push(SEQ);
			args.push(getStack());
			process.nextTick(function() {
				logger.trace.apply(logger,args);    
			});
            
        },
        debug: function (args) {
			args.push(SEQ);
			args.push(getStack());
			process.nextTick(function() {
				logger.debug.apply(logger,args); 
			});
        },
        info: function (args) {
			args.push(SEQ);
			args.push(getStack());
			process.nextTick(function() {
				logger.info.apply(logger,args); 
			});
        },
        warn: function (args) {
			args.push(SEQ);
			args.push(getStack());
			process.nextTick(function() {
				logger.warn.apply(logger,args); 
			});
        },
        error: function (args) {
			args.push(SEQ);
			args.push(getStack());
			process.nextTick(function() {
				logger.error.apply(logger,args); 
			});
        },
        fatal: function (args) {
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
process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err.message,err.stack);
});

process.on('exit', function(code) { 
  // do *NOT* do this
  setTimeout(function() {
      console.log("服务停止中............................");
  }, 0);
  console.log('About to exit with code:', code);
});
