import MerchantMenuService from "@/services/merchant/menuService";
import { GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { MenuType } from "../objectTypes";

const menuService = new MerchantMenuService();

const MenuQuery = new GraphQLObjectType({
    name: "MenuQuery",
    fields: {
        menus: {
            description: "Get All Menu by Store Id",
            type: GraphQLList(MenuType),
            args: {
                storeId: {type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: async (_src, {storeId}) => {
                try {
                    return await menuService.getMenuByStoreId(storeId);
                } catch (e) {
                    throw e;
                }
            }
        },
        menuDetail: {
            description: "Get Menu by Id",
            type: MenuType,
            args: {
                id: {type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: async (_src, {id}) => {
                try {
                    return await menuService.getMenuById(id);
                } catch (e) {
                    throw e;
                }
            }
        }
    }
})

export default {
    type: MenuQuery,
    resolve: (_src, _args, ctx) => {
        if(ctx.user !== null) {
            return true
        }
        throw Error("UNAUTHORIZED")
    }
}