import { Component } from '@angular/core';
import { DataService } from '../../service/data/data.service';
@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrl: './aboutus.component.css'
})
export class AboutusComponent {
  personalDAta:any;

  // Your API Key: ZoUukmpN3aUre63w5Pk2fPx5P7UIe/fNBqxxkW6EdopWqIVKjbOWPAqi1K36v5uSsZbtKuG6XpKZf4/OjfZAjardtOY=
  constructor( private dataService: DataService) { }

  ngOnInit(): void {
    this.personalDAta=this.dataService.dataPersonal;
  }

}
