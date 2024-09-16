import { Component, OnInit } from '@angular/core';
import { CasinoDataItem , TgmDataItem,ApiResponse } from '../models/data-item.module'; // Ajusta la ruta
import { ApiService } from 'src/app/service-api/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
 
  casinoData: CasinoDataItem | null = null;
  tgmData: TgmDataItem | null = null; // Datos de TGM
  // data : any = {};

  constructor(private apiService : ApiService) {}  /*constructor llaam al API */

  ngOnInit():void{
  this.llenarData();
}

llenarData() {
  // Llamada a los datos de Casino
  this.apiService.getCasinoData().subscribe((response: ApiResponse<CasinoDataItem>) => {
    console.log('Datos de Casino:', response);
    if (response && response.data && Array.isArray(response.data)) {
      const lastItem = response.data[response.data.length - 1];
      this.casinoData = {
        FechaCronologica: lastItem.FechaCronologica,
        EnFila: lastItem.EnFila,
        Cafetin: lastItem.Cafetin
        
      };
    } else {
      console.error('La respuesta de Casino no contiene un array de datos:', response);
    }
  });

  // Llamada a los datos de TGM
  this.apiService.getTgmData().subscribe((response: ApiResponse<TgmDataItem>) => {
    console.log('Datos de TGM:', response);
    if (response && response.data && Array.isArray(response.data)) {
      const lastItem = response.data[response.data.length - 1];
      this.tgmData = {

        FechaRegistro: lastItem.FechaRegistro,
        CardedDolares: lastItem.CardedDolares,
        CardedSoles: lastItem.CardedSoles,
        Total: lastItem.Total
      };
    } else {
      console.error('La respuesta de TGM no contiene un array de datos:', response);
    }
  });
}
}