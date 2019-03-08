require('eventsource-polyfill');//兼容ie浏览器的EventSource,用于客户端接收服务端的信息，在热重载时使用
/**
 * HTML5规范中提供了服务端事件EventSource，浏览器在实现了该规范的前提下创建一个EventSource连接后，便可收到服务端的发送的消息，这些消息需要遵循一定的格式，对于前端开发人员而言，只需在浏览器中侦听对应的事件皆可。

相比较上文中提到的3中实现方式，EventSource流的实现方式对客户端开发人员而言非常简单，兼容性上出了IE系的浏览器（IE、Edge）外其他都良好；对于服务端，它可以兼容老的浏览器，无需upgrade为其他协议，在简单的服务端推送的场景下可以满足需求。在浏览器与服务端需要强交互的场景下，websocket仍是不二的选择。
 */
var hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true');

hotClient.subscribe(function(event){
    if(event.action === 'reload'){
        window.location.reload();
    }
});