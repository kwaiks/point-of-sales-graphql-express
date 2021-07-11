import { Model } from "objection";

export default class MerchantInventory extends Model {
    id: number;
    storeId: number;
    name: string;
    code: string;
    unit: string;
    minStock: number;
    stock: number;
    price: number;
    isDeleted: boolean;

    static tableName = "merchant.inventory";
}