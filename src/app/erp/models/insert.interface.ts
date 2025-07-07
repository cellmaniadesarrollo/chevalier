export interface listTypesvoucherI {
    _id?: any; 
    name?: any; 

}
export interface ListPayStatusI {
    _id?: any; 
    name?: any; 
}

export interface VoucherDetail {
  id: string;
  comprobanteNumero: string;
  fechaEmision: string | Date;
  fechaRecepcion: string | Date;
  codigoProducto: string;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  impuesto: number;
  totalLinea: number;
  fechaVencimiento?: string | Date; // Opcional
}