import { Component } from '@angular/core';
import { DataService } from '../../service/data/data.service';
@Component({
  selector: 'app-social-media-links',
  templateUrl: './social-media-links.component.html',
  styleUrl: './social-media-links.component.css'
})
export class SocialMediaLinksComponent {
  socialLinks: any;
  constructor( private dataService: DataService) { 
  }

   
  ngOnInit(): void { 
    this.socialLinks = this.dataService.socialLinks;
  }
}
