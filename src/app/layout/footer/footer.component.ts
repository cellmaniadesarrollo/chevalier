import { Component, HostListener  } from '@angular/core';
import { DataService } from '../../service/data/data.service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
 
})
export class FooterComponent {
  socialLinks: any;
  personalDAta:any;
  constructor( private dataService: DataService) { 
  }
  ngOnInit(): void { 
    this.socialLinks = this.dataService.socialLinks;
    this.personalDAta=this.dataService.dataPersonal;
  }
  isInView = false;

  @HostListener('window:scroll', [])
  onScroll(): void {
    const footer = document.querySelector('.footer-section');
    const rect = footer?.getBoundingClientRect();
    if (rect && rect.top < window.innerHeight) {
      this.isInView = true;
    } else {
      this.isInView = false;
    }
  }
}
