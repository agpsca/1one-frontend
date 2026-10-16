/**
 * Unico arquivo manual de src/api. Todas as chamadas geradas pelo Orval passam
 * por aqui: baseURL, erro tipado e desembrulho do JSON.
 *
 * Mudancas aqui afetam todas as chamadas da aplicacao.
 */

const baseUrl = "/api";

/** Erro de resposta nao-2xx, com status e corpo pra quem quiser inspecionar. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly body: unknown,
  ) {
    super(`HTTP ${status}`);
    this.name = "ApiError";
  }
}

export const customFetch = async <T>(
  url: string,
  init?: RequestInit,
): Promise<T> => {
  const response = await fetch(`${baseUrl}${url}`, init);

  // 204/205 e respostas sem corpo: nao ha JSON pra parsear.
  const raw = response.status === 204 ? "" : await response.text();
  const body = raw ? (JSON.parse(raw) as unknown) : undefined;

  if (!response.ok) throw new ApiError(response.status, body);

  return body as T;
};
