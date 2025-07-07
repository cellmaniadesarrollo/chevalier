import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../service/modal/modal.service';
import { ProductsService } from '../../service/products/products.service';
import { ListCountry, ListRimpe } from '../../models/products.inteface';

@Component({
  selector: 'app-add-supplier-modal',
  templateUrl: './add-supplier-modal.component.html',
  styleUrl: './add-supplier-modal.component.css'
})
export class AddSupplierModalComponent {
  constructor(private modalService: ModalService, private fb: FormBuilder, private backend: ProductsService) { }
  supplierForm!: FormGroup;
  countries: ListCountry[] = [];
  rimpes: ListRimpe[] = [];

  ngOnInit(): void {
    this.supplierForm = this.fb.group({
      name: ['', Validators.required],
      identification: ['', Validators.required],
      country: [null, Validators.required],
      address: [''],
      phone: [''],
      email: ['', Validators.email],
      rimpe: [null, Validators.required],
    });

    this.loadInitDatas();
  }

  async loadInitDatas() {
    const data = await this.backend.suppliersnewdata()
    this.countries = data.countries
    this.rimpes = data.rimpes
    const countrySelected = this.countries.find((c: any) => c.name === 'ECUADOR');
    const rimpeSelected = this.rimpes.find((r: any) => r.name === 'NO');

    this.supplierForm.patchValue({
      country: countrySelected?.id || null,
      rimpe: rimpeSelected?.id || null,
    });
  }
async onBlurIdentification(): Promise<void> {
  const control = this.supplierForm.get('identification');
  const id = control?.value;

  if (!id || control?.invalid) return;

  try {
    const response = await this.backend.checkIdentificationExists({ id: id });
    if (response.data.exists) {
      control?.setErrors({ duplicate: true });
    } else {
      if (control?.hasError('duplicate')) {
        control.setErrors(null);
      }
    }
  } catch (error) {
    console.error('Error al verificar identificación:', error);
    // Podrías mostrar un snackbar o alerta si deseas
  }
}
 async supplierSubmit() {
    if (this.supplierForm.valid) { 
      await this.backend.save(this.supplierForm.value)
      this.modalService.changeView('ingreso');
    }
  }
  goToIngreso() {
    this.modalService.changeView('ingreso');
  }
}
