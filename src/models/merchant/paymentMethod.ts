import { PaymentMethodType } from "@/config/enums/merchant";
import { Model } from "objection";

export default class MerchantPaymentMethod extends Model {
    id: string;
    name: string;
    type: PaymentMethodType;
    
    static tableName = "merchant.paymentMethod";
}