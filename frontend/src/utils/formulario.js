export function enfocarPrimerCampoConError(errores, ordenCampos) {
  const primerCampo = ordenCampos.find((campo) => errores[campo]);

  if (!primerCampo) {
    return;
  }

  window.setTimeout(() => {
    document.getElementById(primerCampo)?.focus();
  }, 0);
}
