import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE.name} collects, uses, and protects your personal information.`,
};

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Legal" title="Privacy Policy" updated="4 October 2026">
      <p className="text-[1.05rem] text-cream/85 leading-relaxed">
        At {SITE.name}, we are committed to protecting your privacy. This policy
        explains how we collect, use, and protect your personal information.
      </p>

      <LegalSection title="Information We Collect">
        <p>
          When you place an order on our website, we collect your name, phone
          number, email address, and shipping address so we can fulfill Cash on
          Delivery orders. We may also collect basic technical information such
          as browser type and cookies to keep your cart working and improve the
          site.
        </p>
      </LegalSection>

      <LegalSection title="How We Use Your Information">
        <p>
          We use your information to process and deliver your orders, contact
          you about order status, provide customer support, and improve our
          website and products.
        </p>
      </LegalSection>

      <LegalSection title="Data Security">
        <p>
          We take reasonable steps to protect your information. We do not sell,
          trade, or rent your personal information to third parties for
          marketing.
        </p>
      </LegalSection>

      <LegalSection title="Third-Party Sharing">
        <p>
          We only share delivery details (name, phone, address) with trusted
          courier partners such as Leopards, TCS, or M&amp;P so your parcel can
          be delivered. Payment is Cash on Delivery. We do not process card
          payments on this website.
        </p>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>
          We use cookies / local storage to keep your shopping cart saved and to
          understand how you use our website.
        </p>
      </LegalSection>

      <LegalSection title="Your Rights">
        <p>
          You can request to access, edit, or delete your personal data at any
          time by contacting us.
        </p>
      </LegalSection>

      <LegalSection title="Contact Us">
        <p>
          For any privacy-related questions, please email us at{" "}
          <a href={SITE.mailto} className="text-gold hover:text-gold-bright">
            {SITE.email}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
