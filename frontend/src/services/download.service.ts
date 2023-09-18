import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {  
  //URL for local front and back
  private backendURL:string = "http://localhost:8080";
  //URL for hosted backend
  // private backendURL:string = "https://ytconverter-nf4l-dev.fl0.io";
  // private backendURL:string = "http://localhost:1616";

  constructor(private backend:HttpClient) {}

  public download(url:string,format:string):Observable<any>{
    return this.backend.get(`${this.backendURL}/download?url=${url}&format=${format}`,{
      observe:'response',
      responseType:'blob'
    });
  }
}
