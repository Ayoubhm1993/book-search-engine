const { gql } = require('apollo-server-express');

const typeDefs = gql`
type Query {
    me: User
}
type User {
   _id: ID
   username: String
   email: String
   savedBooks: [Book]
}

type Book {
    _id: ID
    authors: [String]
    description: String
    title: String
    image: String
    link: String

}

input bookInput {
    bookId: ID
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

type Auth {
    token : ID!
    user: User
}

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): User
    saveBook(input: bookInput): User
    removeBook(bookId: ID!): User
}
`;

module.exports = typeDefs;