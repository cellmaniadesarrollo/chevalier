import { Component } from '@angular/core';

@Component({
  selector: 'app-carrucelwelcome',
  templateUrl: './carrucelwelcome.component.html',
  styleUrl: './carrucelwelcome.component.css'
})
export class CarrucelwelcomeComponent {
  images = [
    { path: 'img/carrucel/1.jpg',titleKey:"CAROUSEL.SLIDE1.TITLE", descriptionKey: 'CAROUSEL.SLIDE1.DESCRIPTION' },
    { path: 'img/carrucel/2.jpg',titleKey:"CAROUSEL.SLIDE2.TITLE", descriptionKey: 'CAROUSEL.SLIDE2.DESCRIPTION' },
    { path: 'img/carrucel/3.jpg',titleKey:"CAROUSEL.SLIDE3.TITLE", descriptionKey: 'CAROUSEL.SLIDE3.DESCRIPTION' }
  ];
}
