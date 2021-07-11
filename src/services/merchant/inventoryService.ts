import { InventoryHistoryType } from "@/config/enums/merchant";
import MerchantInventory from "@/models/merchant/inventory";
import MerchantInventoryHistory from "@/models/merchant/inventoryHistory";
import { log } from "@/utils/logger";
import { PartialModelObject } from "objection";
import MerchantStoreService from "./storeService";

export default class MerchantInventoryService {
    storeService: MerchantStoreService;

    constructor(){
        this.storeService = new MerchantStoreService();
    }

    async addInventory(inventory: PartialModelObject<MerchantInventory>, storeId: number, userId: number){
        try {
            await this.storeService.storeOwned(storeId, userId);
            const res = await MerchantInventory.query().insert({
                code: inventory.code,
                minStock: inventory.minStock,
                name: inventory.name,
                price: inventory.price,
                unit: inventory.unit,
                storeId
            }).returning("*");
            return res;
        } catch (e) {
            log.error(`[MERCHANT - INVENTORY | addInventory(${storeId},${userId})] : ` + e.message + "\nRequest : " + JSON.stringify(inventory))
            throw e;
        }
    }

    async updateInventory(inventory: PartialModelObject<MerchantInventory>, userId: number) {
        try {
            await this.storeService.storeOwned(inventory.storeId, userId);
            const res = await MerchantInventory.query().patchAndFetchById(inventory.id, {
                code: inventory.code,
                minStock: inventory.minStock,
                name: inventory.name,
                price: inventory.price,
                unit: inventory.unit,
            }).returning("*");
            return res;
        } catch (e) {
            log.error(`[MERCHANT - INVENTORY | updateInventory(${userId})] : ` + e.message + "\nRequest : " + JSON.stringify(inventory))
            throw e;
        }
    }

    async deleteInventory(id: number, storeId: number, userId: number) {
        try {
            await this.storeService.storeOwned(storeId, userId);
            await MerchantInventory.query().patch({
                isDeleted: true
            }).where("id","=",id);
            return true;
        } catch (e) {
            log.error(`[MERCHANT - INVENTORY | deleteInventory(${id}, ${storeId}, ${userId})] : ` + e.message);
            throw e;
        }
    }

    async getInventoryByStoreId(storeId: number) {
        try {
            const res = await MerchantInventory.query().select("*").where("storeId","=",storeId);
            return res;
        } catch (e) {
            log.error(`[MERCHANT - INVENTORY | getInventoryByStoreId(${storeId})] : ` + e.message);
            throw e;
        }
    }

    async getInventoryById(id: number) {
        try {
            const res = await MerchantInventory.query().select("*").where("id","=",id).first();
            if(!res) throw Error("Inventory not found");
            return res;
        } catch (e) {
            log.error(`[MERCHANT - INVENTORY | getInventoryById(${id})] : ` + e.message);
            throw e;
        }
    }

    async addStock(id: number, total: number, reason: string, storeId: number, userId: number) {
        try {
            if(total < 0) throw Error("Total must be greater than 0");
            await this.storeService.storeOwned(storeId, userId);
            await MerchantInventoryHistory.query().insert({
                description: reason,
                type: InventoryHistoryType.replenishment,
                total,
                inventoryId: id
            });
            return total;
        } catch (e) {
            log.error(`[MERCHANT - INVENTORY | addStock(${id})] : ` + e.message);
            throw e;
        }
    }

    async reduceStock(id: number, total: number, reason: string, storeId: number, userId: number) {
        try {
            if(total < 0) throw Error("Total must be greater than 0");
            await this.storeService.storeOwned(storeId, userId);
            await MerchantInventoryHistory.query().insert({
                description: reason,
                type: InventoryHistoryType.reduction,
                total,
                inventoryId: id
            });
            return total;
        } catch (e) {
            log.error(`[MERCHANT - INVENTORY | reduceStock(${id})] : ` + e.message);
            throw e;
        }
    }
}