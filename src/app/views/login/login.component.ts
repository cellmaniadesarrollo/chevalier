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
  hide = true; // Para mostrar/ocultar contraseña

  constructor(private fb: FormBuilder,private auth:AuthService,private router:Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false] // Campo para "Recuérdame"
    });
  }

 async onSubmit() {  
    if (this.loginForm.valid) {
   const logindata=  await this.auth.login(this.loginForm.value) 
      const formValues = this.loginForm.value;
if(logindata){
  this.router.navigate(['/erp']);
}
      // Procesar la solicitud de inicio de sesión
      const loginData = {
        email: formValues.email,
        password: formValues.password,
        rememberMe: formValues.rememberMe
      };

      // Si "Recuérdame" está seleccionado, solicitar un token de más larga duración
      if (loginData.rememberMe) {
        console.log('Se solicita un token de más larga duración');
        // Aquí puedes implementar tu lógica para obtener un token más largo.
      } else {
        console.log('Sesión estándar');
      }

      // Lógica de autenticación aquí
      console.log('Datos de inicio de sesión:', loginData);
    }
  }
}