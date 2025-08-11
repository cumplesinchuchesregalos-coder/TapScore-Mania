
export interface Translation {
  home: {
    title: string;
    subtitle: string;
    play: string;
    shop: string;
    modes: string;
    highScore: string;
  };
  game: {
    score: string;
    paused: string;
    resume: string;
  };
  gameOver: {
    title: string;
    newHighScore: string;
    yourScore: string;
    highScore: string;
    retry: string;
    home: string;
  };
  shop: {
    title: string;
    circleStyles: string;
    equip: string;
    equipped: string;
  };
  shopItems: {
    [key: string]: string;
  };
  modes: {
      title: string;
      classic: {
          title: string;
          description: string;
      },
      survival: {
          title: string;
          description: string;
      },
      precision: {
          title: string;
          description: string;
      },
      bomb: {
          title: string;
          description: string;
      },
      comingSoon: string;
  }
}

const en: Translation = {
  home: {
    title: "TapScore",
    subtitle: "Mania",
    play: "PLAY",
    shop: "Shop",
    modes: "Modes",
    highScore: "High Score",
  },
  game: {
    score: "Score",
    paused: "PAUSED",
    resume: "Resume",
  },
  gameOver: {
    title: "GAME OVER",
    newHighScore: "New High Score!",
    yourScore: "Your Score",
    highScore: "High Score",
    retry: "RETRY",
    home: "Home",
  },
  shop: {
    title: "Shop",
    circleStyles: "Circle Styles",
    equip: "Equip",
    equipped: "Equipped",
  },
  shopItems: {
    style_default: "Vibrant Purple",
    style_electric: "Electric Blue",
    style_sunburst: "Sunburst Orange",
    style_forest: "Forest Green",
    style_golden: "Goldenrod",
    style_square: "The Square",
    style_ring: "The Ring",
    style_ghost: "Ghost",
  },
  modes: {
      title: "Select Mode",
      classic: {
          title: "Classic",
          description: "Tap all you can before 3 misses."
      },
      survival: {
          title: "Survival",
          description: "Circles get faster. Don't miss one!"
      },
      precision: {
          title: "Precision",
          description: "Only tap the correct circles."
      },
      bomb: {
          title: "Bomb Squad",
          description: "Avoid the bombs at all cost!"
      },
      comingSoon: "Coming Soon"
  }
};

const es: Translation = {
  home: {
    title: "TapScore",
    subtitle: "Manía",
    play: "JUGAR",
    shop: "Tienda",
    modes: "Modos",
    highScore: "Puntuación Máxima",
  },
  game: {
    score: "Puntos",
    paused: "PAUSA",
    resume: "Reanudar",
  },
  gameOver: {
    title: "FIN DEL JUEGO",
    newHighScore: "¡Nuevo Récord!",
    yourScore: "Tu Puntuación",
    highScore: "Puntuación Máxima",
    retry: "REINTENTAR",
    home: "Inicio",
  },
  shop: {
    title: "Tienda",
    circleStyles: "Estilos de Círculo",
    equip: "Equipar",
    equipped: "Equipado",
  },
  shopItems: {
    style_default: "Púrpura Vibrante",
    style_electric: "Azul Eléctrico",
    style_sunburst: "Naranja Solar",
    style_forest: "Verde Bosque",
    style_golden: "Vara de Oro",
    style_square: "El Cuadrado",
    style_ring: "El Anillo",
    style_ghost: "Fantasma",
  },
  modes: {
      title: "Elige un Modo",
      classic: {
          title: "Clásico",
          description: "Toca todo lo que puedas antes de 3 fallos."
      },
      survival: {
          title: "Supervivencia",
          description: "¡Los círculos se aceleran. No falles ni uno!"
      },
      precision: {
          title: "Precisión",
          description: "Solo toca los círculos correctos."
      },
      bomb: {
          title: "Antiexplosivos",
          description: "¡Evita las bombas a toda costa!"
      },
      comingSoon: "Próximamente"
  }
};

export const translations = { en, es };
