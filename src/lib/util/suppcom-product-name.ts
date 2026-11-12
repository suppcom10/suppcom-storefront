// Nombres de presentación. No cambia los datos de Medusa ni el SKU.
// Las referencias ambiguas se mantienen con un identificador para no confundir modelos.
const names: Record<string, string> = {
  NBASX1504VBQ569: "ASUS Vivobook 15 · Intel Core 5 120U · 8 GB · 512 GB SSD",
  NBHPDJ2Z8AT: "HP 14 · Intel Core Ultra 7 355 · 16 GB · 512 GB SSD (DJ2Z8AT)",
  NBHPDJ1L0AT: "HP 14 · Intel Core Ultra 7 355 · 32 GB · 512 GB SSD (DJ1L0AT)",
  NBWHPDK9V8LTABM: "HP ZBook X · Intel Core Ultra 7 356H · 32 GB · 1 TB SSD",
  NBWHPDM4H4LTABM: "HP ZBook 8 · Intel Core Ultra 7 255H · 16 GB · 512 GB SSD",
}
export function suppcomProductName(title?: string | null, sku?: string | null): string {
  if (sku && names[sku.trim().toUpperCase()]) return names[sku.trim().toUpperCase()]
  return title?.trim() || "Producto SUPPCOM"
}
