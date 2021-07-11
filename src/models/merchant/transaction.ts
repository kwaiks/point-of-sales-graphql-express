import { Model } from "objection";

export default class MerchantTransaction extends Model {
    id: number;
    storeId: number;
    transactionTypeId: string;
    custName: string;
    invoiceNo: string;
    subtotal: number;
    discountTotal: number;
    note: string;
    total: number;
    changes: number;
    paid: number;
    paymentMethodId: string;
    employeeId: number;

    static tableName = "merchant.transaction";

    static relationMappings = {
        detail: {
            relation: Model.HasManyRelation,
            modelClass: __dirname + "/transactionDetail",
            join: {
                from: "merchant.transaction.id",
                to: "merchant.transactionDetail.transactionId"
            }
        }
    }
}