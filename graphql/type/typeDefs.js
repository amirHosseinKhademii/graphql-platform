const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    id: ID
    name: String
    lastName: String
    userName: String
    email: String
    password: String
    token: String
    profile: Profile
    createdAt: String
    followers: [ID]
    followerCount: Int
  }
  type Profile {
    image: String
    address: String
    phone: String
    idCode: String
    postCode: String
    userName: String
  }
  type Product {
    id: ID
    userName: String
    title: String
    image: String
    price: Int
    color: String
    company: String
    size: String
    number: Int
    desc: String
    createdAt: String
    comments: [Comment]
    likes: [Like]
    commentCount: Int
    likeCount: Int
  }
  type Like {
    id: ID
    userName: String
    createdAt: String
  }
  type Comment {
    id: ID
    body: String
    userName: String
    createdAt: String
  }
  type Order {
    id: ID
    userName: String
    products: [ID]
    createdAt: String
    payed: Boolean
    status: String
    price: Int
  }
  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }
  type Query {
    getUsers: [User]
    getUser(userId: ID!): User!
    getProducts: [Product]
    getProduct(productId: ID!): Product!
    getOrders: [Order]
    getCart(userId: ID): [Product]
    getOrder(orderId: ID): [Product]
    uploads: [File]
  }
  type Mutation {
    signup(
      name: String!
      lastName: String!
      userName: String!
      email: String!
      password: String!
    ): User!

    login(userName: String!, password: String!): User!
    createProfile(
      image: String
      address: String
      phone: String
      idCode: String
      postCode: String
      userName: String!
    ): User!
    createProduct(
      image: String
      price: Int
      color: String
      company: String
      size: String
      number: Int
      desc: String
      title: String
      userName: String
    ): Product!
    deleteProduct(productId: ID!): Product!
    updateProduct(
      productId: ID!
      image: String
      price: Int
      color: String
      company: String
      size: String
      number: Int
      desc: String
      title: String
    ): Product!
    addToCart(productId: ID!, userId: ID!): User!
    deleteFromCart(productId: ID!, userId: ID!): User!
    likeProduct(productId: ID!): Product!
    createComment(productId: ID!, body: String!): Product!
    deleteComment(productId: ID!, commentId: ID!): Product!
    addOrder(products: [ID], price: Int!): Order!
    deleteOrder(orderId: ID!): Order!
    removeCart(productId: ID!, orderId: ID!): Order!
    payCart(orderId: ID!): Order!
    sendCart(orderId: ID!): Order!
    upload(file: Upload!): File!
    addFollower(userId: ID!): User
  }
  type Subscription {
    signupUser: User!
    newOrder: Order!
  }
`;
module.exports = typeDefs;
