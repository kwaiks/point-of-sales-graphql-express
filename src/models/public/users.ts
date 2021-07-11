import { Model } from "objection";

export default class User extends Model {
    id: number;
    email: string;
    password: string;
    name: string;
    phone: string;
    firstName: string;
    lastName: string;
    photoUrl: string;

    static tableName = "users";
}