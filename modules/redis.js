var log4js = require('log4js');
log4js.configure('./config/log4js.json');
var log = log4js.getLogger("redis");

var redis = require('ioredis');
var cluster = new redis.Cluster([{
  port: 6380,
  host: '10.1.1.111'
}, {
  port: 6381,
  host: '10.1.1.111'
}, {
  port: 6382,
  host: '10.1.1.111'
}, {
  port: 6380,
  host: '10.1.1.114'
}, {
  port: 6381,
  host: '10.1.1.114'
}, {
  port: 6382,
  host: '10.1.1.114'
}]);
    
var getNoti = function(socket){
	cluster.exists('noti', function(err, res){
    	if(res == 1){
    		cluster.hgetall('noti', function(err, res){
		        log.warn(err);
		        socket.emit('getData', {title: res.title, link: res.link});
		    });
    	}else{
    		socket.emit('getData', 	{title: 'not exists', link: 'http://null.com'});
    	}
    });
};

var setNoti = function(data){
	log.info('setNoti',data);
    cluster.hmset('noti', data, function(err, res){
        if(err) log.warn(err);
        else log.info(data);
    });
};

module.exports = {
    getNoti: getNoti,
    setNoti: setNoti,
    redis: cluster
};