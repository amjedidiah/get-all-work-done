import { PropsWithChildren } from "react";

export default function Main({ children }: PropsWithChildren) {
  return <div className="min-h-full grid grid-rows-[auto,1fr]">{children}</div>;
}
