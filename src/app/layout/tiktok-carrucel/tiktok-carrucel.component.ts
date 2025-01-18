import { Component, NgZone } from '@angular/core';
import { TiktokService } from '../../service/tiktok/tiktok.service';
import { TiktokVideoComponent } from '../tiktok-video/tiktok-video.component';
import { ListtiktokvideosI } from '../../models/tiktok.inteface';
@Component({
  selector: 'app-tiktok-carrucel',
  templateUrl: './tiktok-carrucel.component.html',
  styleUrl: './tiktok-carrucel.component.css'
})
export class TiktokCarrucelComponent {
  // videoIds = [
  //   { videoId: '7413046223613021445', time: 12 },
  //   { videoId: '7415754319548402950', time: 13 },
  //   { videoId: '7415672898523794694', time: 16 },
  //   { videoId: '7413545218471120134', time: 11 },
  //   { videoId: '7413046242881588485', time: 15 },
  //   { videoId: '7410968882778934533', time: 19 }
  // ];
videoIds:ListtiktokvideosI[]=[]
  currentVideoId: string = '';
  currentIndex: number = 0;
  interval: any;
  playCount: number = 0; // Contador de vueltas al array
  maxPlays: number = 3;  // Número máximo de vueltas permitidas

  constructor(private ngZone: NgZone, private api: TiktokService,) { }

  ngOnInit() {
    this.dataget()

    
  }
  async dataget() {
    const data =await this.api.gevideos()
    this.videoIds=data
    this.playNextVideo();
  }
  ngOnDestroy() {
    if (this.interval) {
      clearTimeout(this.interval);
    }
  }

  playNextVideo() {
    // Detener la reproducción después de alcanzar el número máximo de vueltas
    if (this.playCount >= this.maxPlays) {
      console.log("Reproducción detenida después de " + this.maxPlays + " vueltas.");
      return;
    }

    const currentVideo:ListtiktokvideosI = this.videoIds[this.currentIndex];
    this.currentVideoId = currentVideo.video_id;
console.log(currentVideo.duration)
    this.ngZone.runOutsideAngular(() => {
      this.interval = setTimeout(() => {
        this.ngZone.run(() => {
          console.log('next')
          this.nextVideo();
        });
      }, currentVideo.duration* 1000); // Tiempo en milisegundos
    });
  }

  nextVideo() {
    this.currentIndex = (this.currentIndex + 1) % this.videoIds.length;

    // Incrementar el contador de vueltas si llegamos al final del array
    if (this.currentIndex === 0) {
      this.playCount++;
    }

    this.playNextVideo();
  }

  previousVideo() {
    this.currentIndex = (this.currentIndex - 1 + this.videoIds.length) % this.videoIds.length;
    this.playNextVideo();
  }

  selectVideo(index: number) {
    this.currentIndex = index;
    this.playNextVideo();
  }
}
