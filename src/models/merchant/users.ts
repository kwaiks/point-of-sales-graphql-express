import { Model } from "objection";

export default class MerchantUser extends Model {
    id?: number;
    email: string;
    password?: string;
    phone: string;
    firstName: string;
    lastName?: string;
    isVerified?: boolean;
    verifiedAt?: Date;
    photoUrl?: string;

    static tableName = "merchant.users";
}