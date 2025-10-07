export interface ListProductsI {
  quantitymax?: any;
  batchId?: any;
  quantity?: any;
  name?: any;
  price?: any;
  prices?: any[];
  _id?: any;
}
export interface ColaboradorI {
  barbero?: any;
  valor?: number;
}

export interface ListProductsSelectedI {
  quantitymax?: any;
  batchId?: any;
  quantity?: any;
  name?: any;
  price?: any;
  prices?: any[];
  _id?: any;
  discount?: {
    _id?: any;
    discountType?: any;
    value?: any;
    name?: any;
    main_discount?: boolean;
    collaborators_discount?: boolean;
  }[];
  selectedDiscount?: any;
  collaborators?: any;
  colaboradoresSeleccionados?: ColaboradorI[];
}
export interface ListDiscounts {
  _id: string;
  name: string;
  description: string;
  value: number;
  isGlobal: boolean;
  discountType: string;
  main_discount?: boolean;
  collaborators_discount?: boolean;
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