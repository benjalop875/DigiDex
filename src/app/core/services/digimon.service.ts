import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { DigimonResponse, DigimonQueryParams, DigiApiListResponse, DigiApiDetailResponse, DigiApiField } from '../models/digimon.model';

@Injectable({
  providedIn: 'root'
})
export class DigimonService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://digi-api.com/api/v1';

  // Cache for descriptions
  private readonly detailCache = new Map<string, string>();

  /**
   * Fetches a paginated list of digimons based on the provided query parameters.
   */
  getDigimons(params?: DigimonQueryParams): Observable<DigimonResponse> {
    let httpParams = new HttpParams();

    if (params) {
      if (params.name) httpParams = httpParams.set('name', params.name);
      if (params.exact !== undefined) httpParams = httpParams.set('exact', params.exact.toString());
      if (params.attribute) httpParams = httpParams.set('attribute', params.attribute);
      if (params.xAntibody !== undefined) httpParams = httpParams.set('xAntibody', params.xAntibody.toString());
      if (params.level) httpParams = httpParams.set('level', params.level);
      if (params.page !== undefined) httpParams = httpParams.set('page', params.page.toString());
      if (params.pageSize !== undefined) httpParams = httpParams.set('pageSize', params.pageSize.toString());
    }

    return this.http.get<DigimonResponse>(`${this.apiUrl}/digimon`, { params: httpParams });
  }

  getLevels(): Observable<DigiApiField[]> {
    // The API forces pagination of 5 items per page, so we fetch both page 0 and 1
    return forkJoin([
      this.http.get<DigiApiListResponse>(`${this.apiUrl}/level?page=0`),
      this.http.get<DigiApiListResponse>(`${this.apiUrl}/level?page=1`)
    ]).pipe(
      map(responses => [...responses[0].content.fields, ...responses[1].content.fields])
    );
  }

  getAttributes(): Observable<DigiApiField[]> {
    // The API forces pagination of 5 items per page, so we fetch both page 0 and 1
    return forkJoin([
      this.http.get<DigiApiListResponse>(`${this.apiUrl}/attribute?page=0`),
      this.http.get<DigiApiListResponse>(`${this.apiUrl}/attribute?page=1`)
    ]).pipe(
      map(responses => [...responses[0].content.fields, ...responses[1].content.fields])
    );
  }

  getLevelDescription(idOrName: string | number): Observable<DigiApiDetailResponse | string> {
    const cacheKey = `level-${idOrName}`;
    if (this.detailCache.has(cacheKey)) {
      return of(this.detailCache.get(cacheKey)!);
    }
    return this.http.get<DigiApiDetailResponse>(`${this.apiUrl}/level/${idOrName}`).pipe(
      tap(res => this.detailCache.set(cacheKey, res.description))
    );
  }

  getAttributeDescription(idOrName: string | number): Observable<DigiApiDetailResponse | string> {
    const cacheKey = `attribute-${idOrName}`;
    if (this.detailCache.has(cacheKey)) {
      return of(this.detailCache.get(cacheKey)!);
    }
    return this.http.get<DigiApiDetailResponse>(`${this.apiUrl}/attribute/${idOrName}`).pipe(
      tap(res => this.detailCache.set(cacheKey, res.description))
    );
  }
}
