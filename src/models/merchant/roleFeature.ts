import { Model } from "objection";

export default class MerchantRoleFeature extends Model {
    id: number;
    menuName: string;

    static tableName = "merchant.roleFeature";
}