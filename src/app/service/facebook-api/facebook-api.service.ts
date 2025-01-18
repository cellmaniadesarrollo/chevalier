import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FacebookApiService {

  private accessToken = environment.facebook_token
  constructor() {}

  getAlbumWithPhotos(albumId: string) {
      //const url = `https://graph.facebook.com/v20.0/${albumId}?fields=photos.limit(4)%7Bsource%7D&access_token=${this.accessToken}`;
      //const url = `https://graph.facebook.com/v20.0/${albumId}?fields=photos.limit(4){source,name}&access_token=${this.accessToken}`;
     // const url = `https://graph.facebook.com/v20.0/${albumId}?fields=photos.limit(4){source,name,link,from{id,name}}&access_token=${this.accessToken}`;
     const url = `https://graph.facebook.com/v20.0/${albumId}?fields=photos.limit(4){source,name,link,from{id,name},likes.summary(true)}&access_token=${this.accessToken}`;
    return axios.get(url)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.error('Error fetching album data:', error);
        throw error;
      });
  }
}
