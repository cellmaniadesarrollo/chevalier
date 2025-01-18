import { Component, Inject, Output, EventEmitter, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientsService } from '../../service/clients/clients.service';
@Component({
  selector: 'app-addclient',
  templateUrl: './addclient.component.html',
  styleUrl: './addclient.component.css'
})
export class AddclientComponent {
  clientForm: FormGroup;
  @Output() closeModalEvent: EventEmitter<any> = new EventEmitter<any>();
  cedulaExists: boolean = false;
  initialCedulaValue: string = ''; // Guarda el valor de la cédula duplicada

  constructor(
    public dialogRef: MatDialogRef<AddclientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private clientsService: ClientsService
  ) {
    this.clientForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.pattern(/^\d{8,}$/)]],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      direccion: [''],
      telefono: ['', [Validators.pattern(/^\d{7,10}$/)]],
      correo: ['', [Validators.email]],
      fechaNacimiento: [''],
    });

    // Observa cambios en el campo de cédula
    this.clientForm.get('cedula')?.valueChanges.subscribe((value) => {
      if (this.cedulaExists && value !== this.initialCedulaValue) {
        this.cedulaExists = false; // Habilita los campos si la cédula es distinta al valor duplicado
        this.clientForm.enable();  // Habilita todo el formulario
      }
    });
  }

  async checkCedula() {
    const cedulaValue = this.clientForm.get('cedula')?.value;
    
    if (cedulaValue) {
      try {
        // Llama al servicio para verificar si la cédula ya existe
        const response = await this.clientsService.findClient({ find: cedulaValue })
        if (response && response.length > 0) {
          this.cedulaExists = true;
          this.initialCedulaValue = cedulaValue; // Guarda el valor actual de la cédula como el valor duplicado
          this.clientForm.disable(); // Deshabilita el formulario
          this.clientForm.get('cedula')?.enable(); // Habilita solo el campo de cédula
        } 
      } catch (error) {
        this.cedulaExists = false;
        this.clientForm.enable(); // Habilita todo el formulario si la cédula no existe
      }
    }
  }

  onCancel(): void {
    this.closeModal(false);
  }

  async saveClient() {
    const data = await this.clientsService.saveClient(this.clientForm.value);
    this.closeModal(true, data);
  }

  closeModal(close: boolean, data: any = ''): void {
    const datos = { data: data, close: close };
    this.closeModalEvent.emit(datos);
    this.dialogRef.close();
  }
}
