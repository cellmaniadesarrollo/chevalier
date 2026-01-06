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
  isAutoQuery: boolean = false;
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
        this.isAutoQuery = true;      // 👈 viene por query
        this.isConsultando = true;    // 👈 muestra spinner

        const decoded = this.decodeValue(value);

        this.consultaForm.patchValue({
          cedula: decoded
        });

        await this.onConsultar();

        this.isConsultando = false;   // 👈 oculta spinner
        this.isAutoQuery = false;     // 👈 vuelve al modo normal
      }
    });
  }
  isConsultaPage(): boolean {
    return this.router.url === '/queries';
  }

async onConsultar() {
  if (this.consultaForm.invalid) {
    return;
  }

  // 👇 SOLO bloquear doble click en modo manual
  if (!this.isAutoQuery && this.isConsultando) {
    return;
  }

  if (!this.isAutoQuery) {
    this.isConsultando = true;
  }

  try {
    const token = await this.quierieService.executeRecaptcha('submit');
    this.consultaForm.controls['token'].setValue(token);

    const response = await this.quierieService.sendFeedback(this.consultaForm.value);

    this.sales = response.data;
    this.discounts = response.discounts;

    this.isConsultaRealizada = true;
    setTimeout(() => {
      this.isConsultaRealizada = false;
    }, 5000);

  } catch (error) {
    this.errormes = true;
  } finally {
    if (!this.isAutoQuery) {
      this.isConsultando = false;
    }
  }
}


  decodeValue(encoded: string): string {
    const base64 = encoded
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    return atob(base64);
  }
}
