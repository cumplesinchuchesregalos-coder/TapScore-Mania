
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
      unlockConditions: {
        precision: string;
        bomb: string;
      },
      difficulty: {
        easy: string;
        normal: string;
        hard: string;
      }
  },
  settings: {
      title: string;
      audio: {
          title: string;
          sound: string;
      },
      language: {
          title: string;
          language: string;
      }
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
      unlockConditions: {
        precision: "Play 3 games to unlock.",
        bomb: "Score 50 points in Survival to unlock."
      },
      difficulty: {
        easy: "Easy",
        normal: "Normal",
        hard: "Hard"
      }
  },
  settings: {
      title: "Settings",
      audio: {
          title: "Audio",
          sound: "Sound"
      },
      language: {
          title: "Language",
          language: "Language"
      }
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
      unlockConditions: {
        precision: "Juega 3 partidas para desbloquear.",
        bomb: "Logra 50 puntos en Supervivencia para desbloquear."
      },
      difficulty: {
        easy: "Fácil",
        normal: "Normal",
        hard: "Difícil"
      }
  },
  settings: {
      title: "Ajustes",
      audio: {
          title: "Audio",
          sound: "Sonido"
      },
      language: {
          title: "Idioma",
          language: "Idioma"
      }
  }
};

export const translations = { en, es };
