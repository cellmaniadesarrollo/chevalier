import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // Email compartido
  public readonly dataPersonal = {
    email :'chevalierbarbershop13@gmail.com',
    phone: '0963607460',
    adress: 'Luis Cordero 4-09 y Sucre', 
  };
 

  // Enlaces a redes sociales
  public readonly socialLinks = {
    facebook: 'https://www.facebook.com/chevalierbarberia',
    instagram: 'https://www.instagram.com/chevalier_barber/?hl=es',
    tiktok: 'https://www.tiktok.com/@chevalierbarber',
    youtube:'https://www.youtube.com/channel/UCfYUUwl0Vm3qV3wlIkW9Ntg'
  };
  constructor() { }
}
