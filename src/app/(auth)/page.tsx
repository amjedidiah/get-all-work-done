"use client";
import Article from "@/components/shared/article";
import Section from "@/components/shared/section";
import { gigs } from "@/constants";
import { formatAmount } from "@/utils";
import Link from "next/link";
import Script from "next/script";

export default function Home() {
  return (
    <Section>
      <Article>
        <h1 className="text-4xl">Welcome!</h1>
      </Article>

      <Article>
        <h2 className="text-md mb-4 mt-8 font-bold uppercase">Contractors</h2>

        <div className="grid grid-cols-5 gap-5">
          {gigs.map((gig) => (
            <div key={gig.id} className="shadow py-2 px-3 grid gap-2 h-fit">
              <h4 className="text-lg">{gig.title}</h4>
              <p>
                Price:{" "}
                <span className="font-semibold">{formatAmount(gig.price)}</span>
              </p>

              <Link href={`/pay?gig=${gig.id}`}>
                <button className="px-2 py-1 bg-slate-200 hover:bg-slate-300 border-slate-300 border">
                  Pay for {gig.title}
                </button>
              </Link>
            </div>
          ))}

          <stripe-buy-button
            buy-button-id="buy_btn_1ObGJKI8t6XbCC5Y3KH3hura"
            publishable-key="pk_test_C1Ucx2BWenzZZ6BoeG5OlKMu00DJWe7WZ5"
          ></stripe-buy-button>
          <stripe-buy-button
            buy-button-id="buy_btn_1ObQ9RI8t6XbCC5YIdufZHGW"
            publishable-key="pk_test_C1Ucx2BWenzZZ6BoeG5OlKMu00DJWe7WZ5"
          ></stripe-buy-button>
        </div>
      </Article>
      <Script async src="https://js.stripe.com/v3/buy-button.js" />
    </Section>
  );
}
