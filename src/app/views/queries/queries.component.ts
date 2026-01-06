import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QuerieService } from '../../service/querie/querie.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomerTicket, FidelityDiscount } from '../../models/consultacortes.interface';
import axios from 'axios';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-queries',
  templateUrl: './queries.component.html',
  styleUrl: './queries.component.css'
})
export class QueriesComponent {
  consultaForm = new FormGroup({
    cedula: new FormControl('', Validators.required), // Agregado el control 'cedula'
    token: new FormControl('', Validators.required)
  });

  isConsultaRealizada: boolean = false;
  isConsultando: boolean = false;
  areLastnames: boolean = false;
  sales: CustomerTicket[] = [];
  discounts: FidelityDiscount[] = [];
  errormes: boolean = false; // Add a property to store the error message

  constructor(private router: Router, private route: ActivatedRoute, private quierieService: QuerieService) { }
  ngOnInit(): void {
    this.route.paramMap.subscribe(async params => {
      const value = params.get('value');

      if (value) {
        const decoded = this.decodeValue(value);

        this.consultaForm.patchValue({
          cedula: decoded
        });

        await this.onConsultar();
      }
    });
  }
  isConsultaPage(): boolean {
    return this.router.url === '/queries';
  }

  async onConsultar() {
    // Ejecuta el reCAPTCHA con la acción 'consultar'
    const token = await this.quierieService.executeRecaptcha('submit');
    this.consultaForm.controls['token'].setValue(token);
    if (this.consultaForm.invalid || this.isConsultando) {
      return; // Evitar el reenvío si el formulario no es válido o ya se está enviando
    }
    this.isConsultando = true; // Bloquea el botón 
    try {
      // Envía el comentario
      const response = await this.quierieService.sendFeedback(this.consultaForm.value);

      this.sales = response.data
      this.discounts = response.discounts;
      this.isConsultaRealizada = true;
      setTimeout(() => {
        this.isConsultaRealizada = false;
      }, 5000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          this.errormes = true;
          console.log("Recurso no encontrado");
        } else {
          console.error("Error con status:", error.response?.status);
        }
      } else {
        console.error("Error desconocido", error);
      }
    } finally {
      this.isConsultando = false;
    }
  }

  decodeValue(encoded: string): string {
    const base64 = encoded
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    return atob(base64);
  }
}
