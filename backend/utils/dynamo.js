const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION });

const dynamo = new AWS.DynamoDB.DocumentClient();

const getProducts = async (category) => {
  if (category) {
    const params = {
      TableName: process.env.PRODUCTS_TABLE,
      IndexName: "CategoryIndex",
      KeyConditionExpression: "category = :c",
      ExpressionAttributeValues: { ":c": category }
    };
    return dynamo.query(params).promise();
  } else {
    const params = { TableName: process.env.PRODUCTS_TABLE };
    return dynamo.scan(params).promise();
  }
};

const createOrder = async (order) => {
  const params = {
    TableName: process.env.ORDERS_TABLE,
    Item: order
  };
  return dynamo.put(params).promise();
};

const getUserOrders = async (userId) => {
  const params = {
    TableName: process.env.ORDERS_TABLE,
    IndexName: "UserOrdersIndex",
    KeyConditionExpression: "userId = :u",
    ExpressionAttributeValues: { ":u": userId }
  };
  return dynamo.query(params).promise();
};

module.exports = { getProducts, createOrder, getUserOrders };
