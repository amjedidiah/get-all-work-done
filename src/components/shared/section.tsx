import { PropsWithChildren } from "react";

export default function Section({ children }: PropsWithChildren) {
  return <section className="py-8">{children}</section>;
}
