export async function generarCartelEvento(evento) {
  try {
    const response = await fetch('/api/carteles/generar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(evento)
    });

    if (!response.ok) {
      const texto = await response.text();
      throw new Error(`Error al generar el cartel: ${texto}`);
    }

    const data = await response.json();
    return data; // data.url
  } catch (error) {
    console.error('Error en generarCartelEvento:', error.message);
    throw error;
  }
}
