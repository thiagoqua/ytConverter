import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DownloadService } from 'src/services/download.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  // availableFormats:string[] = ['mp3','wav','mp4'];
  availableFormats:string[] = ['mp3'];
  format = new FormControl('mp3');
  url = new FormControl('');

  constructor(private service:DownloadService){}

  convert():void{
    this.service.download(this.url.value!,this.format.value!).subscribe({
      next:(data:any) => {
        const fileName:string = `converted.${this.format.value!}`;
        const file:Blob = data.body as Blob;
        const url:string = window.URL.createObjectURL(file);
        const a = document.createElement('a');

        a.download = fileName;
        a.href = url;
        a.click();
      }
    });
  }
}
