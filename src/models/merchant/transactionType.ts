import { Model } from "objection";

export default class MerchantTransactionType extends Model {
    id: string;
    name: string;

    static tableName = "merchant.transactionType";
}