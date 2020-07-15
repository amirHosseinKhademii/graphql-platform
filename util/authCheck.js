const jwt = require("jsonwebtoken");
const config = require("config");
const { AuthenticationError } = require("apollo-server");
// chek token
module.exports = (context) => {
  //get header from request
  const authHeader = context.req.headers.authorization;

  const secret = config.get("secretKey");
  if (authHeader) {
    const token = authHeader;
    if (token) {
      try {
        const user = jwt.verify(token, secret);
        return user;
      } catch (error) {
        throw new AuthenticationError("توکن غیر معتبر یا تاریخ گذشته");
      }
    } else {
      throw new Error(`token must be '[token]'`);
    }
  } else {
    throw new Error("هدر فراهم نشده");
  }
};
