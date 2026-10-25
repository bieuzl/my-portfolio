// Retrato do Gabriel — foto original 3:4, sem filtros de cor (WebP q86, 396x528).
// O base64 foi fatiado em partes de 100 bytes na pasta parts/ para permitir
// envio verificado byte-identical via API de conteudos do GitHub (MCP e text-only);
// aqui as partes sao montadas em runtime via import.meta.glob do Vite (?raw).
const parts = import.meta.glob("./parts/part-*.txt", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const B64 = Object.keys(parts)
  .sort()
  .map((k) => parts[k].trimEnd())
  .join("");

export const ABOUT_PORTRAIT_URI = `data:image/webp;base64,${B64}`;
