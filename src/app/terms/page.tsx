import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `Terms and conditions for shopping at ${SITE.name}.`,
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms & Conditions"
      updated="4 October 2026"
    >
      <p className="text-[1.05rem] text-cream/85 leading-relaxed">
        By visiting and ordering from {SITE.name}, you agree to our terms.
      </p>

      <LegalSection title="1. Products">
        <p>
          All our fragrances are premium impressions inspired by designer
          scents. We are not affiliated with the designer brands.
        </p>
      </LegalSection>

      <LegalSection title="2. Orders & Pricing">
        <p>
          All prices are in Pakistani Rupees (PKR). We reserve the right to
          cancel any order if there is a pricing error or if the item is out of
          stock.
        </p>
      </LegalSection>

      <LegalSection title="3. Shipping">
        <p>
          We deliver all across Pakistan within{" "}
          <span className="text-cream/90">2–4 working days</span>. Delivery
          timelines may vary due to courier delays.
        </p>
      </LegalSection>

      <LegalSection title="4. Payments">
        <p>
          We accept Cash on Delivery (COD), Bank Transfer, Easypaisa and
          JazzCash.
        </p>
      </LegalSection>

      <LegalSection title="5. Intellectual Property">
        <p>
          All content on this site including our logo ZARÉ, images, and
          descriptions is our property and cannot be copied without permission.
        </p>
      </LegalSection>

      <LegalSection title="6. Liability">
        <p>
          Please check fragrance notes before buying. {SITE.name} is not
          responsible for any allergic reactions.
        </p>
      </LegalSection>

      <LegalSection title="7. Governing Law">
        <p>These terms are governed by the laws of Pakistan.</p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          If you have any questions about our terms, contact us at{" "}
          <a href={SITE.mailto} className="text-gold hover:text-gold-bright">
            {SITE.email}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
