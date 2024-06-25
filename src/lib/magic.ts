import { Magic } from "magic-sdk";

export const magicPublishable =
  typeof window !== "undefined"
    ? new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_API_KEY as string)
    : null;
