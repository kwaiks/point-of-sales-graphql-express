import { Model } from "objection";

export default class InternalUser extends Model {
    id: number;
    email: string;
    password: string;
    name: string;
    photoUrl: string;

    static tableName = "internal.users";
}