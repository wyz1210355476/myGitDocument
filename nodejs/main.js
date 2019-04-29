//var fs = require("fs");
//var data = fs.readFileSync('input.txt');
//console.log(data.toString());
//console.log("³ÌĞòÖ´ĞĞ½áÊø");
var events = require('events');
var eventEmitter = new events.EventEmitter();
var connectHandler = function connected() {
    console.log("first:connect success!");
    eventEmitter.emit('data_received')
};
eventEmitter.on('connection',connectHandler);
eventEmitter.on('data_received', function () {
    console.log('connect success!')
});
eventEmitter.emit('connection');

console.log("end");