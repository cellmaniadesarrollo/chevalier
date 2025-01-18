import { Component, ElementRef, ViewChild  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AddclientComponent } from '../../layout/addclient/addclient.component';
import { MatDialog } from '@angular/material/dialog';
import { ClientsService } from '../../service/clients/clients.service';
import { ListClientsI } from '../../models/clients.inteface';
import { ProductsService } from '../../service/products/products.service';
import { ListProductsI, ListProductsSelectedI, ListDiscounts } from '../../models/products.inteface';
import { ListHairdresserI } from '../../models/hairdresser.interface';
import { ListpaymentMethodsI, ListdiscountsI, ListfinancialentitysI } from '../../models/payment.interface';
import { SalesService } from '../../service/sales/sales.service';
import { Observable } from 'rxjs';
import { ListSalesI, GroupedSalesI } from '../../models/sales.interface';
import { DiscountModalComponent } from '../../layout/discount-modal/discount-modal.component';
@Component({
  selector: 'app-serviceandcuts',
  templateUrl: './serviceandcuts.component.html',
  styleUrl: './serviceandcuts.component.css'
})
export class ServiceandcutsComponent {
  @ViewChild('searchInput') searchInput!: ElementRef;
  corteForm!: FormGroup;
  modalVisible: boolean = false;
  openModal() {
    this.modalVisible = true;
  }
  closeModal(event: { data: any }) {
    // if (event.data.close) {
    this.modalVisible = false;
    // }
    // if (event.data.data.id) {
    //   this.nameite.unshift({
    //     _id: event.data.data.id,
    //     name_nameitems: event.data.data.name,
    //   });
    //   // this.seleccionarSugerencia(
    //   //   event.data.data.name,
    //   //   event.data.data.id,
    //   //   'name_items'
    //   // );
    // }
  }
  // Datos estáticos
  clientes: ListClientsI[] = [];

  barberos: ListHairdresserI[] = [];

  servicios: ListProductsI[] = [];
  todosLosServicios: ListProductsI[] = [];
  // Datos de descuentos
  descuentos: ListDiscounts[] = [];
  // Datos de formas de pago
  formasPagos: ListpaymentMethodsI[] = [];
  formasPagosFiltradas: ListpaymentMethodsI[] = [];
  sales1: ListSalesI[] = [];
  groupedSales: GroupedSalesI[] = [];
  // Servicios agregados
  serviciosAgregados: ListProductsSelectedI[] = [];

  total = 0;
  totalConDescuento = 0;
  // Columnas para la tabla
  displayedColumns: string[] = ['servicio', 'precio', 'descuento', 'acciones'];

  // Datos del encabezado de la factura
  facturaInfo = {
    fecha: '2024-10-15',
    comprobante: '',
    cobrador: ''
  };

  constructor(private fb: FormBuilder, public dialog: MatDialog, private clients: ClientsService, private products: ProductsService, private sales: SalesService) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddclientComponent, {
      width: '600px',
      // height: '400px',
      disableClose: true,
    });

    dialogRef.componentInstance.closeModalEvent.subscribe((result: any) => {
      if (result.close) {
        this.normalfind(result.data)
      }

    });
  }

  async normalfind(clienteBuscadorValue: any) {
    const data = await this.clients.findClient({ find: clienteBuscadorValue })
    this.clientes = data
    this.corteForm.patchValue({
      clienteBuscador: data[0],

    });
    this.salesfinddiscount(clienteBuscadorValue)
  }


  ngOnInit() {
    this.getnewdata()
    this.corteForm = this.fb.group({
      clienteBuscador: ['', Validators.required],
      servicioBuscador: ['', Validators.required],
      barberoBuscador: new FormControl(''),//['', Validators.required], 
      observaciones: [''],
      formaPagoBuscador: ['', Validators.required], // Agregar el control para forma de pago
      entidadBancariaBuscador: [''],
      entidadBancaria: [''],
      numeroTransferencia: [''],
    });


  }

  // Calcular total con descuento dependiendo del tipo (PERCENTAGE o FIXED)
  calcularTotalConDescuento(descuento: ListdiscountsI | null) {
    if (!descuento) {
      this.totalConDescuento = this.total; // Sin descuento, total es igual
      return;
    }

    if (descuento.discountType === 'PERCENTAGE') {
      const porcentaje = descuento.value || 0;
      const descuentoAplicado = (this.total * porcentaje) / 100;
      this.totalConDescuento = this.total - descuentoAplicado;
    } else if (descuento.discountType === 'FIXED') {
      const descuentoFijo = descuento.value || 0;
      this.totalConDescuento = this.total - descuentoFijo;
    }
  }

  async getnewdata() {
    const data = await this.sales.getNewSalesData()
    console.log(data)
    this.facturaInfo.cobrador = data.user
    this.facturaInfo.fecha = data.date
    this.barberos = data.hairdresser
    this.servicios = data.services
    this.todosLosServicios = data.services
    this.formasPagos = data.paymentmethods
    this.formasPagosFiltradas = this.formasPagos;
    this.corteForm.patchValue({
      formaPagoBuscador: this.formasPagos[0],

    });
    this.sales1 = data.products;
    this.groupedSales = data.products;
  }

  getTotalWithoutDiscount(productsOrServices: { price: number }[]): number {
    return productsOrServices.reduce((total, item) => total + item.price, 0);
  }
  // Calcular el total de los productos o servicios incluyendo descuentos
  getTotal(
    productsOrServices: { price: number }[],
    discount: { value: number; type: string }
  ): number {
    const subtotal = productsOrServices.reduce((total, item) => total + item.price, 0);

    if (discount.type === 'PERCENTAGE') {
      const discountValue = (subtotal * discount.value) / 100;
      return +(subtotal - discountValue).toFixed(2); // Redondear a 2 decimales
    } else if (discount.type === 'FIXED') {
      return Math.max(subtotal - discount.value, 0); // Evitar valores negativos
    }

    // Si el tipo de descuento no es válido, retornar subtotal
    return subtotal;
  }



  // Método para agregar servicio
  agregarServicio(serv: any) {
    const servicio = this.corteForm.get('servicioBuscador')?.value as ListProductsI;
    if (servicio && !this.serviciosAgregados.includes(servicio)) {

      this.serviciosAgregados = [...this.serviciosAgregados, servicio];  // Clona la lista para actualizar la referencia

      this.calcularTotal();
    }
  }

  // Método para manejar el cambio de selección de precio en el select
  handlePriceChange(element: any): void {
    if (element.selectedPrice !== 'custom') {
      element.price = element.selectedPrice; // Actualiza el precio con el valor seleccionado
      element.customPrice = null; // Resetea el campo personalizado si se elige un precio predeterminado
    }
    this.calcularTotal(); // Actualizar el total cuando se selecciona un precio
  }

  // Método para manejar el cambio en el precio personalizado
  updateCustomPrice(element: any): void {
    if (element.selectedPrice === 'custom' && element.customPrice) {
      element.price = element.customPrice; // Actualiza el precio con el valor ingresado en el input
    }

    //element.price = element.customPrice;
    this.calcularTotal(); // Actualizar el total cuando se cambia el precio personalizado
  }


  // Calcular el total de servicios agregados
  totales = {
    subtotal: 0,
    totalDescuento: 0,
    total: 0
  };
  calcularTotal() {
    this.aplicarDescuentos(this.serviciosAgregados, this.descuentos)
    this.calcularTotales(this.serviciosAgregados);



  }
  // Método para eliminar un servicio de la lista
  eliminarServicio(element: any): void {
    // Lógica para eliminar el servicio de la lista
    const index = this.serviciosAgregados.indexOf(element);
    if (index > -1) {
      this.serviciosAgregados.splice(index, 1);
      this.serviciosAgregados = [...this.serviciosAgregados];
      this.calcularTotal();
    }

  }
  isSubmitting = false;
  // Método para manejar el envío del formulario
  onSubmit() {
    if (this.corteForm.valid || this.isSubmitting) {
      this.isSubmitting = true;

      // Realiza el envío del formulario
      // Aquí podrías enviar los datos al servidor
      // Simulamos un retraso de 2 segundos para la respuesta
      setTimeout(() => {
        // Aquí restablece el estado del botón después de completar la acción
        this.isSubmitting = false;
      }, 2000); // Cambia el tiempo según lo que necesites
      this.savedatasales(this.corteForm.value, this.serviciosAgregados, this.totales)

    }
  }
  async savedatasales(formulario: any, servicios: any, total: any) {
    const datosFiltrados = servicios.map((servicio: any) => {
      return {
        _id: servicio._id,
        price: servicio.price,
        discount:servicio.selectedDiscount._id
      };
    });
    const formset = {
      cliente: formulario.clienteBuscador._id,
      barbero: formulario.barberoBuscador._id, 
      observaciones: formulario.observaciones,
      formaPago: formulario.formaPagoBuscador._id,
      entidadBancaria: formulario.entidadBancariaBuscador._id || "",
      numeroTransferencia: formulario.numeroTransferencia,
      productosservcio: datosFiltrados,
      total
    }
    const data = await this.sales.Salessave(formset)

    if (data._id) {
      this.print(data)

      this.ngOnInit()
      this.serviciosAgregados = []
    }
  }



  formaPagoSeleccionada: boolean = false;
  bancos: ListfinancialentitysI[] = [];
  bancosFiltrados: ListfinancialentitysI[] = [];

  onEntidadBancariaSeleccionada(banco: string): void {
    this.corteForm.get('entidadBancaria')?.setValue(banco);
  }

  displayEntidadBancaria(banco: ListfinancialentitysI): string {
    return banco ? banco.name : '';
  }

  // Método para filtrar bancos
  filtrarBancos(valor: string): void {

    const filterValue = valor.toUpperCase();
    this.bancosFiltrados = this.bancos.filter(banco => banco.name.includes(filterValue));
  }
  onFormaPagoSeleccionada(event: any): void {
    const selectedFormaPago = event.name;
    if (selectedFormaPago === 'TRANSFERENCIA') {
      this.getfinancialentitys()

      this.formaPagoSeleccionada = true;
    } else {
      this.formaPagoSeleccionada = false;
    }
  }
  async getfinancialentitys() {
    const data = await this.sales.getSalesfinancialentitys()
    this.bancos = data;
    this.bancosFiltrados = this.bancos;
    this.corteForm.get('entidadBancariaBuscador')?.valueChanges.subscribe((valor) => {
      this.filtrarBancos(valor);
    });
  }


  // Métodos para mostrar el nombre en el autocomplete
  displayCliente(cliente: ListClientsI): string {
    if (!cliente) {
      return '';
    }

    // Devuelve el string correctamente
    return `${cliente.names} ${cliente.lastNames}`;
  }

  displayBarbero(barbero: ListHairdresserI): string {
    if (!barbero) {
      return '';
    }

    return `${barbero.name.trim()} `
  }

  displayServicio(servicio: any): string {
    if (!servicio) {
      return '';
    }

    // Si hay un precio único, mostrar ese precio
    if (servicio.price !== null && servicio.price !== undefined) {
      return `${servicio.name} ${servicio.price}`;
    }

    // Si hay un rango de precios, mostrar el rango
    if (servicio.prices && servicio.prices.length > 0) {
      const minPrice = Math.min(...servicio.prices);
      const maxPrice = Math.max(...servicio.prices);
      return `${servicio.name} ${minPrice} - ${maxPrice}`;
    }

    // En caso de que no haya precio o rango
    return servicio.name;
  }
  // Mostrar el nombre del descuento
  displayDescuento(descuento: ListdiscountsI): string {
    return descuento ? descuento.name : '';
  }
  // Método para mostrar el nombre de la forma de pago
  displayFormaPago(formaPago: ListpaymentMethodsI): string {

    return formaPago ? formaPago.name : '';
  }
  async searchclients() {

    const clienteBuscadorValue = this.corteForm.get('clienteBuscador')?.value; // Obtiene el valor del input
    if (this.validarEstructura(clienteBuscadorValue)) {
      const data = await this.clients.findClient({ find: clienteBuscadorValue })
      this.clientes = data
    }

  }


  onClienteSelected(cliente: ListClientsI) {
    if (cliente) {
      // Aquí haces la llamada para obtener los datos adicionales de manera asíncrona
      this.salesfinddiscount(cliente._id)
    }
  }

  async salesfinddiscount(data: any) {

    const datas:ListDiscounts[] = await this.sales.getSalesDiscount({ find: data });
     console.log(datas)
    const hasFalseIsGlobal = datas.some(discount  => discount.isGlobal === false);
 
if (hasFalseIsGlobal) {
  this.openDialogDiscount(datas)
}
     
    this.descuentos = datas; 
    this.calcularTotal(); 
  
  } 
  openDialogDiscount(data:ListDiscounts[]): void {
    
    const aux=this.corteForm.value
    const aux1=aux.clienteBuscador 
    const dialogRef = this.dialog.open(DiscountModalComponent, {
      width: '600px', 
      data: { descuentos: data,aux:aux1}, // Pasamos el data al modal
      disableClose: true,
    }); 
     // Escuchar el evento afterClosed
  dialogRef.afterClosed().subscribe((result) => {
    this.searchInput.nativeElement.focus();
  });
  }

  async searchproducts() {

    const productoBuscadorValue = this.corteForm.get('servicioBuscador')?.value; // Obtiene el valor del input
    if (this.validarEstructura(productoBuscadorValue)) {
      const data = await this.products.findProduct({ find: productoBuscadorValue })
      this.servicios = data
    }

  }




  validarEstructura(input: any): boolean {
    // Verifica si el input no es un objeto con la estructura { id: '1', nombre: 'Cliente 1' }
    if (typeof input !== 'object' || !input.id || !input.nombre) {
      // Verifica si es un string
      if (typeof input === 'string') {
        // Elimina los espacios iniciales y finales
        const trimmedInput = input.trim();
        // Verifica si el string tiene más de 3 caracteres
        if (trimmedInput.length > 2) {
          // Si cumple, realiza alguna acción 
          return true;
        }
      }
    }
    // Si no cumple, retorna false o realiza alguna otra acción 
    return false;
  }


  async getdataprinttiket(data: any) {
    const datas = await this.sales.Salesgetdataprintticket({ id: data })

    this.print(datas)
  }

  async print(data: any) {

    await this.sales.Salesprintticket(data)
  }











  aplicarDescuentos(
    serviciosAgregados: ListProductsSelectedI[],
    descuentos: ListDiscounts[]
  ): void {
    if (serviciosAgregados.length === 0 || descuentos.length === 0) {
      console.warn("No hay servicios agregados o descuentos disponibles para procesar.");
      return;
    }
 
    serviciosAgregados.forEach(servicio => {
      // Guardar el descuento seleccionado actual
      const previousSelectedDiscount = servicio.selectedDiscount ? 
      {_id:servicio.selectedDiscount._id,discountType:servicio.selectedDiscount.discountType,value:servicio.selectedDiscount.value} 
      : undefined; 
      // Inicializar o reconstruir la propiedad discount
      servicio.discount = [];
 
      descuentos.forEach(descuento => {
        if (descuento.productsOrServices.length === 0) {
          // Si no hay productos específicos, aplicar el descuento a todos
          servicio.discount?.push({
            _id: descuento._id,
            discountType: descuento.discountType,
            value: descuento.value,
            name:descuento.name
          });
        } else {
          // Comparar los IDs y aplicar el descuento si coincide
          const match = descuento.productsOrServices.some(
            product => product._id === servicio._id
          );

          if (match) {
            servicio.discount?.push({
              _id: descuento._id,
              discountType: descuento.discountType,
              value: descuento.value,
              name:descuento.name
            });
          }
        }
      });

      // Restaurar el descuento seleccionado si es válido
      if (
        previousSelectedDiscount &&
        servicio.discount.some(
          discount => discount._id === previousSelectedDiscount._id
        )
      ) {
 
        const index = servicio.discount.findIndex((discount) => {
          return discount._id === previousSelectedDiscount._id 
            && discount.discountType === previousSelectedDiscount.discountType 
            && discount.value === previousSelectedDiscount.value;
        }) 
         servicio.selectedDiscount =  servicio.discount?.[index] || null;; 
      } else { 
        servicio.selectedDiscount = servicio.discount?.[0] || null; 
      }
    }); 
  }  

  calcularTotales(servicios: any[]) {
    console.log(servicios);
    let subtotal = 0;
    let totalDescuento = 0;
  
    servicios.forEach(servicio => {
      const precio = servicio.price || 0;
      const descuento = servicio.selectedDiscount?.value || 0;
      const tipoDescuento = servicio.selectedDiscount?.discountType;
  
      let descuentoAplicado = 0;
  
      // Verificar el tipo de descuento
      if (tipoDescuento === 'PERCENTAGE') {
        descuentoAplicado = (descuento / 100) * precio; // Descuento en porcentaje
      } else if (tipoDescuento === 'FIXED') {
        descuentoAplicado = descuento; // Descuento fijo
      }
  
      subtotal += precio;
      totalDescuento += descuentoAplicado;
    });
  
    // Actualizar los totales calculados
    this.totales = {
      subtotal,
      totalDescuento,
      total: subtotal - totalDescuento
    };
  }

  getSubtotal(productsOrServices: any[]): number {
    return productsOrServices.reduce((acc, product) => acc + product.price, 0);
  } 

  getTotalDiscounts(productsOrServices: any[]): number {
    return productsOrServices.reduce((acc, product) => {
      const discount = product.discountDetails.value || 0;
  
      if (product.discountDetails.type === 'PERCENTAGE') {
        return acc + (product.price * discount) / 100;
      } else if (product.discountDetails.type === 'FIXED') {
        return acc + discount;
      }
  
      return acc; // Si no tiene descuento
    }, 0);
  }
  getTotalWithDiscounts(productsOrServices: any[]): number {
    return productsOrServices.reduce((acc, product) => {
      const discount = product.discountDetails.value || 0;
      let discountedPrice = product.price;
  
      if (product.discountDetails.type === 'PERCENTAGE') {
        discountedPrice -= (product.price * discount) / 100;
      } else if (product.discountDetails.type === 'FIXED') {
        discountedPrice -= discount;
      }
  
      return acc + Math.max(discountedPrice, 0); // Evitar precios negativos
    }, 0);
  }
}
