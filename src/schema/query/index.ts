import { GraphQLObjectType } from "graphql";
import store from "./store";
import menu from "./menu";
import inventory from "./inventory";

const QueryRoot = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        store,
        menu,
        inventory
    }
});

export default QueryRoot;