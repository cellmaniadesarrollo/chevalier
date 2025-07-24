import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ModalService } from '../../service/modal/modal.service';
import { ProductsService } from '../../service/products/products.service';
import { ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-new-input-modal',
  templateUrl: './new-input-modal.component.html',
  styleUrl: './new-input-modal.component.css'
})
export class NewInputModalComponent {
  @Input() initialData: any;
  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  @ViewChild(MatTable) table!: MatTable<any>;
  ingressForm!: FormGroup;
  supplierSearch!: FormControl;
  productsSearch!: FormControl;
  constructor(private modalService: ModalService, private fb: FormBuilder, private backend: ProductsService) { }

  addProveedor() {
    this.modalService.changeView('proveedor');
  }

  voucherForm!: FormGroup;

  suppliers: any[] = [];
  filteredSuppliers: any[] = []
  products: any[] = [];
  filteredProducts: any[] = []
  voucherTypes: any[] = [];     // Rellenar desde backend
  paymentStatuses: any[] = [];  // Rellenar desde backend
  // Rellenar desde backend  
  ngOnInit(): void {
    this.supplierSearch = this.fb.control('');
    this.productsSearch = this.fb.control('');
    this.voucherForm = this.fb.group({
      serialNumber: ['', Validators.required],
      supplier: ['', Validators.required],
      voucherType: ['', Validators.required],
      issueDate: ['', Validators.required],
      receiptDate: [new Date()],
      paymentStatus: ['', Validators.required],
      subtotal: [0, [Validators.required, Validators.min(0)]],
      shippingCost: [0, [Validators.min(0)]],
      shippingCosttaxes: [0, [Validators.min(0)]],
      additionalCosts: [0, [Validators.min(0)]],
      total: [0, [Validators.required, Validators.min(0)]],
      details: this.fb.array([]),
      printOption: [true], // <-- Agrega este campo
    });
    this.getdata()
    this.searchSupplier()
    this.searchProduct()
    this.supplierSearch.valueChanges.subscribe(val => {
      if (!val || typeof val !== 'string') {
        this.filteredSuppliers = this.suppliers;
        return;
      }

      const keywords = val.trim().toLowerCase().split(/\s+/); // dividir por espacios

      this.filteredSuppliers = this.suppliers.filter(supplier => {
        const name = supplier.name.toLowerCase();
        const identification = supplier.identification?.toLowerCase() || '';

        // Cada palabra debe coincidir en al menos uno de los dos campos
        return keywords.every(word =>
          name.includes(word) || identification.includes(word)
        );
      });
    });
    this.productsSearch.valueChanges.subscribe(val => {
      if (!val || typeof val !== 'string') {
        this.filteredProducts = this.products;
        return;
      }

      const keywords = val.trim().toLowerCase().split(/\s+/); // dividir por espacios

      this.filteredProducts = this.products.filter(product => {
        const name = product.name.toLowerCase();
        const identification = product.identification?.toLowerCase() || '';

        // Cada palabra debe coincidir en al menos uno de los dos campos
        return keywords.every(word =>
          name.includes(word) || identification.includes(word)
        );
      });
    });
    this.voucherForm.get('shippingCost')?.valueChanges.subscribe(() => {
      this.recalculateTotals();
    });

    this.voucherForm.get('additionalCosts')?.valueChanges.subscribe(() => {
      this.recalculateTotals();
    });
        this.voucherForm.get('shippingCosttaxes')?.valueChanges.subscribe(() => {
      this.recalculateTotals();
    });
  }


  async getdata() {
    const data = await this.backend.getnewdataisert()
    this.voucherTypes = data.voucherTypes || [];
    this.paymentStatuses = data.payStatus || [];

  }


 async onSubmit() {
    if (this.voucherForm.valid) {
      console.log('Datos enviados:', this.voucherForm.value);
      const data=await this.backend.saveProductsIncome(this.voucherForm.value)
const printPromises = data.printData.map((obj: any) => {
  return this.backend.printTicketChevalier(obj); // debe devolver una Promesa
});

Promise.all(printPromises).then(() => {
this.onCancel()
});
      
       
      // Aquí puedes llamar a tu servicio para guardar el voucher
    }
  }



  async searchSupplier() {
    const data = await this.backend.findSupplier({ find: this.supplierSearch.value });
    this.suppliers = data || [];
    this.filteredSuppliers = this.suppliers; // Inicializar
  }
  onSupplierSelected(supplier: any) {
    this.voucherForm.get('supplier')?.setValue(supplier.id); // Guarda solo el ID
  }
  displaySupplierFn(supplier: any): string {
    return supplier && supplier.name ? supplier.name : '';
  }
  onBlurSupplier() {
    const val = this.supplierSearch.value;
    const found = this.suppliers.find(s => s.name.toLowerCase() === val?.toLowerCase());
    if (!found) {
      this.voucherForm.patchValue({ supplier: '' });
    }
  }
  //  productos
  async searchProduct() {
    console.log('Buscando producto con:', this.productsSearch.value); 
    const data = await this.backend.findProductsincome({ find: this.productsSearch.value });
    this.products = data || [];
    this.filteredProducts = this.products; // Inicializar
  }
  onProductSelected(product: any) {
    this.details.push(this.createDetail(product));
    this.productsSearch.setValue('');
    if (this.table) this.table.renderRows();
  }

  removeDetail(index: number) {
    this.details.removeAt(index);
    if (this.table) this.table.renderRows();
    this.recalculateTotals();
  }

  onBlurProduct() {
    const val = this.productsSearch.value;
    const found = this.products.find(s => s.name.toLowerCase() === val?.toLowerCase());
    if (!found) {
      this.productsSearch.setValue(''); // Limpiar el campo de búsqueda de productos
    }
  }




  get details(): FormArray {
    return this.voucherForm.get('details') as FormArray;
  }

  createDetail(product: any): FormGroup {
    console.log(product)
    const group = this.fb.group({
      productId: [product.id],
      productName: [product.name], // solo para mostrar
      cod: [product.cod],
      pricesale: [product.price||0],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [product.unitPrice || 0, [Validators.required, Validators.min(0)]],
      taxes: [product.taxes, [Validators.min(0)]],
      subtotal: [0, [Validators.required, Validators.min(0)]], 
      expiryDate: ['']
    });
    // Suscribirse a cambios y actualizar el subtotal automáticamente
    group.valueChanges.subscribe(values => {
      const quantity = Number(values.quantity) || 0;
      const price = Number(values.unitPrice) || 0;
      const tax = Number(values.taxes) || 0;

      const subtotal = quantity * price * (1 + tax / 100);
      group.get('subtotal')?.setValue(Number(subtotal.toFixed(2)), { emitEvent: false });
      this.recalculateTotals();
    });

    return group;
  }
  displayProductFn(product: any): string {
    return product && product.name ? `${product.cod} - ${product.name}` : '';
  }


  recalculateTotals(): void {
    const detailsArray = this.details;
    let subtotal = 0;

    for (let i = 0; i < detailsArray.length; i++) {
      const row = detailsArray.at(i);
      const rowSubtotal = Number(row.get('subtotal')?.value) || 0;
      subtotal += rowSubtotal;
    }

    this.voucherForm.get('subtotal')?.setValue(Number(subtotal.toFixed(2)));

  const shippingCost = Number(this.voucherForm.get('shippingCost')?.value) || 0;
  const shippingTaxPercent = Number(this.voucherForm.get('shippingCosttaxes')?.value) || 0;
  const additional = Number(this.voucherForm.get('additionalCosts')?.value) || 0;

  const shippingTotal = shippingCost + (shippingCost * (shippingTaxPercent / 100));

    const total = subtotal + shippingTotal + additional;
    this.voucherForm.get('total')?.setValue(Number(total.toFixed(2)));
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapePressed(event: KeyboardEvent) {
    event.preventDefault();
    this.onCancel();
  }

  onCancel() {
    this.cancel.emit();
  }
}
