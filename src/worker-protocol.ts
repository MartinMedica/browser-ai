export type WorkerRequest = {
  type: "analyze-image";
  image: Blob | string;
  requestId: number;
}

export type WorkerResponse =
  | { type: "progress"; progress: number }
  | { type: "ready"; }
  | { type: "caption"; text: string; requestId: number; }
  | { type: "error"; message: string; requestId: number; }

export function isWorkerResponse(value: unknown): value is WorkerResponse {
  if (typeof value !== "object" || value === null || !("type" in value)) {
    return false;
  }

  switch (value.type) {
    case "progress":
      return "progress" in value && typeof value.progress === "number";
    case "ready":
      return true;
    case "caption":
      return "requestId" in value &&
        typeof value.requestId === "number" &&
        "text" in value && typeof value.text === "string";
    case "error":
      return "requestId" in value &&
        typeof value.requestId === "number" &&
        "message" in value && typeof value.message === "string";
    default:
      return false;
  }
}
