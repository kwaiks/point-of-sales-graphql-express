import { Model } from "objection";

export default class MerchantUserVerification extends Model {
    id: string;
    userId: number;
    updatedAt: Date;

    static tableName = "merchant.user_verification";
}