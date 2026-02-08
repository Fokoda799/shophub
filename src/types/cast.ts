export function castDocument<T>(doc: unknown): T {
  return doc as T;
}

export function castDocuments<T>(docs: unknown[]): T[] {
  return docs as T[];
}