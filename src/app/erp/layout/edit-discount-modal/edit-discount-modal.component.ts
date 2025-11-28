import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientsService } from '../../service/clients/clients.service';
import { DiscountsService } from '../../service/discounts/discounts.service';
import { MatDialog } from '@angular/material/dialog';
import { AddclientComponent } from '../addclient/addclient.component';
import { HostListener } from '@angular/core';
import { ProductsService } from '../../service/products/products.service';
@Component({
  selector: 'app-edit-discount-modal',
  templateUrl: './edit-discount-modal.component.html',
  styleUrl: './edit-discount-modal.component.css'
})
export class EditDiscountModalComponent {
  discountForm!: FormGroup;

  tiposDescuento: any[] = [];
  clientes: any[] = [];
  clientesAgregados: any[] = [];
  isEdit = false;
  constructor(
    private dialogRef: MatDialogRef<EditDiscountModalComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private clientsService: ClientsService,
    private fb: FormBuilder,
    private discountservice: DiscountsService,
    private backend: ProductsService
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    this.createForm();
    this.onGlobalChange();
    this.getdata()
    // Si vienen datos -> es edición
    if (this.data) {
      this.isEdit = true;
      this.loadEditData();
    }
  }
  async loadEditData() {

    const finddiscountdata = await this.discountservice.findOneDiscount({ id: this.data });

    this.discountForm.patchValue({
      tituloDescuento: finddiscountdata.name || '',
      observaciones: finddiscountdata.description || '',
      tipoDescuento: finddiscountdata.discountType || '',
      valorDescuento: finddiscountdata.value || '',

      fechaInicio: this.toDatetimeLocal(finddiscountdata.validFrom),
      fechaFin: this.toDatetimeLocal(finddiscountdata.validUntil),

      descuentoGlobal: finddiscountdata.isGlobal ?? false,
      aplicaPrincipal: finddiscountdata.main_discount,
      aplicaColaboradores: finddiscountdata.collaborators_discount,
      aplicaComision: finddiscountdata.discount_comission,
    });

    /** ================================
     *   CARGAR CLIENTES SI NO ES GLOBAL
     *  ================================= */
    if (!finddiscountdata.isGlobal && Array.isArray(finddiscountdata.customers)) {
      this.clientesAgregados = finddiscountdata.customers.map((c: any) => ({
        _id: c.customer._id,
        dni: c.customer.dni,
        names: c.customer.names,
        lastNames: c.customer.lastNames,
        freeCuts: c.freeCuts
      }));
    }

    /** ================================
     *   CARGAR PRODUCTOS/SERVICIOS
     *  ================================= */
    if (Array.isArray(finddiscountdata.productsOrServices)) {
      this.productosAgregados = finddiscountdata.productsOrServices.map((p: any) => ({
        _id: p._id,
        name: p.cod + " " + p.name
      }));
    }
    /** ================================
   *        CARGAR DÍAS ESPECÍFICOS
   *  ================================= */
    const daysArray = this.discountForm.get('dias') as FormArray;
    const daysOfWeek: number[] = finddiscountdata.daysOfWeek || [];

    // Si hay días → activar checkbox
    this.discountForm.patchValue({
      diasEspecificos: daysOfWeek.length > 0
    });

    // Reiniciar primero todo a false
    daysArray.controls.forEach(control => control.setValue(false));

    // Marcar días recibidos
    daysOfWeek.forEach(dia => {
      if (daysArray.at(dia)) {
        daysArray.at(dia).setValue(true);
      }
    }); 
  }

  async getdata() {
    this.tiposDescuento = await this.discountservice.getNewDataDicoounts();
    console.log(this.tiposDescuento)
  }

  createForm() {
    this.discountForm = this.fb.group({
      tituloDescuento: ['', Validators.required],
      observaciones: [''],

      tipoDescuento: ['', Validators.required],
      valorDescuento: ['', Validators.required],

      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],

      descuentoGlobal: [false],
      aplicaPrincipal: [true],
      aplicaColaboradores: [true],
      aplicaComision: [true],
      diasEspecificos: [false],
      dias: this.fb.array<FormControl<boolean | null>>([
        new FormControl(false),
        new FormControl(false),
        new FormControl(false),
        new FormControl(false),
        new FormControl(false),
        new FormControl(false),
        new FormControl(false),
      ]),
      clienteBuscador: [''],
      productoBuscador: [''],
    });
  }

  diasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado"
  ];
  get diasFormArray(): FormArray<FormControl<boolean>> {
    return this.discountForm.get('dias') as FormArray<FormControl<boolean>>;
  }
  // ------------------------------
  // REACCIONAR AL CAMBIO DE "GLOBAL"
  // ------------------------------
  onGlobalChange() {
    this.discountForm.get('descuentoGlobal')?.valueChanges.subscribe(global => {
      if (global) {
        this.clientesAgregados = [];
        this.discountForm.get('clienteBuscador')?.disable();
      } else {
        this.discountForm.get('clienteBuscador')?.enable();
      }
    });
  }

  // ------------------------------
  // AUTOCOMPLETE CLIENTES
  // ------------------------------
  async searchclients() {
    const value = this.discountForm.get('clienteBuscador')?.value;

    if (!this.validarEstructura(value)) return;

    const data = await this.clientsService.findClient({ find: value });
    this.clientes = data;
  }

  validarEstructura(valor: any): boolean {
    if (typeof valor !== 'string') return false;
    return valor.trim().length >= 2;
  }

  displayCliente(cliente: any): string {
    return cliente ? `${cliente.dni} - ${cliente.names} ${cliente.lastNames}` : '';
  }

  // Al seleccionar un cliente del autocomplete
  onClienteSelected(cliente: any) {
    const existe = this.clientesAgregados.find(c => c._id === cliente._id);
    if (existe) return;

    this.clientesAgregados.push({
      _id: cliente._id,
      dni: cliente.dni,
      names: cliente.names,
      lastNames: cliente.lastNames,
      freeCuts: 0
    });

    this.discountForm.get('clienteBuscador')?.setValue('');
  }

  // Eliminar cliente
  removeCliente(index: number) {
    this.clientesAgregados.splice(index, 1);
  }

  // ------------------------------
  // MODAL PARA AGREGAR CLIENTE
  // ------------------------------
  openDialog(): void {
    const dialogRef = this.dialog.open(AddclientComponent, {
      width: '600px',
      disableClose: true,
    });

    dialogRef.componentInstance.closeModalEvent.subscribe((result: any) => {
      if (result.close) {
        this.normalfind(result.data);
      }
    });
  }

  // Después de crear un cliente desde el modal, lo agrega automáticamente
  async normalfind(data: any) {
    const cliente = await this.clientsService.findClient({ find: data.dni });
    if (cliente[0]) {
      this.onClienteSelected(cliente[0]);
    }
  }

  // ------------------------------
  // ENVIAR AL BACKEND
  // ------------------------------
  async guardarDescuento() {
    if (this.discountForm.invalid) {
      this.discountForm.markAllAsTouched();
      return;
    }

    const form = this.discountForm.value;

    // =============================
    // Obtener días seleccionados
    // =============================
    const diasSeleccionados = form.diasEspecificos
      ? form.dias
        .map((valor: boolean, index: number) => valor ? index : null)
        .filter((v: number | null) => v !== null)
      : [];

    const payload: any = {
      name: form.tituloDescuento.toUpperCase(),
      description: form.observaciones || '',
      discountType: form.tipoDescuento,
      value: Number(form.valorDescuento),

      isGlobal: form.descuentoGlobal,

      productsOrServices: this.productosAgregados.map(p => ({
        product: p._id,
        name: p.name
      })),

      customers: form.descuentoGlobal
        ? []
        : this.clientesAgregados.map(c => ({
          customer: c._id,
          freeCuts: Number(c.freeCuts || 0)
        })),

      validFrom: form.fechaInicio,
      validUntil: form.fechaFin,

      main_discount: form.aplicaPrincipal,
      collaborators_discount: form.aplicaColaboradores,
      discount_comission: form.aplicaComision,

      // 🔹 AGREGAR DÍAS AL PAYLOAD
      daysOfWeek: diasSeleccionados
    };

    try {
      if (this.data === null) {
        await this.discountservice.saveOneDiscount(payload);
      } else {
        payload.id = this.data;
        await this.discountservice.editOneDiscount(payload);
      }

      // 🔹 Cerrar el diálogo después de guardar
      this.dialogRef.close('updated'); // puedes enviar un flag para refrescar la tabla

    } catch (error) {
      console.error('Error al guardar/editar descuento:', error);
    }
  }

  cancelar(): void {
    this.dialogRef.close(); // 🔹 cerrar sin enviar datos
  }
  @HostListener('document:keydown.escape', ['$event'])
  onEscapePressed(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    this.cancelar();
  }

  traducirTipo(tipo: string): string {
    const mapa: any = {
      FIXED: 'Fijo',
      PERCENTAGE: 'Porcentaje',
      global: 'Global',
      collaborator: 'Colaborador',
      principal: 'Principal'
    };

    return mapa[tipo] || tipo;
  }

  toDatetimeLocal(dateString: string) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  filtroClientes: string = '';

  clientesFiltrados() {
    if (!this.filtroClientes) return this.clientesAgregados;

    const term = this.filtroClientes.toLowerCase();

    return this.clientesAgregados.filter(c =>
      c.dni.toLowerCase().includes(term) ||
      c.names.toLowerCase().includes(term) ||
      c.lastNames.toLowerCase().includes(term)
    );
  }






  productos: any[] = [];
  productosAgregados: any[] = [];

  filters = {
    searchQuery: ''
  };

  // 🔹 Buscar productos
  async searchproducts() {
    const query = this.discountForm.get('productoBuscador')?.value;
    const data = await this.backend.findProduct({ find: query })
    console.log(data)
    this.productos = data
  }

  // Cómo mostrar un producto en el autocomplete
  displayProducto(p: any): string {
    return p ? p.name : '';
  }

  // Agregar producto elegido
  agregarProducto(producto: any) {
    const existe = this.productosAgregados.some(p => p._id === producto._id);
    if (!existe) {
      this.productosAgregados.push(producto);
    }

    this.discountForm.get('productoBuscador')?.reset();
  }

  // Eliminar producto
  removeProducto(i: number) {
    this.productosAgregados.splice(i, 1);
  }




 
}
