'use strict'
const { PeerRPCServer } = require('grenache-nodejs-http');
const Link = require('grenache-nodejs-link');
const ServiceOrderBook = require('./common/entity/ServiceOrderBook');

const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start();

const peer = new PeerRPCServer(link, {})
peer.init()

const port = 1337; // 1024 + Math.floor(Math.random() * 1000)
const service = peer.transport('server')
service.listen(port)

const serviceOrderBook = new ServiceOrderBook();

setInterval(() => {
  link.announce('orderbook_service', service.port, {});
}, 1000);

service.on('request', (rid, key, payload, handler) => {
  console.log(`service request:
    rid: ${rid.toString()}
    key: ${key}
    payload:${JSON.stringify(payload)}`);

  switch (payload.method) {
    case 'submit_order':
      try {
        handleSubmitOrder(payload.data)
        handler.reply(null, { success: true });
      } catch (error) {
        handler.reply(error, { success: false });
      }
      break;
    case 'get_orders':
      try {
        const orders = handleGetOrder(payload.data.userId);
        handler.reply(null, orders);
      } catch (error) {
        handler.reply(error, { success: false });
      }
      break;
    case 'get_all_orders':
      try {
        const orders = getAllOrderBook();
        handler.reply(null, orders);
      } catch (error) {
        handler.reply(error, { success: false });
      }
      break;
    default:
      console.log('Unknown key:', key);
      handler.reply(null, { success: false });
  }
});

function handleSubmitOrder(order) {
  serviceOrderBook.addOrder(order);
}

function handleGetOrder(userId) {
  return serviceOrderBook.getOrder(userId);
}

function getAllOrderBook() {
  return serviceOrderBook.getAllOrderBook();
}
