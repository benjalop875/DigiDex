import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DigimonResponse, DigimonQueryParams } from '../models/digimon.model';

@Injectable({
  providedIn: 'root'
})
export class DigimonService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://digi-api.com/api/v1/digimon';

  /**
   * Fetches a paginated list of digimons based on the provided query parameters.
   * 
   * @param params Query parameters for filtering and pagination.
   * @returns An Observable of DigimonResponse.
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

    return this.http.get<DigimonResponse>(this.apiUrl, { params: httpParams });
  }
}
