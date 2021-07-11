import { InventoryHistoryType, TransactionType } from "@/config/enums/merchant";
import MerchantMenu from "@/models/merchant/menu";
import { Transaction } from "types/merchant";
import MerchantStoreService from "./storeService";
import { DBError, PartialModelObject, transaction as trx } from "objection";
import MerchantTransaction from "@/models/merchant/transaction";
import MerchantTransactionDetail from "@/models/merchant/transactionDetail";
import MerchantInventory from "@/models/merchant/inventory";
import MerchantInventoryHistory from "@/models/merchant/inventoryHistory";
import { log } from "@/utils/logger";

export default class MerchantTransactionService {
    storeService: MerchantStoreService;

    constructor() {
        this.storeService = new MerchantStoreService();
    }

    async createTransaction(transaction: Transaction, userId: number) {
        try {
            await this.storeService.storeOwned(transaction.storeId, userId);
            const menusId = transaction.details.map((el) => el.menuId);
            const menus = await MerchantMenu.query().select([
                                                                "id",
                                                                "name", 
                                                                "price", 
                                                                "priceGojek", 
                                                                "priceGrab", 
                                                                "priceDiscount", 
                                                                "isDiscount", 
                                                                "discountType",
                                                                "isUsingInventory",
                                                                "stock"])
                                                            .where("id", "in", menusId);
            transaction.details = transaction.details.map((el) => {
                const menu = menus.find((item) => Number(item.id) === Number(el.menuId));
                let price = menu.price;

                if (menu.isDiscount && !(transaction.transactionTypeId === "gojek" || transaction.transactionTypeId === "grab")){
                    el.priceDiscount =menu.discountType === "fixed" ? menu.priceDiscount : (menu.priceDiscount/100)*menu.price;
                }
                if(transaction.transactionTypeId === TransactionType.gojek) {
                    price = menu.priceGojek
                }
                if (transaction.transactionTypeId === TransactionType.grab) {
                    price = menu.priceGrab
                }
                return {
                    menuId: el.menuId,
                    qty: el.qty,
                    name: menu.name,
                    price: price,
                    priceDiscount: el.priceDiscount ?? 0
                }
            });
            const discountTotal = transaction.details.reduce((prev, cur) => prev + (cur.priceDiscount * cur.qty), 0);
            const subtotal = transaction.details.reduce((prev, cur) => prev + (cur.price * cur.qty), 0);
            const total = subtotal - discountTotal;
            if(transaction.paymentMethodId === "cash" && (transaction.paid < total)) {
                throw Error("Paid amount should be greater than total")
            }
            const res = await trx(MerchantTransaction, 
                                    MerchantTransactionDetail, 
                                    MerchantInventory, 
                                    MerchantMenu, 
                                    MerchantInventoryHistory,
                                    async (mt, mtd, mi, mm, mih) => {
                const newTrx = await mt.query().insert({
                    discountTotal,
                    total,
                    subtotal,
                    paid: transaction.paid,
                    changes: (transaction.paid - total),
                    note: transaction.note,
                    custName: transaction.custName,
                    paymentMethodId: transaction.paymentMethodId,
                    transactionTypeId: transaction.transactionTypeId,
                    storeId: transaction.storeId
                });
                transaction.details = transaction.details.map((el) => ({
                    ...el,
                    transactionId: newTrx.id
                }))
                await mtd.query().insert(transaction.details);
                await Promise.all(menus.map( async (row) => {
                    const qty = transaction.details.find((el) => Number(el.menuId) === Number(row.id)).qty;
                    if(row.isUsingInventory){
                        const inventories = await mi.query().select(["inventory.id","price","total","stock"])
                                                                        .innerJoin("merchant.menuInventory", "merchant.menuInventory.inventoryId", "=", "merchant.inventory.id")
                                                                        .where("menuInventory.menuId", "=", row.id);
                        const inventoryHistory: PartialModelObject<MerchantInventoryHistory>[] = inventories.map((el): PartialModelObject<MerchantInventoryHistory> => ({
                            inventoryId: el.id,
                            menuId: row.id,
                            total: el["total"] * qty,
                            type: InventoryHistoryType.transaction
                        }))
                        await mih.query().insert(inventoryHistory);
                        return;
                    }
                    await mm.query().patch({
                        stock: row.stock - qty,
                    }).where("id","=", row.id);
                    return;
                }));
                return newTrx;
            })
            const trans = await MerchantTransaction.query().select("*").where("id", "=", res.id).first();
            return trans;
        } catch (e) {
            if(e instanceof DBError){
                if(e.message.endsWith("out of stock")){
                    const msg = e.message.split(" - ");
                    e.message = msg.find((el) => el.includes("out of stock"))
                }
            }
            log.error("[MERCHANT - TRANSACTION | createTransaction] : " + e.message + "\nRequest : " + JSON.stringify(transaction));
            throw e;
        }
    }
}