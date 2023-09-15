import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {  
  private backendURL:string = "http://localhost:1616";

  constructor(private backend:HttpClient) {}

  public download(url:string,format:string):Observable<any>{
    // if(format === 'mp4')
    //   return this.backend.get(`${this.backendURL}/download/video?url=${url}`,{
    //     observe:'response',
    //     responseType:'blob'
    //   });
    // else
    return this.backend.get(`${this.backendURL}/download?url=${url}&format=${format}`,{
      observe:'response',
      responseType:'blob'
    });
  }
}
