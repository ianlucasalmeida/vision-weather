// utils/theme.js (Correção de Robustez)

// Tema padrão para ser usado em caso de falha ou carregamento inicial.
const defaultTheme = ['#3C4A5C', '#242D39'];

export const getDynamicTheme = (weatherCondition) => {
  // Se a condição do tempo não for válida, retorna o tema padrão para evitar crashes.
  if (!weatherCondition) {
    return defaultTheme;
  }
  
  const isDayTime = new Date().getHours() >= 6 && new Date().getHours() < 18;

  switch (weatherCondition) {
    case 'Clear':
      return isDayTime ? ['#2980B9', '#6DD5FA'] : ['#0F2027', '#2C5364'];
    case 'Clouds':
      return isDayTime ? ['#606c88', '#3f4c6b'] : ['#3C4A5C', '#242D39'];
    case 'Rain':
    case 'Drizzle':
      return ['#485563', '#29323c'];
    case 'Thunderstorm':
      return ['#141E30', '#243B55'];
    case 'Snow':
      // Corrigindo o erro de digitação que existia aqui.
      return isDayTime ? ['#E6DADA', '#B0BEC5'] : ['#485461', '#28313B'];
    default: // Mist, Smoke, Haze, etc.
      return ['#757F9A', '#D7DDE8'];
  }
};
