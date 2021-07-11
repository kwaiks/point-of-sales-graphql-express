import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";

export const StoreType = new GraphQLObjectType({
    name: "StoreType",
    fields: {
        id: {type: GraphQLInt},
        name: {type: GraphQLString},
        phone: {type: GraphQLString},
        email: {type: GraphQLString},
        address: {type: GraphQLString},
        photoUrl: {type: GraphQLString},
        description: {type: GraphQLString},
        isOpen: {type: GraphQLBoolean},
        lat: {type: GraphQLFloat},
        lng: {type: GraphQLFloat}
    }
})

export const InventoryType = new GraphQLObjectType({
    name: "InventoryType",
    fields: {
        id: {type: GraphQLInt},
        storeId: {type: GraphQLInt},
        name: {type: GraphQLString},
        code: {type: GraphQLString},
        unit: {type: GraphQLString},
        minStock: {type: GraphQLInt},
        stock: {type: GraphQLInt},
        price: {type: GraphQLFloat}
    }
})

export const TransactionType = new GraphQLObjectType({
    name: "TransactionType",
    fields: {
        id: {type: GraphQLInt},
        transactionTypeId: {type: GraphQLString},
        invoiceNo: {type: GraphQLString},
        subtotal: {type: GraphQLFloat},
        discountTotal: {type: GraphQLFloat},
        note: {type: GraphQLString},
        total: {type: GraphQLFloat},
        changes: {type: GraphQLFloat},
        paid: {type: GraphQLFloat},
        paymentMethodId: {type: GraphQLString}
    }
})

export const MenuInventoryType = new GraphQLObjectType({
    name: "MenuInventoryType",
    fields: {
        id: {type: GraphQLInt},
        menuId: {type: GraphQLInt},
        inventoryId: {type: GraphQLInt},
        name: {type: GraphQLString},
        total: {type: GraphQLInt},
        code: {type: GraphQLString},
        unit: {type: GraphQLString},
        minStock: {type: GraphQLInt},
        stock: {type: GraphQLInt},
        price: {type: GraphQLFloat}
    }
})

export const MenuType = new GraphQLObjectType({
    name: "MenuType",
    fields: {
        id: {type: GraphQLInt},
        storeId: {type: GraphQLInt},
        name: {type: GraphQLString},
        code: {type: GraphQLString},
        description: {type: GraphQLString},
        picture: {type: GraphQLString},
        stock: {type: GraphQLInt},
        price: {type: GraphQLFloat},
        priceGrab: {type: GraphQLFloat},
        priceGojek: {type: GraphQLFloat},
        isDiscount: {type: GraphQLBoolean},
        isUsingInventory: {type: GraphQLBoolean},
        priceDiscount: {type: GraphQLFloat},
        discountType: {type: GraphQLString},
        inventories: {type: GraphQLList(MenuInventoryType)}
    }
})