<template>
  <div class="dashboard-layout">
    <h2 class="titulo">Panel de Control</h2>

    <div class="dashboard-grid">
      <!-- Gráfico de pastel -->
      <div class="grafico">
        <Doughnut :data="chartData" :options="chartOptions" />
      </div>

      <!-- Gráfico de barras por estado -->
      <div class="grafico">
        <Bar :data="barChartData" :options="barChartOptions" />
      </div>

      <!-- Comparación usuarios vs proyectos -->
      <div class="grafico">
        <Bar :data="destinoChartData" :options="destinoChartOptions" />
      </div>

      <!-- Panel equipos libres -->
      <div class="panel-libre">
        <h3>Equipos Libres</h3>
        <ul>
          <li v-for="equipo in equiposLibres" :key="equipo.id_equipo">
            {{ equipo.referencia }}
          </li>
        </ul>
      </div>

      <!-- Panel asignaciones activas -->
      <div class="panel-asignados">
        <h3>Equipos Asignados</h3>
        <table>
          <thead>
            <tr>
              <th>Equipo</th>
              <th>Asignado a</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in asignacionesOrdenadas" :key="a.id_asignacion">
              <td>{{ a.referencia }}</td>
              <td>{{ a.usuario || a.proyecto }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { Doughnut, Bar } from 'vue-chartjs';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

import { obtenerEquipos } from '../services/equipos';
import { obtenerAsignaciones } from '../services/asignaciones';

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartDataLabels
);

export default {
  name: 'InicioView',
  components: { Doughnut, Bar },
  setup() {
    const equipos = ref([]);
    const asignaciones = ref([]);

    const cargarDatos = async () => {
      equipos.value = await obtenerEquipos();
      asignaciones.value = await obtenerAsignaciones();
    };

    const equiposLibres = computed(() =>
      equipos.value.filter((e) => e.estado === 'disponible')
    );

    const asignacionesActivas = computed(() =>
      asignaciones.value.filter((a) => a.activa === 1)
    );

    const asignacionesOrdenadas = computed(() => {
      return asignacionesActivas.value
        .slice()
        .sort((a, b) => a.referencia.localeCompare(b.referencia));
    });

    const equiposPorEstado = computed(() => {
      const conteo = {
        asignado: 0,
        disponible: 0,
        baja: 0
      };
      equipos.value.forEach((e) => {
        if (conteo[e.estado] !== undefined) {
          conteo[e.estado]++;
        }
      });
      return conteo;
    });

    const asignacionesPorDestino = computed(() => {
      let usuarios = 0;
      let proyectos = 0;
      asignacionesActivas.value.forEach((a) => {
        if (a.id_usuario) usuarios++;
        if (a.id_proyecto) proyectos++;
      });
      return { usuarios, proyectos };
    });

    const chartData = computed(() => ({
      labels: ['Disponibles', 'En uso'],
      datasets: [
        {
          data: [equiposLibres.value.length, asignacionesActivas.value.length],
          backgroundColor: ['#4ade80', '#f87171']
        }
      ]
    }));

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        }
      }
    };

    const barChartData = computed(() => ({
      labels: ['Asignado', 'Disponible', 'Baja'],
      datasets: [
        {
          label: 'Equipos por estado',
          data: [
            equiposPorEstado.value.asignado,
            equiposPorEstado.value.disponible,
            equiposPorEstado.value.baja
          ],
          backgroundColor: ['#facc15', '#4ade80', '#a1a1aa']
        }
      ]
    }));

    const barChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        datalabels: {
          anchor: 'end',
          align: 'top',
          color: '#000',
          font: {
            weight: 'bold'
          },
          formatter: Math.round
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    };

    const destinoChartData = computed(() => ({
      labels: ['Usuarios', 'Proyectos'],
      datasets: [
        {
          label: 'Asignaciones por tipo',
          data: [
            asignacionesPorDestino.value.usuarios,
            asignacionesPorDestino.value.proyectos
          ],
          backgroundColor: ['#3b82f6', '#f59e0b']
        }
      ]
    }));

    const destinoChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        datalabels: {
          anchor: 'end',
          align: 'top',
          color: '#000',
          font: {
            weight: 'bold'
          },
          formatter: Math.round
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    };

    onMounted(async () => {
      await cargarDatos();
    });

    return {
      chartData,
      chartOptions,
      equiposLibres,
      asignacionesActivas,
      asignacionesOrdenadas,
      barChartData,
      barChartOptions,
      destinoChartData,
      destinoChartOptions
    };
  }
};
</script>

<style scoped>

.dashboard-layout {
  padding: 2rem;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.titulo {
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 2rem;
  color: #1f2937;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 2rem;
  align-items: start;
}

.grafico {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.panel-libre {
  background: #1d4ed8;
  color: white;
  padding: 1.5rem;
  border-radius: 1rem;
  text-align: center;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.panel-libre h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.panel-libre ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.95rem;
}

.panel-asignados {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
}

.panel-asignados h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #1f2937;
}

.panel-asignados table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.panel-asignados th,
.panel-asignados td {
  border-bottom: 1px solid #e5e7eb;
  padding: 0.75rem 0.5rem;
  text-align: left;
}

.panel-asignados th {
  background: #111827;
  color: white;
  font-weight: 600;
  text-transform: uppercase;
}

.panel-asignados tr:last-child td {
  border-bottom: none;
}

.panel-asignados tr:hover {
  background-color: #f3f4f6;
  transition: background-color 0.3s;
}

</style>