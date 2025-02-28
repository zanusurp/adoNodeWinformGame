const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');

const { AuthenticationError } = require('apollo-server');

module.exports={
    Query:{
        // sayHi: () => 'Hello World!'
        async getPosts(){
            try{
                const posts= await Post.find().sort({ createdAT:-1 });
                return posts;
            }catch(err){
                throw new Error(err);
            }
        },
        async getPost(_,{postId}){
            try{
                const post = await Post.findById(postId);
                if(post){
                    return post;
                }else{
                    throw new Error('Post not Found');
                }
            }catch(err){
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async createPost(_,{ body }, context){
            const user = checkAuth(context);
            console.log(user);

            const newPost = new Post({
                body,
                user:user.id,
                username:user.username,
                createdAT: new Date().toISOString()
            });
            const post = await newPost.save();
            return post;
        },
        async deletePost(_, { postId }, context){
            const user = checkAuth(context);
            try{
                const post = await Post.findById(postId);
                if(user.username === post.username){
                    await post.delete();
                    return 'post deleted successfully';
                }
                else{
                    throw new AuthenticationError('Action  not allowed');

                }

            }catch(err){
                throw new Error(err);
            }
            
        }
    }
};