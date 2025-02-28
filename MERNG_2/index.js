const { ApolloServer,PubSub } = require('apollo-server'); //pubsub publish sub

const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { MONGODB } = require('./config');

const pubsub = new PubSub();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req, pubsub })
});
const Port = process.env.PORT || 5000;
mongoose.connect(MONGODB,{useNewUrlParser: true}).then(()=>{
    console.log('Mongodb Connected')
    return server.listen({port:Port})
}).then(res => {
    console.log(`server running at ${res.url}`);
});





