import MerchantStoreService from "@/services/merchant/storeService";
import { GraphQLBoolean, GraphQLInt, GraphQLObjectType } from "graphql";
import { StoreInputType } from "../inputTypes";

const storeService = new MerchantStoreService()

const StoreMutation = new GraphQLObjectType({
    name: "StoreMutation",
    fields: {
        addStore: {
            type: GraphQLBoolean,
            args: {
                store: {type: StoreInputType}
            },
            resolve: async (_src, {store}, {user}) => {
                try {
                    return await storeService.addStore(store, user.id);
                } catch (e) {
                    throw e;
                }
            }
        },
        updateStore: {
            type: GraphQLBoolean,
            args: {
                store: {type: StoreInputType}
            },
            resolve: async (_src, {store}, {user}) => {
                try {
                    return await storeService.updateStore(store, user.id)
                } catch (e) {
                    throw e;
                }
            }
        },
        setStoreStatus: {
            type: GraphQLBoolean,
            args: {
                id: {type: GraphQLInt},
                status: {type: GraphQLBoolean}
            },
            resolve: async (_src, {id, status}, {user}) => {
                try {
                    await storeService.setOpen(id, status, user.id);
                    return status;
                } catch (e) {
                    throw e;
                }
            }
        }
    },
})

export default {
    type: StoreMutation,
    resolve: (_src, _args, ctx) => {
        if(ctx.user !== null) {
            return true
        }
        throw Error("UNAUTHORIZED")
    }
};