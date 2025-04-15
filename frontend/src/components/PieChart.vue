<template>
    <div>
      <canvas ref="canvas"></canvas>
    </div>
  </template>
  
  <script>
  import { onMounted, ref } from 'vue';
  import Chart from 'chart.js/auto';
  
  export default {
    name: 'PieChart',
    props: ['disponibles', 'asignados'],
    setup(props) {
      const canvas = ref(null);
  
      onMounted(() => {
        new Chart(canvas.value, {
          type: 'pie',
          data: {
            labels: ['Disponibles', 'En uso'],
            datasets: [
              {
                data: [props.disponibles, props.asignados],
                backgroundColor: ['#4ade80', '#f87171']
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top'
              }
            }
          }
        });
      });
  
      return { canvas };
    }
  };
  </script>
  