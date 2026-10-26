// Retrato do Gabriel — foto real 400x400 (JPEG), sem filtros de cor.
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

export const ABOUT_PORTRAIT_URI = `data:image/jpeg;base64,${B64}`;
