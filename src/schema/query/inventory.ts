import MerchantInventoryService from "@/services/merchant/inventoryService";
import { GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { InventoryType } from "../objectTypes";

const inventoryService = new MerchantInventoryService();

const InventoryQuery = new GraphQLObjectType({
    name: "InventoryQuery",
    fields: {
        inventories: {
            description: "Get All Inventories by Store Id",
            type: GraphQLList(InventoryType),
            args: {
                storeId: {type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: async (_src, {storeId}) => {
                try {
                    return await inventoryService.getInventoryByStoreId(storeId);
                } catch (e) {
                    throw e;
                }
            }
        },
        inventoryDetail: {
            description: "Get Inventory by Id",
            type: InventoryType,
            args: {
                id: {type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: async (_src, {id}) => {
                try {
                    return await inventoryService.getInventoryById(id);
                } catch (e) {
                    throw e;
                }
            }
        }
    }
})

export default {
    type: InventoryQuery,
    resolve: (_src, _args, ctx) => {
        if(ctx.user !== null) {
            return true
        }
        throw Error("UNAUTHORIZED")
    }
}