import {io} from 'socket.io-client';
// let socket = io("http://localhost:5000");
// var socket = io.connect('https://kahhotbackendapp.herokuapp.com', {reconnect: true});
var connectionOptions = {
	"force new connection" : true,
	"reconnect":true,
	"reconnectionAttempts": "Infinity",
	"timeout" : 10000,				
	"transports" : ["websocket"],
	 secure: true, reconnection: true, rejectUnauthorized: false 
};

// 
// let socket = io.connect('https://my-kahoot-backend.herokuapp.com/',connectionOptions);
let socket = io("https://secure-ravine-99917.herokuapp.com");
// const socket = io.connect("https://my-kahoot-backend.herokuapp.com/", { secure: true, reconnection: true, rejectUnauthorized: false });
console.log("socket",socket);
export default socket;
