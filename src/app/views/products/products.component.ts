import { Component } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
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
    },
    {
      name: 'PRODUCTS.PRODUCT4.TITLE',
      price: 11,
      description: 'PRODUCTS.PRODUCT4.DESCRIPTION',
      image: 'img/products/talco-perfumado.jpg'
    }
    ,
    {
      name: 'PRODUCTS.PRODUCT5.TITLE',
      price: 30,
      description: 'PRODUCTS.PRODUCT5.DESCRIPTION',
      image: 'img/products/minoxidil-10-trioxidil-5.jpg'
    }
  ];
}
