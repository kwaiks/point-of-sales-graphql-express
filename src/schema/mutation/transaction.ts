import MerchantTransactionService from "@/services/merchant/transactionService";
import { GraphQLBoolean, GraphQLObjectType } from "graphql";
import { TransactionInputType } from "../inputTypes";
import { TransactionType } from "../objectTypes";

const transactionService = new MerchantTransactionService()

const TransactionMutation = new GraphQLObjectType({
    name: "TransactionMutation",
    fields: {
        createTransaction: {
            type: TransactionType,
            args: {
                transaction: {type: TransactionInputType}
            },
            resolve: async (_src, {transaction}, {user}) => {
                try {
                    return await transactionService.createTransaction(transaction,user.id)
                } catch (e) {
                    throw e;
                }
            }
        }
    },
})

export default {
    type: TransactionMutation,
    resolve: (_src, _args, ctx) => {
        if(ctx.user !== null) {
            return true
        }
        throw Error("UNAUTHORIZED")
    }
};