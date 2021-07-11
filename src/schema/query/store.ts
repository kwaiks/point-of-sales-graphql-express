import MerchantStoreService from "@/services/merchant/storeService";
import { GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { StoreType } from "../objectTypes";

const storeService = new MerchantStoreService();

const StoreQuery = new GraphQLObjectType({
    name: "StoreQuery",
    fields: {
        allStore: {
            description: "Get All Stores by User Id",
            type: GraphQLList(StoreType),
            resolve: async (_src, _args, {user}) => {
                try {
                    return await storeService.getStore(user.id);
                } catch (e) {
                    throw e;
                }
            }
        },
        storeDetail: {
            description: "Get store by Id",
            type: StoreType,
            args: {
                storeId: {type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: async (_src, {storeId}) => {
                try {
                    return await storeService.getStoreById(storeId);
                } catch (e) {
                    throw e;
                }
            }
        }
    }
})

export default {
    type: StoreQuery,
    resolve: (_src, _args, ctx) => {
        if(ctx.user !== null) {
            return true
        }
        throw Error("UNAUTHORIZED")
    }
}