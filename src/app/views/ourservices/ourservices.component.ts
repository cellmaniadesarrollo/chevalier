import { Component, ElementRef } from '@angular/core';  

@Component({
  selector: 'app-ourservices',
  templateUrl: './ourservices.component.html',
  styleUrl: './ourservices.component.css',
 
})
export class OurservicesComponent {
  services = [
    {
      name: 'SERVICES.GENERAL_CUT',
      price: 'SERVICES.PRICE_4',
      description: 'SERVICES.GENERAL_CUT_DESC',
      image: 'img/services/general_cut.jpg',
    },
    {
      name: 'SERVICES.BLADE_SHADE',
      price: 'SERVICES.PRICE_5',
      description: 'SERVICES.BLADE_SHADE_DESC',
      image: 'img/services/blade_shade.jpg',
    },
    {
      name: 'SERVICES.BEARD_TRIM',
      price: 'SERVICES.PRICE_5',
      description: 'SERVICES.BEARD_TRIM_DESC',
      image: 'img/services/beard_trim.jpg',
    },
    {
      name: 'SERVICES.FACIAL_CLEANSE',
      price: 'SERVICES.PRICE_10',
      description: 'SERVICES.FACIAL_CLEANSE_DESC',
      image: 'img/services/facial_cleanse.jpg',
    },
    {
      name: 'SERVICES.TRIBAL_DESIGN',
      price: 'SERVICES.PRICE_8',
      description: 'SERVICES.TRIBAL_DESIGN_DESC',
      image: 'img/services/tribal_design.jpg',
    },
    {
      name: 'SERVICES.BEARD_SHADE',
      price: 'SERVICES.PRICE_3',
      description: 'SERVICES.BEARD_SHADE_DESC',
      image: 'img/services/beard_shade.jpg',
    },
    {
      name: 'SERVICES.BLACK_MASK',
      price: 'SERVICES.PRICE_5',
      description: 'SERVICES.BLACK_MASK_DESC',
      image: 'img/services/black_mask.jpg',
    },
    {
      name: 'SERVICES.HAIR_DYE',
      price: 'SERVICES.PRICE_30_40',
      description: 'SERVICES.HAIR_DYE_DESC',
      image: 'img/services/hair_dye.jpg',
    },
    {
      name: 'SERVICES.HIGHLIGHTS',
      price: 'SERVICES.PRICE_10_25',
      description: 'SERVICES.HIGHLIGHTS_DESC',
      image: 'img/services/highlights.jpg',
    },
  ];

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    const options = {
      threshold: 0.1, // 10% de visibilidad para activar la animación
    };

    const observer = new IntersectionObserver(this.handleIntersect.bind(this), options);

    const targets = this.el.nativeElement.querySelectorAll('.service-card');
    targets.forEach((target: Element) => {
      observer.observe(target);
    });
  }

  handleIntersect(entries: any[]): void {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }
}
