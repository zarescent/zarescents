import Link from "next/link";
import type { Metadata } from "next";
import { OrderSuccessSave } from "@/components/OrderSuccessSave";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false },
};

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; email?: string }>;
}) {
  const { order, email } = await searchParams;

  return (
    <div className="pt-32 md:pt-36 section-pad text-center px-5">
      <p className="text-[0.7rem] uppercase tracking-[0.3em] text-gold mb-3">
        Thank You
      </p>
      <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-cream">
        Order Confirmed
      </h1>
      {order && (
        <p className="mt-4 text-muted">
          Order number:{" "}
          <span className="text-gold-bright tracking-wider">{order}</span>
        </p>
      )}
      <p className="mt-4 max-w-md mx-auto text-muted leading-relaxed">
        We&apos;ll confirm your order shortly via WhatsApp or phone. Pay with
        cash when your package arrives. Use the track button to check status
        anytime.
      </p>
      <OrderSuccessSave orderNumber={order} email={email} />
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="btn-gold">
          Continue Shopping
        </Link>
        <Link href="/" className="btn-outline">
          Back Home
        </Link>
      </div>
    </div>
  );
}
