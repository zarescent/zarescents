import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Refund & Exchange Policy",
  description: `Returns, exchanges, and refunds for ${SITE.name} orders.`,
};

export default function RefundPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Refund & Exchange Policy"
      updated="4 October 2026"
    >
      <p className="text-[1.05rem] text-cream/85 leading-relaxed">
        We take great care in packing every order from {SITE.name}.
      </p>

      <LegalSection title="1. Hygiene Policy">
        <p>
          Due to the nature of perfumes, we cannot accept returns or exchanges
          if the perfume seal has been broken, sprayed, or used.
        </p>
      </LegalSection>

      <LegalSection title="2. Damaged / Wrong Item">
        <p>
          If you receive a damaged, leaked, or incorrect product, you must
          contact us within{" "}
          <span className="text-cream/90">48 hours of delivery</span>. Please
          send us an unboxing video as proof at{" "}
          <a href={SITE.mailto} className="text-gold hover:text-gold-bright">
            {SITE.email}
          </a>
          . After verification, we will send a free replacement or issue a full
          refund.
        </p>
      </LegalSection>

      <LegalSection title="3. Eligibility">
        <p>
          For a return to be eligible, the item must be unused, unopened, and in
          its original box and packaging.
        </p>
      </LegalSection>

      <LegalSection title="4. Refund Process">
        <p>
          Once your return is approved, the refund will be processed within{" "}
          <span className="text-cream/90">5–7 working days</span> to your
          original payment method.
        </p>
      </LegalSection>

      <LegalSection title="5. Sale Items">
        <p>
          Products purchased during a sale, promotion, or with a discount code
          are not eligible for return or exchange.
        </p>
      </LegalSection>

      <LegalSection title="Support">
        <p>
          For support, email us:{" "}
          <a href={SITE.mailto} className="text-gold hover:text-gold-bright">
            {SITE.email}
          </a>
        </p>
      </LegalSection>
    </LegalPage>
  );
}
