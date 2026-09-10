import { CUSTOM_CONTENT_SEED } from './customContentSeed';

// Copia el contenido personalizado a localStorage, pero SOLO en las claves
// que aun no existen en este navegador. Nunca sobrescribe una edicion real
// (propia o de otro visitante) ni el resto de claves de localStorage.
export function seedCustomContent(): void {
  try {
    for (const [key, value] of Object.entries(CUSTOM_CONTENT_SEED)) {
      if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, value);
      }
    }
  } catch {
    // localStorage puede no estar disponible (modo privado, cuotas, etc.).
    // Si falla, la app sigue funcionando con sus valores por defecto.
  }
}
