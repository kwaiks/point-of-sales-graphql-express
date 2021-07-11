import MerchantUserService from "./userService";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import MerchantUser from "@/models/merchant/users";
import { PartialModelObject } from "objection";

export default class MerchantAuthService extends MerchantUserService{
    async login(cred: string, password: string) {
        try {
            const user = await this.getUserByEmailOrPhone(cred);
            const passMatch = bcrypt.compareSync(password, user.password);
            if(!passMatch) throw Error("Password did not match");
            const payload = {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                photoUrl: user.photoUrl,
                phone: user.phone,
                isVerified: user.isVerified,
                verifiedAt: user.verifiedAt
            }
            const token = jwt.sign({
                id: user.id,
                email: user.email,
                phone: user.phone
            }, process.env.PRIVATE_KEY);
            return {
                user: payload,
                token
            }
        } catch (e) {
            throw e;
        }
    }

    async register(user: PartialModelObject<MerchantUser>) {
        try {
            await this.addUser(user);
            return true;
        } catch (e) {
            throw e;
        }
    }
}