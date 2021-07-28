const { Router } = require('express');
const { graphqlHTTP } = require("express-graphql");
const query = require('../schema/query');
const mutation = require('../schema/mutation');
const authController = require('../controller/authController');


const router = Router();

router.use(
    "/query",
    graphqlHTTP({
        schema: query,
        graphiql: true,
    })
);

router.use(
    "/mutation",
    authController.authenticate,
    graphqlHTTP((req) => {
        return {
            schema: mutation,
            graphiql: true,
            context: {
                email: req.user
            }
        }
    })
);


module.exports = router;
