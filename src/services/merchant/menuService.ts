import MerchantMenu from "@/models/merchant/menu";
import MerchantMenuInventory from "@/models/merchant/menuInventory";
import { log } from "@/utils/logger";
import { PartialModelObject, transaction } from "objection";
import MerchantStoreService from "./storeService";

export default class MerchantMenuService {
    storeService: MerchantStoreService = null;

    constructor() {
        this.storeService = new MerchantStoreService();
    }


    async getMenuByStoreId(storeId: number) {
        try {
            const res = await MerchantMenu.query().select("*")
                                                    .where("isDeleted","=",false)
                                                    .where("storeId", "=", storeId);
            return res;
        } catch (e) {
            log.error(`[MERCHANT - MENU | getMenuByStoreId(${storeId})] : ` + e.message);
            throw e;
        }
    }

    async getMenuById(id: number) {
        try {
            const res = await MerchantMenu.query().select("*")
                                                    .where("isDeleted","=", false)
                                                    .where("id", "=", id)
                                                    .first();
            if(!res){
                throw Error("Menu not found");
            }
            const inventories: any = await MerchantMenuInventory.query().select([
                                                                        {id: "menuInventory.id"},
                                                                        "menuId",
                                                                        "inventoryId",
                                                                        "name",
                                                                        "code",
                                                                        "unit",
                                                                        "total",
                                                                        "minStock",
                                                                        "stock",
                                                                        "price"])
                                                                    .where("menuId", "=", res.id)
                                                                    .innerJoin(
                                                                        "merchant.inventory", 
                                                                        "merchant.menuInventory.inventoryId", 
                                                                        "=", 
                                                                        "merchant.inventory.id");
            if(res.isUsingInventory){
                res.inventories = inventories;
                let stocks: number[] = []
                inventories.forEach((inv) => {
                    stocks.push(Math.floor(inv.stock/inv.total));
                })
                res.stock = Math.min(...stocks);
            }
            return res;
        } catch (e) {
            log.error(`[MERCHANT - MENU | getMenuById(${id})] : ` + e.message);
            throw e;
        }
    }

    async addMenu(menu: PartialModelObject<MerchantMenu>, storeId: number, userId: number) {
        try {
            await this.storeService.storeOwned(storeId, userId);
            await transaction(MerchantMenu, MerchantMenuInventory, async (mm, mi) => {
                const newMenu = await mm.query().insert({
                    code: menu.code,
                    description: menu.description,
                    discountType: menu.discountType,
                    isDiscount: menu.isDiscount,
                    isUsingInventory: menu.isUsingInventory,
                    name: menu.name,
                    price: menu.price,
                    priceDiscount: menu.priceDiscount,
                    picture: menu.picture,
                    priceGojek: menu.priceGojek,
                    priceGrab: menu.priceGrab,
                    storeId
                }).returning("id");
                if(menu.inventories){
                    const inventories = menu.inventories.map((el) => ({
                        ...el,
                        menuId: newMenu.id,
                        inventoryId: el.inventoryId,
                        total: el.total
                    }));
                    await mi.query().insert(inventories);
                }
            })
            return true;
        } catch (e) {
            log.error(`[MERCHANT - MENU | addMenu(${storeId},${userId})] : ` + e.message + "\nRequest : " + JSON.stringify(menu))
            throw e;
        }
    }

    async updateMenu(menu: PartialModelObject<MerchantMenu>, userId: number) {
        try {
            await this.storeService.storeOwned(menu.storeId, userId);
            await transaction(MerchantMenu, MerchantMenuInventory, async (mm, mi) => {
                await mm.query().patch({
                    code: menu.code,
                    description: menu.description,
                    discountType: menu.discountType,
                    isDiscount: menu.isDiscount,
                    isUsingInventory: menu.isUsingInventory,
                    name: menu.name,
                    picture: menu.picture,
                    price: menu.price,
                    stock: menu.stock,
                    priceDiscount: menu.priceDiscount,
                    priceGojek: menu.priceGojek,
                    priceGrab: menu.priceGrab,
                }).where("id","=",menu.id);
                if(menu.inventories && menu.isUsingInventory){
                    const inventories = menu.inventories.map((el) => ({
                        id: el.id,
                        inventoryId: el.inventoryId,
                        menuId: menu.id,
                        total: el.total
                    }));
                    await mi.query().del().where("menuId","=",menu.id);
                    await mi.query().insert(inventories);
                }
            })
            return true;
        } catch (e) {
            log.error(`[MERCHANT - MENU | updateMenu(${userId})] : ` + e.message + "\nRequest : " + JSON.stringify(menu));
            throw e;
        }
    }

    async setStock(id: number, total: number, storeId: number, userId: number) {
        try {
            if(total < 0) throw Error("Total must be greater than 0")
            await this.storeService.storeOwned(storeId, userId);
            const menu = await MerchantMenu.query().select(["isUsingInventory","stock"]).where("id","=",id).first();
            if(menu.isUsingInventory) {
                return menu.stock;
            }
            await MerchantMenu.query().patch({
                stock: total
            }).where("id","=",id)
            return total;
        } catch (e) {
            log.error(`[MERCHANT - MENU | setStock(${id},${storeId},${userId})] : ` + e.message);
            throw e;
        }
    }

    async deleteMenu(id: number, storeId: number, userId: number) {
        try {
            await this.storeService.storeOwned(storeId, userId);
            await MerchantMenu.query().patch({
                isDeleted: true
            }).where("id","=",id)
            return true;
        } catch (e) {
            log.error(`[MERCHANT - MENU | deleteMenu(${id},${storeId},${userId})] : ` + e.message);
            throw e; 
        }
    }
}