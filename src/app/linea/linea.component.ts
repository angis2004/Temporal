import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';




@Component({
  selector: 'app-linea',
  templateUrl: './linea.component.html',
  styleUrls: ['./linea.component.css']
})
export class LineaComponent implements OnInit {
  
  public chart!: Chart;

  ngOnInit(): void {

 // Crear las etiquetas para el eje X (de 18:00 a 19:00 cada 15 minutos)
 const labels = [];
 let date = new Date();
 date.setHours(18, 0, 0, 0); // Establecer la hora inicial en 18:00
 
 while (date.getHours() < 19) {
   labels.push(date.toTimeString().substring(0, 5)); // Formato HH:mm
   date.setMinutes(date.getMinutes() + 15);
 }

 // Datos para el gráfico
 const data = {
   labels: labels,
   datasets: [
     {
       label: 'TGM',
       data: [65, 59, 80, 81, 56, 75, 89, 66], // Datos de ejemplo para TGM
       fill: false,
       borderColor: 'rgb(54, 162, 235)', // Color azul para TGM
       tension: 0.1
     },
     {
       label: 'Casino',
       data: [45, 39, 60, 71, 46, 55, 70, 80], // Datos de ejemplo para Casino
       fill: false,
       borderColor: 'rgb(255, 99, 132)', // Color rojo para Casino
       tension: 0.1
     }
   ]
 };

 // Configuración de la gráfica
 this.chart = new Chart("chart", {
   type: 'line' as ChartType,
   data: data,
   options: {
     scales: {
       x: {
         title: {
           display: true,
           text: 'Horas'
         },
         ticks: {
           autoSkip: false, 
           maxRotation: 90, 
           minRotation: 45 
         }
       },
       y: {
         title: {
           display: true,
           text: 'Cantidad'
         }
       }
     }
   }
 });

}

}