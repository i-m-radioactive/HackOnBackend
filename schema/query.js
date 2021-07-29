//---------------------------------------------------------------------------------------------------------------------
//------------------------------------------------- ALL IMPORTS -------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------

const graphql = require("graphql");
const Posts = require("../model/VPost");
const User = require("../model/User");
const Pincode = require("../model/Pincode");

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLID,
} = graphql;

//----------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------- QUERY -------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------

//-------------------------------------------
//-------------- QUERY TYPE SCHEMA ----------
//-------------------------------------------

const PostContentType = new graphql.GraphQLObjectType({
    name: "PostContent",
    fields: {
        detail: {
            type: new GraphQLNonNull(GraphQLString),
        },
        qty: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },
});

const PostType = new GraphQLObjectType({
    name: "Post",
    fields: () => ({
        _id: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        category: { type: new GraphQLNonNull(GraphQLList(GraphQLString)) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLList(PostContentType) },
        createdBy: { type: new GraphQLNonNull(GraphQLString) },
        vlt: { type: UserType }
    }),
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

const PincodeType = new graphql.GraphQLObjectType({
    name: "PincodeType",
    fields: {
        pincode: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        districtName: {
            type: new GraphQLNonNull(GraphQLString),
        },
        stateName: {
            type: new GraphQLNonNull(GraphQLString),
        }
    }
})

//---------------------------------------------------------
//------------- QUERY POST OR POSTS SCHEMA ----------------
//---------------------------------------------------------

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        //----------------------------------------
        //---------- QUERY SINGLE POST -----------
        //----------------------------------------

        post: {
            type: PostType,
            args: {
                id: { type: GraphQLString },
            },
            async resolve(parent, args) {
                try {
                    const result = await Posts.findById(args.id);
                    return result;
                } catch (err) {
                    console.log(err);
                }
            },
        },

        //----------------------------------------
        //---------- QUERY MULTIPLE POST ---------
        //----------------------------------------

        posts: {
            type: new GraphQLList(PostType),
            args: {
                category: { type: GraphQLList(GraphQLString), defaultValue: null },
                pincode: { type: GraphQLString, defaultValue: null },
                state: { type: GraphQLString, defaultValue: null },
                city: { type: GraphQLString, defaultValue: null },
                email: { type: GraphQLString, defaultValue: null },
                skip: { type: GraphQLInt, defaultValue: 0 },// will add validation for skip and limit argument -------- Validations means not be negative
                limit: { type: GraphQLInt, defaultValue: 10 },
            },

            resolve: async (parent, { category, pincode, state, city, email, skip, limit }) => {

                const query = {
                    $and: [
                        category ? { category: { $all: category } } : {},
                        pincode ? { "vlt.pincode": pincode } : {},
                        state ? { "vlt.state": state } : {},
                        city ? { "vlt.city": city } : {},
                        email ? { "vlt.email": email } : {},
                    ]
                };

                const aggrUser = [
                    {
                        $lookup: {
                            from: "users",
                            localField: "createdBy",
                            foreignField: "email",
                            as: "vlt",
                        }
                    },
                    { $unwind: { path: '$vlt' } },
                    { $match: query },
                    { $skip: skip },
                    { $limit: limit }
                ]

                try {
                    const result = await Posts.aggregate(aggrUser).exec()
                    return result;
                } catch (err) {
                    console.log(err)
                }
            },
        },

        //----------------------------------------
        //---------- QUERY USER ---------
        //----------------------------------------

        user: {
            type: UserType,
            args: {
                email: { type: new GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args) {
                try {
                    const result = await User.findOne({ email: args.email });
                    return result;
                } catch (err) {
                    console.log(err);
                }
            },
        },

        //----------------------------------------
        //---------- QUERY USER ---------
        //----------------------------------------

        pincode: {
            type: PincodeType,
            args: {
                pincode: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve: async (parent, { pincode }) => {
                try {
                    const result = await Pincode.findOne({ 'pincode': pincode }).exec();
                    return result;
                } catch (err) {
                    console.log(err);
                }
            }
        }

    },

});

module.exports = new GraphQLSchema({
    query: RootQuery,
});



//backup

// query.$and.push({});
// if (args.category) {
//     query.$and.push({
//         category: {
//             $all: args.category,
//         },
//     });
// }

// if (args.pincode) {
//     query.$and.push({ "vlt.pincode": args.pincode })
// }

// if (args.state) {
//     query.$and.push({ "vlt.state": args.state })
// }

// if (args.city) {
//     query.$and.push({ "vlt.city": args.city })
// }

// const result = await Posts.aggregate()
//     .lookup({
//         from: "users",
//         localField: "createdBy",
//         foreignField: "_id",
//         as: "vlt",
//     })
//     .unwind("vlt")
//     .match(query)
//     .exec();