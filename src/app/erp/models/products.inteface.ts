export interface ListProductsI {
    name?: any;
    price?: any;
    prices?: any[];
    _id?: any;
}
export interface ListProductsSelectedI {
    name?: any;
    price?: any;
    prices?: any[];
    _id?: any;
    discount?:{
        _id?: any;
        discountType?: any;
        value?: any;
        name?:any;
    }[];
    selectedDiscount?:any;
}
export interface ListDiscounts {
    _id: string;
    name: string;
    description: string;
    value: number;
    isGlobal: boolean;
    discountType: string;
    productsOrServices: { _id: string; name: string }[]; 
  } 
  export interface ListCountry {
  id: string; 
  name: string; 
}
export interface ListRimpe {
  id: string; 
  name: string; 
}