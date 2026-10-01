export type MediaKind = "image" | "gif" | "video";

export function assertNever(value: never, name = "value"): never {
  throw new Error(`Unhandled ${name}: ${JSON.stringify(value)}`);
}
