const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');


const resolvers = {
    Query: {
        me: async (parent, args, context)=> {
            if(context.user){
                const userData = await User.findOne({_id: context.user.id})
                .select('-__v -password')
                
                return userData;
            }
            throw new AuthenticationError('Not logged in');
        }
              
    },
    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
      
            if (!user) {
              throw new AuthenticationError('Incorrect credentials');
            }
      
            const correctPw = await user.isCorrectPassword(password);
      
            if (!correctPw) {
              throw new AuthenticationError('Incorrect credentials');
            }
      
            const token = signToken(user);
            return { token, user };
          },
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
      
            return { token, user };
        },
        saveBook: async (parent, { book }, context) =>{
            if(context.user){
                const updateUser = await User.findByIdAndUpdate(
                    {_id: context.book._id},
                    {$addToSet: { savedbooks: book}},
                    {new: true}
                );
                return updateUser;
            }
            throw new AuthenticationError('you need to be logged in to save the book')
        },
        removeBook: async(parent, {bookId}, context) =>{
            if(context.user){
                const updateUser = await User.findByIdAndUpdate(
                    {_id: context.book._id},
                    {$pull: { savedbooks: {bookId: bookId}}},
                    {new: true}
                )
            return updateUser;
        }
    }
 }
    
}
module.exports = resolvers;