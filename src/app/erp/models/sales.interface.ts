export interface ListSalesI {
    _id:string;
    saleNumber: number;
    client: string;
    barber: string;
    saleDate: Date;
    total: number;
    productService: string; // Nombre de producto o servicio
    seller: string; // Nombre del vendedor
    type: 'producto' | 'servicio'; // Tipo de venta

}
export interface GroupedSalesI {
  _id: string; // Identificador único de la venta
  saleNumber: number; // Número de la venta
  observations: string; // Observaciones sobre la venta
  client: {
    dni: string; // Documento de identificación del cliente
    names: string; // Nombres del cliente
    lastNames: string; // Apellidos del cliente
  };
  barber: {
    firstname: string; // Nombre del barbero
    lastname: string; // Apellido del barbero
  };
  cashier: {
    firstname: string; // Nombre del cajero
    lastname: string; // Apellido del cajero
  };
  productsOrServices: {
    item: string; // ID del producto o servicio
    price: number; // Precio del producto o servicio
    productName: string; // Nombre del producto o servicio
    discountDetails: {
      value: number; // Valor del descuento
      type: 'PERCENTAGE' | 'FIXED'; // Tipo de descuento (porcentaje o fijo)
    };
  }[];
  saleDate: string; // Fecha de la venta
  paymentMethod: {
    name: string; // Método de pago (e.g., 'EFECTIVO')
  };
}
  
export interface ListBarberI {
    id: string;
    name: string;
  }
  
  export interface ListTypeproductserviceI{
    _id?:any;
    name?:any;
  }