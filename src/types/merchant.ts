export interface MenuInventory {
    id: number;
    menuId: number;
    inventoryId: number;
    total: number;
    name: string;
    code: string;
    unit: string;
    minStock: number;
    stock: number;
    price: number;
}

export interface TransactionDetail {
    id?: number;
    transactionId?: number;
    menuId: number;
    qty: number;
    name?: string;
    price?: number;
    priceDiscount?: number;
}

export interface Transaction {
    storeId: number;
    transactionTypeId: string;
    custName: string;
    note: string;
    paid: number;
    paymentMethodId: string;
    details: TransactionDetail[];
}