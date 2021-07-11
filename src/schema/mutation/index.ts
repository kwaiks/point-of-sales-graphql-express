import {  GraphQLObjectType } from "graphql";
import auth from "./auth";
import store from "./store";
import menu from "./menu";
import inventory from "./inventory";
import transaction from "./transaction";

const MutationRoot = new GraphQLObjectType({
    name: "RootMutation",
    fields: {
        auth,
        store,
        menu,
        inventory,
        transaction
    }
});

export default MutationRoot;