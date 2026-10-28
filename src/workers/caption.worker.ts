import type { WorkerRequest, WorkerResponse } from "@/worker-protocol.ts"
import { InterruptableStoppingCriteria, pipeline, type PipelineType } from "@huggingface/transformers"

const TASK: PipelineType = "image-to-text";
const MODEL = "Xenova/vit-gpt2-image-captioning";

let latestReqId = 0;

const sendToApp = (message: WorkerResponse) => {
  self.postMessage(message)
}

const createCaptioner = () => pipeline(TASK, MODEL, {
  progress_callback: (info) => {
    if (info.status === "progress_total") {
      return sendToApp({ type: "progress", progress: info.progress })
    }
    if (info.status === "ready") {
      return sendToApp({ type: "ready" })
    }
  }
});

type Captioner = Awaited<ReturnType<typeof createCaptioner>>;

let captionerPromise: ReturnType<typeof createCaptioner> | undefined;

const getCaptioner = async (): Promise<Captioner> => {
  captionerPromise ??= createCaptioner()
  try {
    return await captionerPromise;
  } catch (err: unknown) {
    captionerPromise = undefined;
    throw err;
  }
}

let activeStopper: InterruptableStoppingCriteria | undefined;

self.addEventListener("message", async (e: MessageEvent<WorkerRequest>) => {
  const { data } = e;

  try {
    activeStopper?.interrupt()

    const stopper = new InterruptableStoppingCriteria();
    activeStopper = stopper;

    latestReqId = data.requestId
    const captioner = await getCaptioner()
    const [caption] = await captioner(data.image, {
      stopping_criteria: stopper
    });

    if (activeStopper !== stopper || data.requestId < latestReqId) {
      return;
    }

    sendToApp({
      type: "caption",
      text: caption.generated_text,
      requestId: data.requestId
    })
  } catch (err: unknown) {
    sendToApp({
      type: "error",
      message: err instanceof Error ? err.message : String(err),
      requestId: data.requestId
    })
  }
}
)

