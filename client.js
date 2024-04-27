'use strict'
const { PeerRPCClient } = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')

const link = new Link({
  grape: 'http://127.0.0.1:30001',
  requestTimeout: 10000
})
link.start()

const peer = new PeerRPCClient(link, {})
peer.init()

async function submitOrder(order) {
  await peer.request(
    'orderbook_service',
    { method: 'submit_order', data: order },
    { timeout: 1000 },
    (err, result) => {
      if (err) {
        console.error('SUBMIT_ORDER - Error:', err.message);
        return;
      }
      console.log('SUBMIT_ORDER - Result:', result);
    }
  );
}

async function getOrder(userId) {
  await peer.request(
    'orderbook_service',
    { method: 'get_orders', data: { userId } },
    { timeout: 1000 },
    (err, result) => {
      if (err) {
        console.error('GET_ORDER - Error:', err.message);
        return;
      }
      console.log('GET_ORDER - Result:', JSON.stringify(result));
    }
  );
}

async function getAllOrders() {
  await peer.request(
    'orderbook_service',
    { method: 'get_all_orders' },
    { timeout: 1000 },
    (err, result) => {
      if (err) {
        console.error('GET_ALL_ORDERS - Error:', err.message);
        return;
      }
      console.log('GET_ALL_ORDERS - Result:', JSON.stringify(result));
    }
  );
}

const orderUser1 = { userId: 1, type: 'sell', price: 100, quantity: 2 };
const orderUser2 = { userId: 2, type: 'buy', price: 100, quantity: 2 };
const orderUser3 = { userId: 3, type: 'buy', price: 100, quantity: 2 };

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  await submitOrder(orderUser1);
  await getOrder(orderUser1.userId);
  await getAllOrders();

  await submitOrder(orderUser2);
  await getOrder(orderUser2.userId);

  await getAllOrders();

  await submitOrder(orderUser3);
  await getOrder(orderUser3.userId);

  await submitOrder(orderUser1);
  await getOrder(orderUser1.userId);

  await getAllOrders();
}

main();