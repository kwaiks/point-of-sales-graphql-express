import { DiscountType } from "@/config/enums/merchant";
import { Model } from "objection";
import { MenuInventory } from "types/merchant";

export default class MerchantMenu extends Model {
    id: number;
    storeId: number;
    name: string;
    code: string;
    description: string;
    picture: string;
    stock: number;
    price: number;
    priceGrab: number;
    priceGojek: number;
    isDiscount: boolean;
    isUsingInventory: boolean;
    isDeleted: boolean;
    priceDiscount: number;
    discountType: DiscountType;
    inventories?: MenuInventory[];

    static tableName = "merchant.menu";
}