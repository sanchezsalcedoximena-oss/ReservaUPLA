export const ROLES = {
  ADMINISTRADOR: "Administrador",
  SOLICITANTE: "Solicitante",
  RESPONSABLE_AMBIENTE: "ResponsableAmbiente",
};

export const ETIQUETAS_ROL = {
  [ROLES.ADMINISTRADOR]: "Administrador",
  [ROLES.SOLICITANTE]: "Solicitante",
  [ROLES.RESPONSABLE_AMBIENTE]: "Responsable de ambiente",
};

export const ESTADOS_RESERVA = {
  PENDIENTE: "Pendiente",
  APROBADA: "Aprobada",
  RECHAZADA: "Rechazada",
  CANCELADA: "Cancelada",
};

export const TIPOS_AMBIENTE = {
  LABORATORIO_COMPUTO: "Laboratorio de cómputo",
  AUDITORIO: "Auditorio",
  SALA_REUNIONES: "Sala de reuniones",
  LABORATORIO_ESPECIALIZADO: "Laboratorio especializado",
};

export const ACCIONES_RESERVA = {
  APROBAR: "Aprobar",
  RECHAZAR: "Rechazar",
  CANCELAR: "Cancelar",
};

export const OPCIONES_ROL = Object.values(ROLES).map((valor) => ({
  value: valor,
  label: ETIQUETAS_ROL[valor],
}));

export const OPCIONES_ESTADO = [
  { value: "", label: "Todos" },
  ...Object.values(ESTADOS_RESERVA).map((valor) => ({
    value: valor,
    label: valor,
  })),
];

export const OPCIONES_TIPO_AMBIENTE = Object.values(TIPOS_AMBIENTE).map(
  (valor) => ({ value: valor, label: valor })
);
