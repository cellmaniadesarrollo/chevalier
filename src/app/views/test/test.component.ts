// test.component.ts
import { Component } from '@angular/core';
import { FacebookApiService } from '../../service/facebook-api/facebook-api.service'; 
import { ListfacebookphotosI } from '../../models/tiktok.inteface';
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {
 
  photos:ListfacebookphotosI []=[];

  constructor(private facebookApiService: FacebookApiService ) { }
  ngOnInit(): void {
    this.facebook()
  }
  async facebook() {
    const albumId = '552712573317644';
    try {
      const data= await this.facebookApiService.getAlbumWithPhotos(albumId);
      this.photos=data.photos.data
      console.log(data.photos.data)
    } catch (error) {
      console.error('Error loading album:', error);
    }
  }

  profilePictureUrl(userId: string): string {
    return `https://graph.facebook.com/${userId}/picture?type=large`;
  }
  
  profileLink(userId: string): string {
    return `https://www.facebook.com/${userId}`;
  }
 
}