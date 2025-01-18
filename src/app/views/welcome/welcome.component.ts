import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../service/data/data.service';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
  personalDAta:any;
  services = [
    {
      name: 'SERVICES.GENERAL_CUT',
      price: 'SERVICES.PRICE_4',
      description: 'SERVICES.GENERAL_CUT_DESC',
      image: 'img/services/general_cut.jpg'
    },
    {
      name: 'SERVICES.BLADE_SHADE',
      price: 'SERVICES.PRICE_5',
      description: 'SERVICES.BLADE_SHADE_DESC',
      image: 'img/services/blade_shade.jpg'
    },
    {
      name: 'SERVICES.BEARD_TRIM',
      price: 'SERVICES.PRICE_5',
      description: 'SERVICES.BEARD_TRIM_DESC',
      image: 'img/services/beard_trim.jpg'
    }
  
  ];
  products = [
    {
      name: 'PRODUCTS.PRODUCT1.TITLE',
      price: 13,
      description: 'PRODUCTS.PRODUCT1.DESCRIPTION',
      image: 'img/products/cera-moldeadora.jpg'
    },
    {
      name: 'PRODUCTS.PRODUCT2.TITLE',
      price: 11,
      description: 'PRODUCTS.PRODUCT2.DESCRIPTION',
      image: 'img/products/cera-ossion.jpg'
    },
    {
      name: 'PRODUCTS.PRODUCT3.TITLE',
      price: 11,
      description: 'PRODUCTS.PRODUCT3.DESCRIPTION',
      image: 'img/products/cera-ossion1.jpg'
    } 
  ];
  experienceTitleKey = 'EXPERIENCE.TITLE';
  experienceDescriptionKey = 'EXPERIENCE.DESCRIPTION';

  constructor(private translate: TranslateService,private dataService: DataService) { }

  ngOnInit(): void {
    this.personalDAta=this.dataService.dataPersonal;
  }
 
}
