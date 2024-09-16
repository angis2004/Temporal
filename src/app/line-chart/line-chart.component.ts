import { Component, OnInit } from '@angular/core';
import { Chart ,ChartType,registerables} from 'chart.js/auto';
import { ApiService } from '../service-api/api.service';
import { HttpClient } from '@angular/common/http';
import { CasinoDataItem, TgmDataItem, ApiResponse } from '../models/data-item.module';
import zoomPlugin from 'chartjs-plugin-zoom';
import * as moment from 'moment';

// Registrar los componentes de Chart.js
Chart.register(...registerables);
Chart.register(zoomPlugin); 

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})

export class LineChartComponent implements OnInit{
  // Atributo que almacena los datos del chart
  public chart!: Chart;
  casinoData: CasinoDataItem[] = []; //arrays/
  tgmData: TgmDataItem[] = [];
  

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadDataFromApi();
   
  }



  loadDataFromApi(): void {
    this.apiService.getCasinoData().subscribe({
      next: (response) => {
        console.log('Datos de Casino:', response.data);
        this.casinoData = response.data;
        this.filterCasinoData();
      },
      error: (err) => console.error(err)
    });

    this.apiService.getTgmData().subscribe({
      next: (response) => {
        console.log('Datos de TGM:', response.data);
        this.tgmData = response.data;
        this.filterTgmData();
        this.createChart();
      },
      error: (err) => console.error(err)
    });
  }

  filterCasinoData(): void {
    const startTime = moment().set({ hour: 18, minute: 0, second: 0, millisecond: 0 });
    const endTime = moment().add(1, 'day').set({ hour: 5, minute: 30, second: 0, millisecond: 0 });

    this.casinoData = this.casinoData.filter(item => {
      // Convertir el formato de fecha
      const casinoTime = moment(item.FechaCronologica, 'DD/MM/YYYY HH:mm');
      
      // Ajustar el intervalo que cruza la medianoche
      if (endTime.isBefore(startTime)) {
        return casinoTime.isBetween(startTime, moment().endOf('day'), 'minute', '[)') ||
               casinoTime.isBetween(moment().startOf('day'), endTime, 'minute', '[)');
      } else {
        return casinoTime.isBetween(startTime, endTime, 'minute', '[)');
      }
    });

    console.log('Datos filtrados de Casino:', this.casinoData);
  }

  filterTgmData(): void {
    const startTime = moment().set({ hour: 19, minute: 0, second: 0, millisecond: 0 });
    const endTime = moment().add(1, 'day').set({ hour: 19, minute: 0, second: 0, millisecond: 0 });

    this.tgmData = this.tgmData.filter(item => {
      const tgmTime = moment(item.FechaRegistro);
      const hour = tgmTime.hour();
      const minute = tgmTime.minute();
      
      return (hour >= 19 || (hour < 19 ));
    });

    console.log('Datos filtrados de TGM:', this.tgmData);
  }

  generateTimeLabels(): string[] {
    const labels = [];
    let currentTime = moment().set({ hour: 18, minute: 0 });  // 18:00 del día actual
    const endTime = moment().add(1, 'day').set({ hour: 19, minute: 0 });  // 19:00 del día siguiente

    while (currentTime.isBefore(endTime)) {
      labels.push(currentTime.format('HH:mm'));
      currentTime.add(15, 'minutes');  // Añadir 15 minutos
    }

    return labels;
  }

  createChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = this.generateTimeLabels();
    
    const tgmDataMap = new Map(
      this.tgmData.map(item => [moment(item.FechaRegistro).format('HH:mm'), item])
    );

    const casinoDataMap = new Map(
      this.casinoData.map(item => [moment(item.FechaCronologica, 'DD/MM/YYYY HH:mm').format('HH:mm'), item])
    );

    const tgmDataPoints = labels.map(label => {
      const tgmItem = tgmDataMap.get(label);
      return tgmItem ? tgmItem.CardedSoles + tgmItem.CardedDolares : 0;
    });

    const casinoDataPoints = labels.map(label => {
      const casinoItem = casinoDataMap.get(label);
      return casinoItem ? casinoItem.EnFila : 0;
    });

  


    const chartElement = document.getElementById('chartCanvas') as HTMLCanvasElement;

    this.chart = new Chart(chartElement, {
      type: 'line' as ChartType,
      data: {
      labels: labels,  // extraccion de las hora FeOpera en el eje X
      datasets: [
        {
          label: 'CASINO',
          data: casinoDataPoints,
          borderColor: 'red',
          backgroundColor: 'rgba(255, 0, 0, 0.5)',
          yAxisID: 'y1',
        },
        {
          /*suma*/
          label: 'TGM  Total',
          data: tgmDataPoints,
          borderColor: 'blue',
          backgroundColor: 'rgba(0, 0, 255, 0.5)',
          yAxisID: 'y',
        }
      ]
    },


    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },

        plugins: {
          title: {
            display: true,
            text: 'Datos actualizados de Casino y TGM'
          },
      
          tooltip: {
            callbacks: {
              // Mostrar CardedDolares y CardedSoles de TGM
              beforeBody: (context) => {
                const index = context[0].dataIndex;
                const label = labels[index];
                const tgmItem = tgmDataMap.get(label);
                if (tgmItem) {
                  return `TGM Carded Dólares: ${tgmItem.CardedDolares}\nTGM Carded Soles: ${tgmItem.CardedSoles}`;
                }
                return '';
              }
            }
          },



        zoom: { 
          zoom: {                       
     wheel: {
       enabled: true,       
     },
    
     pinch: {
       enabled: true          
     },
     mode: 'x', // Zoom solo en el eje X
    },
    pan: {
      enabled: true,
      mode: 'x', // Pan solo en el eje X
    },
  }
},
        scales: {
          x:{
         
            title:{
              display: true,
              text:'HORAS'
            }
          },
          // y: {
          //   type: 'linear',
          //   display: true,
          //   position: 'left',
          //   title: {
          //     display: true,
          //     text: 'Cantidad'
          //   },
          //   grid: {
          //     drawOnChartArea: false,
          //   }
          // },
            
          
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title:{
              display:true,
              text:'cantidad',
            },
            grid: {
              drawOnChartArea: false,
            },
          },
        }
      }
    });
  }
  

}

