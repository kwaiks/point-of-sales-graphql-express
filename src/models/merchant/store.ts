import { Model } from "objection";

export default class MerchantStore extends Model {
    id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
    photoUrl: string;
    description: string;
    isOpen: boolean;
    lat: number;
    lng: number;
    ownerId: number;

    static tableName = "merchant.store";
}