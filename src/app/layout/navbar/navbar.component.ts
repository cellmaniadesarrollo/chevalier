import { Component  } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../service/data/data.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isScrolled = false;
  languages = ['en', 'es'];
  selectedLanguage = 'es';
  socialLinks: any;
  constructor(private translate: TranslateService,private dataService: DataService) {
    this.translate.setDefaultLang(this.selectedLanguage);
  }
 
  ngOnInit(): void { 
    this.socialLinks = this.dataService.socialLinks;
  }
  changeLanguage(lang: string) { 
     
    this.translate.use(lang);
  }

  isMenuOpen = false;
  closeMenu() {
    this.isMenuOpen = false;
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
