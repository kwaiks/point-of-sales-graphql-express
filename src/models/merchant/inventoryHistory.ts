import { InventoryHistoryType } from "@/config/enums/merchant";
import { Model } from "objection";

export default class MerchantInventoryHistory extends Model {
    id: number;
    inventoryId: number;
    menuId: number;
    description: string;
    price: number;
    total: number;
    type: InventoryHistoryType;

    static tableName = "merchant.inventoryHistory";
}