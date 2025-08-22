import { Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientsService } from '../../service/clients/clients.service';
@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrl: './edit-client.component.css'
})
export class EditClientComponent {
  clientForm!: FormGroup;
  fechaEditable: boolean = true;
  clientData: any;

  constructor(
    private dialogRef: MatDialogRef<EditClientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private clientservice: ClientsService
  ) {}

  ngOnInit() {
      this.clientForm = this.fb.group({
    id: [''],
    nombres: [''],
    apellidos: [''],
    direccion: [''],
    telefono: [''],
    correo: [''],
    fechaNacimiento: ['']
  });

    this.getdata();
  }

  async getdata() {
    const result = await this.clientservice.findOneClient({ id: this.data._id });
    this.clientData = result; 
    // Si ya tiene fecha de nacimiento, no se podrá editar
    this.fechaEditable = !this.clientData.fechaNacimiento;

    this.clientForm = this.fb.group({
      id: [this.data._id || '', Validators.required],
      nombres: [this.clientData.nombres || '', Validators.required],
      apellidos: [this.clientData.apellidos || '', Validators.required],
      direccion: [this.clientData.direccion || ''],
      telefono: [this.clientData.telefono || '', Validators.pattern('^[0-9]{10}$')],
      correo: [this.clientData.correo || '', Validators.email],
      fechaNacimiento: [{ value: this.clientData.fechaNacimiento || '', disabled: !this.fechaEditable }]
    });
  }

 async onSubmit() {
    if (this.clientForm.valid) {
      try {
        await this.clientservice.editOneClient(this.clientForm.value); // axios request
        this.dialogRef.close('updated'); // 🔹 avisar al padre que se actualizó
      } catch (error) {
        console.error('Error al editar cliente', error);
      }
    }
  }

    cancelar(): void {
    this.dialogRef.close(); // 🔹 cerrar sin enviar datos
  }
}
