// Mapeo de categorías a imágenes de fondo
export const getCategoryImage = (categoryName: string): string => {
  const categoryImages: Record<string, string> = {
    'Teatro': 'https://enfoquemultimedia.com/wp-content/uploads/2020/07/Que-es-el-teatro.jpg',
    'Música': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop', 
    'Concierto': 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=600&fit=crop',
    'Deportes': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop',
    'Conferencia': 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop',
    'Tecnología': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
    'Arte': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
    'Gastronómico': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    'Gastronomía': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    'Cine': 'https://images.unsplash.com/photo-1489599904372-af1d5049077d?w=800&h=600&fit=crop',
    'Cultura': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    'Entretenimiento': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
    'Educación': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
    'Familiar': 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop',
    'Festival': 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
    'Exposición': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    'default': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop'
  };

  // Buscar por coincidencia exacta primero
  if (categoryImages[categoryName]) {
    return categoryImages[categoryName];
  }

  // Buscar por coincidencia parcial (insensible a mayúsculas)
  const categoryNameLower = categoryName.toLowerCase();
  for (const [key, value] of Object.entries(categoryImages)) {
    if (key.toLowerCase().includes(categoryNameLower) || categoryNameLower.includes(key.toLowerCase())) {
      return value;
    }
  }

  // Retornar imagen por defecto si no se encuentra coincidencia
  return categoryImages.default;
};

// Función para obtener la imagen de la primera categoría de un evento
export const getEventCategoryImage = (event: any): string => {
  if (event.categoryManages && event.categoryManages.length > 0) {
    const firstCategory = event.categoryManages[0];
    if (firstCategory.eventCategory && firstCategory.eventCategory.name) {
      return getCategoryImage(firstCategory.eventCategory.name);
    }
  }

  // Si no hay categorías, usar imagen por defecto
  return getCategoryImage('default');
};
