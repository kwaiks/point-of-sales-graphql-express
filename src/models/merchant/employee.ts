import { Model } from "objection";

export default class MerchantEmployee extends Model {
    id: number;
    storeId: number;
    passCode: string;
    name: string;
    roleId: string;

    static tableName = "merchant.employee";
}