export default function formatDate(dateStr: string): string {
  if (!dateStr || dateStr.length < 14) return "Không rõ";
  const y = dateStr.slice(0, 4);
  const m = dateStr.slice(4, 6);
  const d = dateStr.slice(6, 8);
  const h = dateStr.slice(8, 10);
  const min = dateStr.slice(10, 12);
  const s = dateStr.slice(12, 14);
  return `${d}/${m}/${y} ${h}:${min}:${s}`;
}
