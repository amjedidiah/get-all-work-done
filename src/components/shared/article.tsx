import { PropsWithChildren } from "react";

export default function Article({ children }: PropsWithChildren) {
  return (
    <article className="container mx-auto px-4 lg:px-8">{children}</article>
  );
}
