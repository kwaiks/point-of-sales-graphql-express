import { Model } from "objection";

export default class MerchantEmployeeRole extends Model {
    id: string;
    name: string;
    roleFeatureId: number;

    static tableName = "merchant.employeeRole";
}