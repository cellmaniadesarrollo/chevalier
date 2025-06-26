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
  constructor(private modalService: ModalService,private fb: FormBuilder,private backend:ProductsService) {}
 supplierForm!: FormGroup;
  countries:ListCountry[] = [];  
rimpes:ListRimpe[] = [];
 
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

    this.loadCountries();
    this.loadRimpes();
  }

 async loadCountries() {
 const data=await this.backend.suppliersnewdata()
 this.countries=data.countries
 this.rimpes=data.rimpes
 const countrySelected = this.countries.find((c: any) => c.name === 'ECUADOR');
const rimpeSelected = this.rimpes.find((r: any) => r.name === 'NO');

this.supplierForm.patchValue({
  country: countrySelected?.id || null,
  rimpe: rimpeSelected?.id || null,
});
  }

  loadRimpes() {
    // API call para obtener rimpes
    // this.http.get(...).subscribe(data => this.rimpes = data);
  }

  onSubmit() {
    if (this.supplierForm.valid) {
      const supplierData = this.supplierForm.value;
      console.log('Guardar proveedor:', supplierData);
      // Aquí llamas al servicio para guardar
    }
  }
  goToIngreso() {
    this.modalService.changeView('ingreso');
  }
}
