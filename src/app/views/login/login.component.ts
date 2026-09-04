import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  hide = true;
  loading = false; // 🔹 nuevo: útil para deshabilitar el botón mientras autentica

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      // 🔹 ya no valida formato email, ahora acepta usuario o email
      email: ['', [Validators.required]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  // 🔹 nuevo: si ya hay un token válido, pasa directo sin pedir login
  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/erp']);
      return;
    }

    // 🔹 nuevo: prellenar usuario/email recordado
    const remembered = this.auth.getRememberedIdentifier();
    if (remembered) {
      this.loginForm.patchValue({
        email: remembered,
        rememberMe: true
      });
    }
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      try {
        const logindata = await this.auth.login(this.loginForm.value);
        if (logindata) {
          this.router.navigate(['/erp']);
        }
      } catch (error) {
        console.error('Error de inicio de sesión:', error);
        // 🔹 aquí podrías mostrar un mensaje de error en pantalla si lo deseas
      } finally {
        this.loading = false;
      }
    }
  }
}