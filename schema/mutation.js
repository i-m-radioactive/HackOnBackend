//---------------------------------------------------------------------------------------------------------------------
//------------------------------------------------- ALL IMPORTS -------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------

const graphql = require("graphql");

const Posts = require("../model/VPost");
const Request = require("../model/Request");
const User = require("../model/User");

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLID
} = graphql;




//-----------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------- Mutation ( Database Entry )-----------------------------------
//-----------------------------------------------------------------------------------------------------------------------


//------------------------------------------
//---------- ERROR HANDLING TYPE -----------
//------------------------------------------

const ErrorType = new GraphQLObjectType({
    name: "Error",
    fields: () => ({
        error: { type: GraphQLBoolean },
        msg: { type: GraphQLString },
    }),
});

//--------------------------------------------
//---------- MUTATION TYPE SCHEMA ------------
//--------------------------------------------

const UserInput = new graphql.GraphQLInputObjectType({
    name: "UserInput",
    fields: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        phone: { type: new GraphQLNonNull(GraphQLString) },
        pincode: { type: new GraphQLNonNull(GraphQLString) },
        address: { type: new GraphQLNonNull(GraphQLString) },
        city: { type: new GraphQLNonNull(GraphQLString) },
        state: { type: new GraphQLNonNull(GraphQLString) },
        role: { type: new GraphQLNonNull(GraphQLString) }
    },
});

const PostContentInput = new graphql.GraphQLInputObjectType({
    name: "PostContent",
    fields: {
        detail: {
            type: new GraphQLNonNull(GraphQLString)
        },
        qty: {
            type: new GraphQLNonNull(GraphQLString)
        }
    }
});

const PostInput = new graphql.GraphQLInputObjectType({
    name: "PostInput",
    fields: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        category: { type: new GraphQLNonNull(GraphQLList(GraphQLString)) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLList(PostContentInput)) }
    },
});

const RequestInput = new graphql.GraphQLInputObjectType({
    name: "RequestInput",
    fields: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        category: { type: new GraphQLNonNull(GraphQLList(GraphQLString)) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: PostContentInput },
        status: { type: new GraphQLNonNull(GraphQLString) },
        createdBy: { type: new GraphQLNonNull(GraphQLString) },
        requestedFrom: { type: new GraphQLNonNull(GraphQLString) },
        postId: { type: new GraphQLNonNull(GraphQLString) }
    },
});

const UserType = new graphql.GraphQLObjectType({
    name: "UserType",
    fields: {
        _id: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        phone: { type: new GraphQLNonNull(GraphQLString) },
        pincode: { type: new GraphQLNonNull(GraphQLString) },
        address: { type: new GraphQLNonNull(GraphQLString) },
        city: { type: new GraphQLNonNull(GraphQLString) },
        state: { type: new GraphQLNonNull(GraphQLString) },
        role: { type: new GraphQLNonNull(GraphQLString) }
    },
});

//--------------------------------------------
//---------- MUTATION QUERY SCHEMA -----------
//--------------------------------------------

const mutation = new graphql.GraphQLObjectType({
    name: "Mutation",
    fields: {

        //----------------------------------------
        //---------- CREATE POST FIELD -----------
        //----------------------------------------

        createPost: {
            type: ErrorType,
            args: {
                data: { type: PostInput },
            },
            resolve: async (parent, { data },context) => {

                const newPost = new Posts({ ...data },context.email);
                try {
                    await newPost.save();
                } catch (err) {
                    console.log(err);
                    return { error: true, msg: err.toString() };
                }
                return { error: false, msg: newPost.name };
            },
        },

        createUser: {
            type: ErrorType,
            args: {
                data: { type: UserInput },
            },
            resolve: async (parent, { data }) => {
                const newUser = new User({ ...data });
                try {
                    await newUser.save();
                } catch (err) {
                    console.log(err);
                    return { error: true, msg: err.toString() };
                }
                return { error: false, msg: newUser.name };
            }
        }

        //----------------------------------------
        //---------- UPDATE POST FIELD -----------
        //----------------------------------------


        //----------------------------------------
        //---------- DELETE POST FIELD -----------
        //----------------------------------------



        //----------------------------------------
        //---------- DELETE ALL POST FIELD -------
        //----------------------------------------


    },
});

//----------------------------------
//---------- EXPORT MODULE ---------
//----------------------------------

// todo sort this out 
// mutation cannot be used with empty query
//
const rootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        user: {
            type: UserType,
            async resolve(parent, args, context) {

                try {
                    const result = await User.findOne({ email: context.email });
                    console.log(result);
                    return result;
                } catch (err) {
                    console.log(err);
                }
            },
        },
    }
})

module.exports = new GraphQLSchema({
    query: rootQuery,
    mutation: mutation,
});
