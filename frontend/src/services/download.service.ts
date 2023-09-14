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
      return this.backend.get(`${this.backendURL}/download?url=${url}&format=${format}`,{
        observe:'response',
        responseType:'blob'
      });
  }
}
