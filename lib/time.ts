export const PANAMA_TZ = "America/Panama" as const

export function formatPanamaDateTime(iso: string) {
  const d = new Date(iso)
  return new Intl.DateTimeFormat("es-PA", {
    timeZone: PANAMA_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d)
}
