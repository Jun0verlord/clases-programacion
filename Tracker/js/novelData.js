'use strict';

/**
 * Modelo de datos de prueba. Los capítulos se generan a partir de sus
 * títulos para mantener una estructura consistente entre todas las novelas.
 */

function createChapters(titles, pages, chapterCount) {
  return Array.from({ length: chapterCount }, (_, index) => ({
    id: `c${index + 1}`,
    number: index + 1,
    title: titles[index] || `Capítulo ${index + 1}`,
    pages: pages[index] || (11 + (index % 4))
  }));
}

const novels = [
  {
    id: 'el-secreto-de-las-mareas',
    title: 'El secreto de las mareas',
    author: 'Elena Marín',
    genre: 'Fantasía',
    tags: ['Magia', 'Aventura', 'Misterio'],
    cover: 'Assets/covers/the-tides.svg',
    description: 'Una archivera descubre que las mareas de su ciudad esconden un mapa capaz de alterar el equilibrio entre dos mundos.',
    featured: true,
    seed: {
      status: 'reading',
      progress: 42,
      isFavorite: true,
      addedDaysAgo: 28,
      lastReadHoursAgo: 2
    },
    chapters: createChapters([
      'La ciudad bajo el agua',
      'Cartas sin remitente',
      'La primera marea',
      'El faro dormido',
      'Mareas de sal',
      'La sala de mareas',
      'Un nombre en el cristal',
      'La corriente prohibida',
      'El guardián de la bahía',
      'Antes del amanecer',
      'La puerta de las aguas',
      'Isla sin nombre',
      'El precio del vínculo',
      'La marea negra',
      'Archivos del océano',
      'El último farol',
      'Confesiones del mar',
      'La marca azul',
      'Donde terminan las olas',
      'Regreso a la ciudad',
      'El secreto de las mareas',
      'El nuevo ciclo',
      'Alba en la bahía',
      'El último retorno'
    ], [12, 14, 11, 13, 12, 15, 14, 13, 12, 14, 15, 13, 14, 16, 12, 11, 13, 14, 15, 13, 12, 14, 11, 16], 24)
  },
  {
    id: 'la-ultima-biblioteca',
    title: 'La última biblioteca',
    author: 'Mateo Silva',
    genre: 'Misterio',
    tags: ['Misterio', 'Historical', 'Intriga'],
    cover: 'Assets/covers/the-library.svg',
    description: 'Un bibliotecario recibe la llave de una colección imposible. Cada libro que abre le revela un secreto del pueblo donde creció.',
    featured: true,
    seed: {
      status: 'reading',
      progress: 61,
      isFavorite: true,
      addedDaysAgo: 41,
      lastReadHoursAgo: 26
    },
    chapters: createChapters([
      'La llave sin cerradura',
      'El catálogo imposible',
      'El lector de medianoche',
      'Páginas que no existen',
      'El bibliotecario',
      'Una firma desconocida',
      'El pasillo occidental',
      'El índice de los perdidos',
      'La sala de los silencios',
      'Herencias',
      'El último testigo',
      'La marca en la cubierta',
      'Una puerta entre libros',
      'Los nombres borrados',
      'La colección prohibida',
      'La verdad del catálogo',
      'La última página',
      'De vuelta a casa'
    ], [14, 13, 16, 12, 15, 14, 12, 16, 13, 15, 14, 12, 16, 15, 13, 14, 12, 16], 18)
  },
  {
    id: 'cielo-de-invierno',
    title: 'Cielo de invierno',
    author: 'Lucía Vega',
    genre: 'Romance',
    tags: ['Romance', 'Contemporáneo', 'San Valentín'],
    cover: 'Assets/covers/winter-sky.svg',
    description: 'Dos huéspedes comparten el último refugio de montaña y descubren que una semana de nieve puede cambiar el resto de sus vidas.',
    featured: false,
    seed: {
      status: 'planned',
      progress: 0,
      isFavorite: false,
      addedDaysAgo: 5,
      lastReadHoursAgo: null
    },
    chapters: createChapters([
      'La primera nieve',
      'Dos refugios compartidos',
      'El camino cerrado',
      'Una chimenea encendida',
      'Un valle de plata',
      'Mañana azul',
      'La carta sin enviar',
      'Caminos de vuelta',
      'El valle silencioso',
      'Una promesa',
      'La noche más larga',
      'Pistas en la nieve',
      'A la deriva',
      'El final del invierno',
      'La primavera',
      'Bajo el mismo cielo'
    ], [12, 14, 13, 15, 12, 14, 13, 16, 12, 15, 14, 13, 15, 12, 14, 16], 16)
  },
  {
    id: 'el-siluaje-del-tiempo',
    title: 'El siluaje del tiempo',
    author: 'Andrés Rowland',
    genre: 'Ciencia ficción',
    tags: ['Ciencia ficción', 'Tiempo', 'Aventura'],
    cover: 'Assets/covers/time-silhouette.svg',
    description: 'Una científica encuentra mensajes de su propio futuro y debe impedir que el descubrimiento destruya el único mundo que conocen.',
    featured: false,
    seed: {
      status: 'paused',
      progress: 35,
      isFavorite: false,
      addedDaysAgo: 63,
      lastReadHoursAgo: 168
    },
    chapters: createChapters([
      'Una señal imposible',
      'El reloj sin manecillas',
      'Tres minutos',
      'El primer mensaje',
      'Campos de variación',
      'La memoria ajena',
      'Un día cambiado',
      'La casa en silencio',
      'El final inevitable',
      'Aquí y en otro lugar',
      'Frecuencia cero',
      'El margen de error',
      'Tiempo prestado',
      'Dos científicas',
      'La última elección',
      'El instante',
      'La memoria continúa',
      'Mañana ya fue',
      'Un nuevo presente',
      'El retorno'
    ], [15, 13, 12, 16, 14, 15, 13, 17, 12, 14, 16, 13, 15, 14, 16, 12, 15, 13, 16, 14], 20)
  },
  {
    id: 'la-hora-de-los-cisnes',
    title: 'La hora de los cisnes',
    author: 'Clara Neri',
    genre: 'Contemporáneo',
    tags: ['Contemporáneo', 'Familia', 'Memoria'],
    cover: 'Assets/covers/blue-hour.svg',
    description: 'Una familia regresa al lago de su infancia para cerrar la casa de verano y encuentra un verano que nunca llegó a vivir.',
    featured: false,
    seed: {
      status: 'completed',
      progress: 100,
      isFavorite: true,
      addedDaysAgo: 94,
      lastReadHoursAgo: 336
    },
    chapters: createChapters([
      'La casa junto al lago',
      'Las clases de remar',
      'Un verano archivado',
      'La casa de los cisnes',
      'Cartas de dos manos',
      'El nombre del hermano',
      'La fotografía sin rostro',
      'Tormenta sobre el agua',
      'Lo que nadie preguntó',
      'La última tarde',
      'Una orilla nueva',
      'La memoria de las olas'
    ], [14, 13, 15, 12, 16, 14, 13, 15, 12, 14, 16, 13], 12)
  },
  {
    id: 'atlas-de-lo-perdido',
    title: 'Atlas de lo perdido',
    author: 'Nora Valdés',
    genre: 'Aventura',
    tags: ['Aventura', 'Viajes', 'Misterio'],
    cover: 'Assets/covers/lost-atlas.svg',
    description: 'Un cartógrafo encuentra mapas de lugares que no existen y se embarca en un viaje a las fronteras de lo conocido.',
    featured: false,
    seed: {
      status: 'planned',
      progress: 0,
      isFavorite: false,
      addedDaysAgo: 2,
      lastReadHoursAgo: null
    },
    chapters: createChapters([
      'El mapa que no estaba',
      'Norte de ningún sitio',
      'La primera frontera',
      'Una estación inexistente',
      'Islas de papel',
      'La línea imposible',
      'Territorio en blanco',
      'La ciudad de los ecos',
      'El último transbordador',
      'Cartas desde lo perdido',
      'Desmontando un mito',
      'El borde del atlas',
      'La montaña sin nombre',
      'Volver al punto de partida',
      'El último mapa'
    ], [15, 14, 16, 13, 15, 14, 16, 13, 15, 14, 16, 13, 15, 14, 16], 15)
  }
];

const coverOptions = novels.map(({ cover, title }) => ({ cover, title }));
const genres = [...new Set(novels.map(({ genre }) => genre))].sort((a, b) => a.localeCompare(b, 'es'));

/**
 * Fuentes simuladas para la vista de extensiones. Los favicon son locales
 * para que la demo siga funcionando sin depender de una red externa.
 */
const sources = [
  {
    id: 'src-1',
    name: 'RoyalRoad',
    lang: 'EN',
    baseUrl: 'https://www.royalroad.com',
    favicon: 'Assets/icons/source-royalroad.svg',
    description: 'Seriales de fantasía, aventura y ciencia ficción.',
    isInstalled: true
  },
  {
    id: 'src-2',
    name: 'Syosetu',
    lang: 'JP',
    baseUrl: 'https://syosetu.com',
    favicon: 'Assets/icons/source-syosetu.svg',
    description: 'Novelas ligeras japonesas por capítulos.',
    isInstalled: true
  },
  {
    id: 'src-3',
    name: 'NovelUpdates',
    lang: 'EN',
    baseUrl: 'https://www.novelupdates.com',
    favicon: 'Assets/icons/source-novelupdates.svg',
    description: 'Noticias y seguimiento de novelas en curso.',
    isInstalled: false
  },
  {
    id: 'src-4',
    name: 'Tsundoku Repos',
    lang: 'ES',
    baseUrl: 'https://github.com',
    favicon: 'Assets/icons/source-tsundoku.svg',
    description: 'Repositorios propios para fuentes personalizadas.',
    isInstalled: false
  },
  {
    id: 'src-5',
    name: 'WebNovel ES',
    lang: 'ES',
    baseUrl: 'https://webnovel.es',
    favicon: 'Assets/icons/source-webnovel.svg',
    description: 'Catálogo en español para novels ligeras.',
    isInstalled: false
  }
];

const NovelData = Object.freeze({
  novels,
  sources,
  coverOptions,
  genres,
  getById(id) {
    return novels.find((novel) => novel.id === id) || null;
  },
  getSourceById(id) {
    return sources.find((source) => source.id === id) || null;
  },
  getInstalledSources() {
    return sources.filter(({ isInstalled }) => isInstalled);
  },
  getAvailableSources() {
    return sources.filter(({ isInstalled }) => !isInstalled);
  }
});

window.NovelData = NovelData;
