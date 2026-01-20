const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // Or specific domain
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.requestContext && event.requestContext.http.method === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    const body = JSON.parse(event.body);
    const email = body.email;

    if (!email || !email.includes("@")) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Invalid email" }),
      };
    }

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        email: email,
        subscribedAt: new Date().toISOString(),
        active: true,
      },
      ConditionExpression: "attribute_not_exists(email)", // Prevent overwriting existing timestamps if re-subscribing logic differs, but simple for now
    });

    try {
      await docClient.send(command);
    } catch (e) {
      if (e.name === "ConditionalCheckFailedException") {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: "Already subscribed!" }),
        };
      }
      throw e;
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Subscribed successfully!" }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
