import { GraphQLUpload } from "apollo-server";
import { GraphQLInputObjectType, GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLFloat, GraphQLNonNull, GraphQLList } from "graphql";

export const StoreInputType = new GraphQLInputObjectType({
    name: "StoreInputType",
    fields: {
        id: {type: GraphQLInt},
        name: {type: GraphQLNonNull(GraphQLString)},
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

export const MenuInventoryInputType = new GraphQLInputObjectType({
    name: "MenuInventoryInputType",
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

export const TransactionDetailInputType = new GraphQLInputObjectType({
    name: "TransactionDetailInputType",
    fields: {
        menuId: {type: GraphQLInt},
        qty: {type: GraphQLInt}
    }
});

export const TransactionInputType = new GraphQLInputObjectType({
    name: "TransactionInputType",
    fields: {
        storeId: {type: GraphQLInt},
        transactionTypeId: {type: GraphQLString},
        custName: {type: GraphQLString},
        note: {type: GraphQLString},
        paid: {type: GraphQLFloat},
        paymentMethodId: {type: GraphQLString},
        details: {type: GraphQLList(TransactionDetailInputType)}
    }
})

export const InventoryInputType = new GraphQLInputObjectType({
    name: "InventoryInputType",
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

export const MenuInputType = new GraphQLInputObjectType({
    name: "MenuInputType",
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
        inventories: {type: GraphQLList(MenuInventoryInputType)}
    }
})