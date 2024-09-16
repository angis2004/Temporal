import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, CasinoDataItem, TgmDataItem } from '../models/data-item.module'; // Ajusta la ruta


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private casinoUrl = 'https://apinoad.gruposam.com.pe/corp/sica/api/conteo-clientes/ReporteMatrizConteoCliente';
  private tgmUrl = 'https://apinoad.gruposam.com.pe/hub-mda/api/ocupacion?fechaInicio=2024-09-03&fechaFin=2024-09-04';

  constructor(private http:HttpClient) { }


getCasinoData(currentDate :string): Observable<ApiResponse<CasinoDataItem >>{
  return this.http.get<ApiResponse<CasinoDataItem>>(`${this.casinoUrl}/${currentDate}`);
}
// Método para obtener los datos de TGM
getTgmData(startDate: string, _endDate: string): Observable<ApiResponse<TgmDataItem>> {
  return this.http.get<ApiResponse<TgmDataItem>>(this.tgmUrl);
}
}



