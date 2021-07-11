import MerchantStore from "@/models/merchant/store";
import { log } from "@/utils/logger";
import { PartialModelObject } from "objection";

export default class MerchantStoreService {

    async getStore(userId: number) {
        try {
            const res = await MerchantStore.query().select("*")
                                                    .where("ownerId", "=", userId);
            return res;
        } catch (e) {
            log.error(`[MERCHANT - STORE | getStore(${userId})] : ` + e.message);
            throw e;
        }
    }

    async storeOwned(storeId: number, userId: number) {
        try {
            const res = await MerchantStore.query().select("*")
                                                    .where("id", "=", storeId)
                                                    .where("ownerId", "=", userId)
                                                    .first();
            if(!res){
                throw Error("Store Not Found");
            }
            return true;
        } catch (e) {
            log.error(`[MERCHANT - STORE | storeOwned(${storeId}, ${userId})] : ` + e.message);
            throw e;
        }
    }

    async getStoreById(storeId: number) {
        try {
            const res = await MerchantStore.query().select("*")
                                                    .where("id", "=", storeId)
                                                    .first();
            if(!res){
                throw Error("Store Not Found");
            }
            return res;
        } catch (e) {
            log.error(`[MERCHANT - STORE | getStoreById(${storeId})] : ` + e.message);
            throw e;
        }
    }

    async addStore(store: PartialModelObject<MerchantStore>, userId: number) {
        try {
            await MerchantStore.query().insert({
                ...store,
                ownerId: userId
            });
            return true;
        } catch (e) {
            log.error(`[MERCHANT - STORE | createStore(${userId})] : ` + e.message + "\nRequest : " + JSON.stringify(store));
            throw e;
        }
    }

    async updateStore(store: PartialModelObject<MerchantStore>, userId: number) {
        try {
            await this.storeOwned(store.id, userId);
            await MerchantStore.query().patch({
                address: store.address,
                description: store.description,
                email: store.email,
                lat: store.lat,
                lng: store.lng,
                name: store.name,
                phone: store.phone,
                photoUrl: store.photoUrl
            }).where("id", "=", store.id);
            return true;
        } catch (e) {
            log.error(`[MERCHANT - STORE | updateStore(${userId})] : ` + e.message + "\nRequest : " + JSON.stringify(store));
            throw e;
        }
    }

    async setOpen(storeId: number, isOpen: boolean, userId: number) {
        try {
            await this.storeOwned(storeId, userId);
            await MerchantStore.query().patch({
                isOpen: isOpen
            }).where("id", "=", storeId);
            return true; 
        } catch (e) {
            log.error(`[MERCHANT - STORE | setOpen(${storeId},${userId})] : ` + e.message);
            throw e;
        }
    }
}