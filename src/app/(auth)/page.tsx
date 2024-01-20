"use client";
import Article from "@/components/shared/article";
import Section from "@/components/shared/section";
import Link from "next/link";

export default function Home() {
  return (
    <Section>
      <Article>
        <h1 className="text-4xl">Welcome!</h1>
      </Article>

      <Article>
        <h2 className="text-md mb-4 mt-8 font-bold uppercase">Contractors</h2>

        <div className="grid grid-cols-5">
          <div className="shadow py-2 px-3 grid gap-2">
            <h4 className="text-lg">Abel</h4>
            <p>
              Price: <span className="font-semibold">$100.00</span>
            </p>

            <Link
              href={`/pay?amount=10000&application=10&destination=1OZhkwIGWz9N1AyF`}
            >
              <button className="px-2 py-1 bg-slate-200 hover:bg-slate-300 border-slate-300 border">
                Hire Abel
              </button>
            </Link>
          </div>
        </div>
      </Article>
    </Section>
  );
}
