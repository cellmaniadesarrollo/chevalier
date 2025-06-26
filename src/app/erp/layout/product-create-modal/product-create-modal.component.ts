import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ProductsService } from '../../service/products/products.service';

@Component({
  selector: 'app-product-create-modal',
  templateUrl: './product-create-modal.component.html',
  styleUrls: ['./product-create-modal.component.css']
})
export class ProductCreateModalComponent implements OnInit {
  productForm!: FormGroup;
  tipos: any[] = [];
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductCreateModalComponent>, 
    private apibackend: ProductsService
  ) {}

  ngOnInit() {
   
    this.getnewdata();

    this.productForm = this.fb.group({
      cod: ['', Validators.required],
      name: ['', Validators.required],
      isFixedPrice: [true],
      price: [0],
      prices: this.fb.array([]),
      description: [''],
      commissionRate: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      stock: [0],
      type: [null, Validators.required],
      print: [false, Validators.required],
    }); 

    this.productForm.get('isFixedPrice')?.valueChanges.subscribe((value: boolean) => {
      if (value) {
        this.productForm.get('price')?.setValidators([Validators.required]);
        this.clearFormArray(this.prices);
      } else {
        this.productForm.get('price')?.clearValidators();
        if (this.prices.length === 0) {
          this.addPrice();
        }
      }
      this.productForm.get('price')?.updateValueAndValidity();
    });

    this.productForm.get('type')?.valueChanges.subscribe(typeId => {
      const tipo = this.tipos.find(t => t.id === typeId);
      if (tipo && tipo.name === 'SERVICE') {
        this.productForm.get('stock')?.setValue(null);
      }
    });

    // Inicializa precios si no es precio fijo
    if (!this.productForm.get('isFixedPrice')?.value && this.prices.length === 0) {
      this.addPrice();
    }
  }

  async getnewdata() {
     
    this.tipos = await this.apibackend.getnewdata();
        const productType = this.tipos.find(item => item.name === "PRODUCT");
    
    this.productForm.patchValue({
        type: productType.id
    }); 
  }

  get prices(): FormArray {
    return this.productForm.get('prices') as FormArray;
  }

  addPrice() {
    this.prices.push(this.fb.control(0, Validators.required));
  }

  removePrice(index: number) {
    this.prices.removeAt(index);
  }

  clearFormArray(formArray: FormArray) {
    while (formArray.length) {
      formArray.removeAt(0);
    }
  }

  async onSubmit() {
    if (this.productForm.valid) {
      this.isSaving = true;
      const payload = { ...this.productForm.value };
      if (payload.isFixedPrice) {
        delete payload.prices;
      } else {
        delete payload.price;
      }
      // Eliminar stock si el tipo es SERVICE
      const tipo = this.tipos.find(t => t.id === payload.type);
      if (tipo && tipo.name === 'SERVICE') {
        delete payload.stock;
      }
      try {
        const res = await this.apibackend.saveproduct(payload);
        this.isSaving = false;
        this.dialogRef.close(res);
      } catch (err) {
        console.error('Error al guardar', err);
        this.isSaving = false;
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  get selectedTypeName(): string | null {
    const typeId = this.productForm.get('type')?.value;
    const tipo = this.tipos.find(t => t.id === typeId);
    return tipo ? tipo.name : null;
  }
  selectInput(event: Event) {
  (event.target as HTMLInputElement).select();  // Type casting seguro
}
}
