"use client"

import { useSearchParams } from "next/navigation"

/**
 * Mensaje informativo: NO es un proveedor de pagos ni inicia financiamiento.
 * No presentar financiamiento como disponible hasta tener contrato, sandbox,
 * credenciales y callbacks de confirmación revisados.
 */
export default function FinancingInfo() {
  const step = useSearchParams().get("step")
  if (step !== "payment" && step !== "review") return null

  return (
    <section aria-label="Opciones de financiamiento" className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <h3 className="text-base font-bold text-neutral-900">¿Prefieres pagar en cuotas?</h3>
        <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-semibold text-neutral-600">
          Próximamente
        </span>
      </div>
      <p className="text-sm leading-6 text-neutral-600">
        Estamos evaluando integrar aCuotaz y Powerpay para ofrecer financiamiento
        sujeto a evaluación y aprobación de cada proveedor.
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-neutral-200 p-3">
          <p className="text-sm font-semibold text-neutral-900">aCuotaz</p>
          <p className="mt-1 text-xs text-neutral-500">Crédito sujeto a evaluación. Integración aún no habilitada.</p>
        </div>
        <div className="rounded-lg border border-neutral-200 p-3">
          <p className="text-sm font-semibold text-neutral-900">Powerpay</p>
          <p className="mt-1 text-xs text-neutral-500">Cuotas con tarjeta de crédito, sujeto a elegibilidad. Aún no habilitado.</p>
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-neutral-500">
        Por ahora selecciona únicamente los medios de pago habilitados arriba.
        Esta sección no procesa solicitudes de financiamiento ni crea pedidos.
      </p>
    </section>
  )
}
