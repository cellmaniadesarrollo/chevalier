import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RecaptchaService } from '../../service/recaptcha/recaptcha.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.css'] // Corrige el nombre aquí: `styleUrls` en lugar de `styleUrl`
})
export class FeedbackFormComponent {
  commentsForm = new FormGroup({
    comment: new FormControl('', Validators.required),
    token: new FormControl('', Validators.required),
  });

  isSubmitting: boolean = false; // Controla el estado de envío
  isFeedbackSent: boolean = false; // Controla si el comentario fue enviado con éxito

  constructor(private router: Router, private recaptchaService: RecaptchaService) {}

  isCommentsPage(): boolean {
    return this.router.url === '/comments';
  }

  async onSubmit() {
    console.log('asdaqqq')
    const token = await this.recaptchaService.executeRecaptcha('submit');
    this.commentsForm.controls['token'].setValue(token);
    if (this.commentsForm.invalid || this.isSubmitting) {
      return; // Evitar el reenvío si el formulario no es válido o ya se está enviando
    }

    this.isSubmitting = true; // Bloquea el botón

    try {
      // Ejecuta el reCAPTCHA y obtén el token

      
      // Envía el comentario
      const response = await this.recaptchaService.sendFeedback(this.commentsForm.value);
      console.log(response)
      if (response === 'OK') {
        this.isFeedbackSent = true; // Mostrar animación de éxito
      } else {
        console.error('Error: La respuesta del servidor no fue OK.');
      }

    } catch (error) {
      console.error('Error submitting feedback', error);
    } finally {
      this.isSubmitting = false; // Habilita nuevamente el botón si es necesario
    }
  }
}