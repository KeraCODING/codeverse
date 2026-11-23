import { ALGO_TOPICS } from "./topics-algo";
import { BASIC_TOPICS } from "./topics-basics";
import { SYSTEM_TOPICS } from "./topics-systems";
import type { VTopic } from "./types";

/** All Visual Learning topics, in the order they are listed. */
export const VISUAL_TOPICS: VTopic[] = [...BASIC_TOPICS, ...SYSTEM_TOPICS, ...ALGO_TOPICS];

export const findTopic = (id: string | undefined) => VISUAL_TOPICS.find((t) => t.id === id);
