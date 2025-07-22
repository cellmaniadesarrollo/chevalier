import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from '../../service/products/products.service';
export interface Barber {
  _id: string;
  name: string;
}
export interface ProductBatch {
  _id: string;
  quantity: string;
  code: number;
}
@Component({
  selector: 'app-barber-supplies-tracker',
  templateUrl: './barber-supplies-tracker.component.html',
  styleUrl: './barber-supplies-tracker.component.css'
})

export class BarberSuppliesTrackerComponent {
  @Input() datoRecibido: any;
  @Output() cerrarModal = new EventEmitter<any>();

  cerrar() {
    this.cerrarModal.emit('cerrado desde tracker');
  }
  assignmentForm!: FormGroup;
  productBatches: ProductBatch[] = []; // cargar desde servicio
  barbers: Barber[] = []; // cargar desde servicio

  constructor(private fb: FormBuilder, private backendservice: ProductsService) { }

  ngOnInit(): void {
    console.log(this.datoRecibido, 'componete')
    this.assignmentForm = this.fb.group({
      batchId: [null, Validators.required],
      barberId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      comment: ['']
    });
    this.getdata();
    this.loadBatches();

    // Escuchar cambios en batchId para actualizar el validador de quantity
    this.assignmentForm.get('batchId')?.valueChanges.subscribe(batchId => {
      const batch = this.productBatches.find(b => b._id === batchId);
      const max = batch ? Number(batch.quantity) : 1;
      this.assignmentForm.get('quantity')?.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(max)
      ]);
      // Si la cantidad actual es mayor al máximo, la ajusta
      if (this.assignmentForm.get('quantity')?.value > max) {
        this.assignmentForm.get('quantity')?.setValue(max);
      }
      this.assignmentForm.get('quantity')?.updateValueAndValidity();
    });
  }
  async getdata() {
    const data = await this.backendservice.findBanchesProduct(this.datoRecibido);
    this.productBatches = data.batches;
    this.barbers = data.hairdresser;
  }
  loadBatches() {
    // Lógica para obtener lotes desde el backend
  }

  getMaxQuantity(): number {
    const batchId = this.assignmentForm.get('batchId')?.value;
    const batch = this.productBatches.find(b => b._id === batchId);
    return batch ? Number(batch.quantity) : 1;
  }
  isLoading = false;
  async onSubmit() {
    if (this.assignmentForm.valid) {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 3000);
      await this.backendservice.saveBarberSuppliesTracker(this.assignmentForm.value)
      this.cerrar()
    }
  }
}
