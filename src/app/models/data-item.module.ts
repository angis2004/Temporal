// src/app/models/data-item.model.ts

export interface CasinoDataItem {
   
    FechaCronologica: string;
    EnFila: number;
    Cafetin: number;
  }

  export interface TgmDataItem {
    
    FechaRegistro: string;
    CardedSoles: number;
    CardedDolares:number;
    Total: number;
  }
  
  
 // Definir la interfaz ApiResponse como genérica
    export interface ApiResponse<T> {
    ok: boolean;
    message: string;
    data: T[]; // Aquí T es genérico y puede ser CasinoDataItem, TgmDataItem, etc.
  }
  
 