import { Model } from "objection";

export default class MerchantMenuInventory extends Model {
    id: number;
    menuId: number;
    inventoryId: number;
    total: number;

    static tableName = "merchant.menuInventory";
}