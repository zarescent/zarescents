import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { SITE } from "@/lib/site";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, formatPKR } from "@/lib/types";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: `Delivery coverage, timelines, and shipping charges for ${SITE.name}.`,
};

export default function ShippingPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Shipping Policy"
      updated="4 October 2026"
    >
      <p className="text-[1.05rem] text-cream/85 leading-relaxed">
        At {SITE.name}, we make sure your fragrance reaches you quickly and
        safely.
      </p>

      <LegalSection title="1. Delivery Coverage">
        <p>We currently deliver to all cities across Pakistan.</p>
      </LegalSection>

      <LegalSection title="2. Delivery Time">
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <span className="text-cream/90">Standard Delivery:</span> 2–4
            working days
          </li>
          <li>
            <span className="text-cream/90">
              For Karachi, Lahore, Islamabad:
            </span>{" "}
            Usually 1–2 working days
          </li>
          <li>
            <span className="text-cream/90">Remote areas</span> may take 3–5
            working days
          </li>
        </ul>
        <p>
          Delivery times are after order confirmation. Delays due to courier or
          weather are out of our control.
        </p>
      </LegalSection>

      <LegalSection title="3. Shipping Charges">
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Free delivery on orders above {formatPKR(FREE_SHIPPING_THRESHOLD)}
          </li>
          <li>
            Flat {formatPKR(SHIPPING_FEE)} delivery charges for orders below{" "}
            {formatPKR(FREE_SHIPPING_THRESHOLD)}
          </li>
          <li>Charges are shown at checkout.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Order Tracking">
        <p>
          Once your order is dispatched, you will receive a tracking number via
          WhatsApp / Email. You can track your parcel or contact us at{" "}
          <a href={SITE.mailto} className="text-gold hover:text-gold-bright">
            {SITE.email}
          </a>{" "}
          for updates.
        </p>
      </LegalSection>

      <LegalSection title="5. Damaged Parcel">
        <p>
          If your parcel arrives damaged, please don&apos;t accept it and
          contact us immediately with photos at{" "}
          <a href={SITE.mailto} className="text-gold hover:text-gold-bright">
            {SITE.email}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
