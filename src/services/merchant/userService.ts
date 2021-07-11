import MerchantUser from "@/models/merchant/users";
import MerchantUserVerification from "@/models/merchant/userVerification";
import { log } from "@/utils/logger";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { PartialModelObject, transaction } from "objection";

export default class MerchantUserService {
    async getUserById(userId: number) {
        try {
            const user = await MerchantUser.query().select("*")
                                                    .where("id","=",userId)
                                                    .first();
            if(!user) throw Error("User not found");
            return user;
        } catch (e) {
            log.error(`[ MERCHANT - USER | getUserById(${userId}) ] : ` + e.message);
            throw e;
        }
    }


    async getUserByEmailOrPhone(cred: string) {
        try {
            const user = await MerchantUser.query().select("*")
                                                    .whereRaw("LOWER(email) = ?",[cred.toLowerCase()])
                                                    .orWhere("phone","=",cred)
                                                    .first();
            if(!user) throw Error("User not found");
            return user;
        } catch (e) {
            log.error(`[ MERCHANT - USER | getUserByEmailOrPhone(${cred}) ] : ` + e.message);
            throw e;
        }
    }

    async updateUser(user: MerchantUser, userId: number) {
        try {
            await MerchantUser.query().patch({
                firstName: user.firstName,
                lastName: user.lastName,
                photoUrl: user.photoUrl
            }).where("id","=",userId)
        } catch (e) {
            log.error(`[ MERCHANT - USER | updateUser(${userId}) ] : ` + e.message + "\nRequest : " + JSON.stringify(user));
            throw e;
        }
    }

    async updatePassword(oldPass: string, newPass:string, userId: number) {
        try {
            const user = await this.getUserById(userId);
            const passMatch = bcrypt.compareSync(oldPass, user.password);
            if(!passMatch) throw Error("Password did not match");
            newPass = bcrypt.hashSync(newPass, 12);
            await MerchantUser.query().patch({
                password: newPass
            }).where("id","=",userId);
            return true;
        } catch (e) {
            log.error(`[ MERCHANT - USER | updatePassword(${userId}) ] : ` + e.message);
            throw e;
        }
    }

    async addUser(user: PartialModelObject<MerchantUser>) {
        try {
            const exist = await MerchantUser.query().select("*")
                                                    .whereRaw("LOWER(email) = ?",[user.email.toLowerCase()])
                                                    .orWhere("phone","=",user.phone)
                                                    .first();
            if(exist) throw Error("Email or Phone have been used");
            if(!user.phone.startsWith("+")) throw Error("Invalid phone number");
            const password = bcrypt.hashSync(user.password, 12);
            const uuid = v4();
            const code = await transaction(MerchantUser, MerchantUserVerification, async (mu, muv) => {
                const newUser = await mu.query().insert({
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    password,
                }).returning("id");
                const verificationCode = await muv.query().insert({
                    id: uuid,
                    userId: newUser.id
                }).returning("id");
                return verificationCode;
            });
            return code;
        } catch (e) {
            log.error(`[ MERCHANT - USER | addUser ] : ` + e.message + "\nRequest : " + JSON.stringify(user));
            throw e;
        }
    }
}