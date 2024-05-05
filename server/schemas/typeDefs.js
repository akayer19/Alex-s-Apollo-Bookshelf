type UserDetails {
    _id: ID!
    username: String!
    email: String
    bookCount: Int
    savedBooks: [BookDetails]
  }
  
  type BookDetails {
    bookId: ID!
    authors: [String]
    description: String
    image: String
    link: String
    title: String!
  }
  
  type Authentication {
    token: ID!
    user: UserDetails
  }
  
  input BookInput {
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }
  
  type Query {
    fetchCurrentUser: UserDetails
  }
  
  type Mutation {
    userLogin(email: String!, password: String!): Authentication
    addUserMutation(username: String!, email: String!, password: String!): Authentication
    saveUserBook(bookData: BookInput!): UserDetails
    removeUserBook(bookId: ID!): UserDetails
  }
  