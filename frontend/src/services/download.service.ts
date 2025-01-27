import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  private backendURL: string = 'https://ytconverter-33k5.onrender.com';
  private queryQualities: any = {
    'baja': 'low',
    'media': 'medium',
    'alta': 'high',
  };

  constructor(private backend: HttpClient) {}

  public download(
    url: string,
    format: string,
    spanishQuality: string
  ): Observable<any> {
    const quality = this.queryQualities[spanishQuality];

    return this.backend.get(
      `${this.backendURL}/download?url=${url}&format=${format}&quality=${quality}`,
      {
        observe: 'response',
        responseType: 'blob',
      }
    );
  }
}
