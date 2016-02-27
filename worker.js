var fs = require('fs');
var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');

module.exports.run = function (worker) {
	console.log('   >> Worker PID:', process.pid);
	
	var app = require('express')();
	var routes = require('./routes/index');
	
	var httpServer = worker.httpServer;
	var scServer = worker.scServer;
	
	app.use(serveStatic(path.resolve(__dirname, 'public')));
	app.use('/', routes);
	
	httpServer.on('request', app);
	
	var count = 0;
	
	/*
	  In here we handle our incoming realtime connections and listen for events.
	*/
	var redis = require('./modules/redis');
	
	scServer.on('connection', function (socket) {
		console.log('socketio connected pid:'+ process.pid);
		//redis.getNoti(socket);
		socket.emit('getData', {title: 'a', link: 'b'});
		var ch = socket.global.subscribe('set');
		
		socket.on('set', function(data){
			console.log('socketio connected pid:'+ process.pid);
			console.log('set_msg', JSON.stringify(data));
			ch.publish(data);
			socket.emit('getData', data);
		});
	
		socket.on('sampleClientEvent', function (data) {
			count++;
			console.log('Handled sampleClientEvent', data);
			scServer.exchange.publish('sample', count);
		});
	
		socket.on('disconnect', function () {
	  		//
		});
	});
};
