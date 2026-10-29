
const SEARCH_ALIASES: Record<string, string> = {
  lenvo: "Lenovo",
  lenobo: "Lenovo",
  lenov: "Lenovo",
  asuss: "ASUS",
  asu: "ASUS",
  hppt: "HP",
  "hewlet packard": "HP",
}

function normalizeSearchTerm(value?: string) {
  const term = value?.trim().toLocaleLowerCase("es-PE")

  if (!term) {
    return ""
  }

  return SEARCH_ALIASES[term] ?? value!.trim()
}
