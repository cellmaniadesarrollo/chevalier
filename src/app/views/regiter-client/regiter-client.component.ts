import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth/auth.service';
import { QuerieService } from '../../service/querie/querie.service';
@Component({
  selector: 'app-regiter-client',
  templateUrl: './regiter-client.component.html',
  styleUrl: './regiter-client.component.css'
})
export class RegiterClientComponent {

  clientForm: FormGroup;
  cedulaExists: boolean = false;
  initialCedulaValue: string = '';

  showSuccess: boolean = false;   // Animación de éxito

  constructor(
    private fb: FormBuilder,
    private clientsService: AuthService,
    private querieService: QuerieService,
    private router: Router
  ) {
    this.clientForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.pattern(/^\d{8,}$/)]],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      direccion: [''],
      telefono: ['', [Validators.pattern(/^\d{7,10}$/)]],
      correo: ['', [Validators.email]],
      fechaNacimiento: ['']
    });

    // Detecta si el usuario cambia la cédula cuando estaba duplicada
    this.clientForm.get('cedula')?.valueChanges.subscribe(value => {
      if (this.cedulaExists && value !== this.initialCedulaValue) {
        this.cedulaExists = false;
        this.clientForm.enable();
      }
    });
  }

  // -------------------------------
  //   VALIDAR SI CÉDULA EXISTE
  // -------------------------------
  async checkCedula() {
    const cedulaValue = this.clientForm.get('cedula')?.value;
    if (!cedulaValue) return;

    const token = await this.querieService.executeRecaptcha('submit');

    try {
      const response = await this.clientsService.findClient({ find: cedulaValue, token });

      if (response && response.length > 0) {
        this.cedulaExists = true;
        this.initialCedulaValue = cedulaValue;
        this.clientForm.disable();
        this.clientForm.get('cedula')?.enable();
      }

    } catch (e) {
      this.cedulaExists = false;
      this.clientForm.enable();
    }
  }

  // -------------------------------
  //      GUARDAR CLIENTE
  // -------------------------------
  async saveClient() {
    if (this.clientForm.invalid) return;

    await this.clientsService.saveClient(this.clientForm.value);

    // Mostrar animación de éxito
    this.showSuccess = true;

    // Esperar 2 segundos y luego redirigir
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 2000);
  }

  // -------------------------------
  //      CANCELAR
  // -------------------------------
  onCancel() {
    this.router.navigate(['/']);
  }
}
