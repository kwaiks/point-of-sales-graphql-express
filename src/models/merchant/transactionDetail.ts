import { Model } from "objection";

export default class MerchantTransactionDetail extends Model {
    id: number;
    transactionId: number;
    menuId: number;
    qty: number;
    name: string;
    price: number;
    priceDiscount: number;

    static tableName = "merchant.transactionDetail";
}