var argv = require('minimist')(process.argv.slice(2));
var SocketCluster = require('socketcluster').SocketCluster;
var cCPUs = require('os').cpus().length;

var socketCluster = new SocketCluster({
  workers: Number(argv.w) || cCPUs,
  brokers: Number(argv.b) || cCPUs,
  port: Number(argv.p) || 8000,
  appName: argv.n || null,
  workerController: __dirname + '/worker.js',
  brokerController: __dirname + '/broker.js',
  socketChannelLimit: 1000,
  crashWorkerOnError: argv['auto-reboot'] != false
});
