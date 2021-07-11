import MerchantMenuService from "@/services/merchant/menuService";
import { FileType, uploadImage } from "@/utils/uploadFile";
import { GraphQLUpload } from 'graphql-upload';
import { GraphQLBoolean, GraphQLInt, GraphQLObjectType } from "graphql";
import { MenuInputType } from "../inputTypes";

const menuService = new MerchantMenuService()

const MenuMutation = new GraphQLObjectType({
    name: "MenuMutation",
    fields: {
        addMenu: {
            type: GraphQLBoolean,
            args: {
                storeId: {type: GraphQLInt},
                image: {type: GraphQLUpload},
                menu: {type: MenuInputType}
            },
            resolve: async (_src, {menu, storeId, image}, {user}) => {
                try {
                    if(image) {
                        menu.picture = await uploadImage(image, FileType.Menu);
                    }
                    return await menuService.addMenu(menu, storeId, user.id);
                } catch (e) {
                    throw e;
                }
            }
        },
        updateMenu: {
            type: GraphQLBoolean,
            args: {
                storeId: {type: GraphQLInt},
                image: {type: GraphQLUpload},
                menu: {type: MenuInputType}
            },
            resolve: async (_src, {menu, image}, {user}) => {
                try {
                    if(image) {
                        menu.picture = await uploadImage(image, FileType.Menu);
                    }
                    return await menuService.updateMenu(menu, user.id)
                } catch (e) {
                    throw e;
                }
            }
        },
        setStock: {
            type: GraphQLInt,
            args: {
                id: {type: GraphQLInt},
                total: {type: GraphQLInt},
                storeId: {type: GraphQLInt}
            },
            resolve: async (_src, {id, total, storeId}, {user}) => {
                try {
                    return menuService.setStock(id, total, storeId, user.id);
                } catch (e) {
                    throw e;
                }
            }
        },
        deleteMenu: {
            type: GraphQLBoolean,
            args: {
                id: {type: GraphQLInt},
                storeId: {type: GraphQLInt}
            },
            resolve: async (_src, {id, storeId}, {user}) => {
                try {
                    return menuService.deleteMenu(id, storeId, user.id);
                } catch (e) {
                    throw e;
                }
            }
        }
    },
})

export default {
    type: MenuMutation,
    resolve: (_src, _args, ctx) => {
        if(ctx.user !== null) {
            return true
        }
        throw Error("UNAUTHORIZED")
    }
};