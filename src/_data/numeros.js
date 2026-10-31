import { readFileSync } from "node:fs";
// O número de pontos é contado automaticamente a partir de pontos.json
const pontos = JSON.parse(readFileSync(new URL("./pontos.json", import.meta.url), "utf8"));

export default [
  { valor: "105,6 t", texto: "de resíduo eletrônico recebidas e destinadas em 2025" },
  { valor: "10 anos", texto: "de atuação em Uberlândia" },
  { valor: String(pontos.lista.length), texto: "pontos de entrega na cidade" },
];
