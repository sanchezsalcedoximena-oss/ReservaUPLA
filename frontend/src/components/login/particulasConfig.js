export function crearOpcionesParticulas(cantidad) {
  return {
    fullScreen: { enable: false },
    fpsLimit: 40,
    detectRetina: true,
    particles: {
      number: {
        value: cantidad,
        density: { enable: false },
      },
      color: {
        value: ["#4DA3FF", "#7FD0FF", "#FFFFFF"],
      },
      shape: { type: "circle" },
      opacity: {
        value: { min: 0.2, max: 0.65 },
        animation: {
          enable: true,
          speed: 0.25,
          sync: false,
          startValue: "random",
        },
      },
      size: {
        value: { min: 1, max: 2.5 },
      },
      links: {
        enable: true,
        distance: 130,
        color: "#7FD0FF",
        opacity: 0.2,
        width: 1,
      },
      move: {
        enable: true,
        speed: { min: 0.3, max: 0.5 },
        direction: "none",
        random: true,
        straight: false,
        outModes: { default: "out" },
      },
    },
    interactivity: {
      detectsOn: "window",
      events: {
        onHover: {
          enable: true,
          mode: "grab",
        },
        resize: { enable: true },
      },
      modes: {
        grab: {
          distance: 140,
          links: { opacity: 0.18 },
        },
      },
    },
    pauseOnBlur: true,
    pauseOnOutsideViewport: true,
  };
}
