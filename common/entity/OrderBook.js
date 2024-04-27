class ServiceOrderBook {
  constructor() {
    this.OrderBookArray = [];
  }

  addOrder(order) {
    console.log('Adding order:', order);
    // if the user does not exist in the order book, add the user and the order,
    // if not, add the order to the user's order book.
    const orderIndex = this.OrderBookArray.indexOf(orderBook => orderBook.userId === order.userId);
    if (orderIndex === -1) {
      this.OrderBookArray.push({ userId: order.userId, orderBook: [{ type: order.type, price: order.price, quantity: order.quantity }] });
    } else {
      this.OrderBookArray[orderIndex].orderBook.push({ type: order.type, price: order.price, quantity: order.quantity });
    }

    const isMatch = this.matchOrders(order);

    if (isMatch !== null) {
      console.log('Match found:', isMatch);
    }
  }

  getAllOrderBook() {
    return this.OrderBook;
  }

  getOrder(userId) {
    return this.OrderBook.indexOf(user => user.userId === userId);
  }

  matchOrders(newOrder) {
    console.log('Executing trade');
    // If the new order is a BUY order, filter the sell orders that have a price
    // less than or equal to the new order price and the quantity greater than or
    // equal to the new order quantity.
    if (newOrder.type === 'buy') {
      const userIndex = this.OrderBook.indexOf(
        user => user.orderBook.indexOf(
          order =>
            order.type === 'sell' &&
            order.price <= newOrder.price &&
            order.quantity >= newOrder.quantity
        ) !== -1);
      return userIndex;
    } else if (newOrder.type === 'sell') {
      // If the new order is a sell order, filter the buy orders that have a price
      // greater than or equal to the new order price and the quantity greater
      // than or equal to the new order quantity.
      const userIndex = this.OrderBook.indexOf(
        user => user.orderBook.indexOf(
          order =>
            order.type === 'buy' &&
            order.price >= newOrder.price &&
            order.quantity >= newOrder.quantity
        ) !== -1);
      return userIndex;
    }
    return null;
  }
}

module.exports = ServiceOrderBook;