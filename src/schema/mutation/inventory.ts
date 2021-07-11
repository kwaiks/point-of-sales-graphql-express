import MerchantInventoryService from "@/services/merchant/inventoryService";
import { GraphQLBoolean, GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import { InventoryInputType } from "../inputTypes";
import { InventoryType } from "../objectTypes";

const inventoryService = new MerchantInventoryService()

const InventoryMutation = new GraphQLObjectType({
    name: "InventoryMutation",
    fields: {
        addInventory: {
            type: InventoryType,
            args: {
                storeId: {type: GraphQLInt},
                inventory: {type: InventoryInputType}
            },
            resolve: async (_src, {inventory, storeId}, {user}) => {
                try {
                    return await inventoryService.addInventory(inventory, storeId, user.id);
                } catch (e) {
                    throw e;
                }
            }
        },
        updateInventory: {
            type: InventoryType,
            args: {
                id: {type: GraphQLInt},
                inventory: {type: InventoryInputType}
            },
            resolve: async (_src, {inventory}, {user}) => {
                try {
                    return await inventoryService.updateInventory(inventory, user.id)
                } catch (e) {
                    throw e;
                }
            }
        },
        addStock: {
            type: GraphQLInt,
            args: {
                id: {type: GraphQLInt},
                total: {type: GraphQLInt},
                storeId: {type: GraphQLInt},
                description: {type: GraphQLString},
            },
            resolve: async (_src, {id, total, storeId, description}, {user}) => {
                try {
                    return inventoryService.addStock(id, total, description, storeId, user.id);
                } catch (e) {
                    throw e;
                }
            }
        },
        reduceStock: {
            type: GraphQLInt,
            args: {
                id: {type: GraphQLInt},
                total: {type: GraphQLInt},
                storeId: {type: GraphQLInt},
                description: {type: GraphQLString},
            },
            resolve: async (_src, {id, total, storeId, description}, {user}) => {
                try {
                    return inventoryService.reduceStock(id, total, description, storeId, user.id);
                } catch (e) {
                    throw e;
                }
            }
        },
        deleteInventory: {
            type: GraphQLBoolean,
            args: {
                id: {type: GraphQLInt},
                storeId: {type: GraphQLInt}
            },
            resolve: async (_src, {id, storeId}, {user}) => {
                try {
                    return inventoryService.deleteInventory(id, storeId, user.id);
                } catch (e) {
                    throw e;
                }
            }
        }
    },
})

export default {
    type: InventoryMutation,
    resolve: (_src, _args, ctx) => {
        if(ctx.user !== null) {
            return true
        }
        throw Error("UNAUTHORIZED")
    }
};