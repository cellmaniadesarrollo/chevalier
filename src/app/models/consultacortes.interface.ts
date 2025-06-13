export interface SaleItem {
  item: string;
  price: number;
}

export interface RelatedSale {
  _id: string;
  productsOrServices: {
    item: string;
    price: number;
  } | SaleItem[];
  saleDate: string | Date;
  barberName: string;
  cashierName: string;
}

export interface CustomerTicket {
  _id: string;
  customer: string;
  counter: number;
  service: string;
  serviceName: string;
  names: string;
  lastnames: string;
  relatedSales: RelatedSale[];
}



export interface Customer {
  _id: string;
  customer: string;
  freeCuts: number;
  names: string;
  lastNames: string;
}

export interface ProductOrService {
  _id: string;
  name: string;
  description: string;
}

export interface FidelityDiscount {
  _id: string;
  name: string;
  discountType: string;
  validFrom: string | Date;
  validUntil: string | Date;
  value: number;
  customer: Customer;
  discounttypename: string;
  productsOrServices2: ProductOrService[];
}