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