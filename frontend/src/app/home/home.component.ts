import { HttpErrorResponse } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DownloadService } from 'src/services/download.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  availableFormats:string[] = ['mp3','wav'];
  formatSelected:string = this.availableFormats[0];
  url = new FormControl('');
  error = signal<string|undefined>(undefined);
  isLoading = signal<boolean>(false);

  constructor(private service:DownloadService){}

  convert():void{
    this.error.set(undefined);
    this.isLoading.set(true);
    this.service.download(this.url.value!,this.formatSelected).subscribe({
      next:(res:any) => {
        const fileName = decodeURIComponent(
          res.headers.get('content-disposition')?.split(';')[1].split('=')[1]
        );
        const file:Blob = res.body as Blob;
        const url:string = window.URL.createObjectURL(file);
        const a = document.createElement('a');

        a.download = fileName;
        a.href = url;
        a.click();
        this.isLoading.set(false);
      },
      error:(res:HttpErrorResponse) => {
        if(res.status == 400)
          this.error.set("URL invalida")
        this.isLoading.set(false);
      }
    });
  }

  goToPortfolio(){
    window.location.href = "http://thiagoqua.ar";
  }
}
