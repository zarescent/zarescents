import type { Metadata } from "next";
import { AccountProfile } from "@/components/AccountProfile";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Track your Zaré Scents orders and view order history on this device.",
  robots: { index: false },
};

export default function AccountPage() {
  return (
    <div className="pt-32 md:pt-36 section-pad !pt-32 md:!pt-36">
      <div className="container-zare px-5 md:px-8 max-w-3xl">
        <p className="text-[0.7rem] uppercase tracking-[0.28em] text-gold text-center">
          Your account
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl md:text-5xl text-cream text-center">
          My Profile
        </h1>
        <p className="mt-4 text-center text-sm text-muted max-w-lg mx-auto">
          Guest checkout, no password needed. Orders you place or track on this
          browser are saved here for quick status updates.
        </p>
        <div className="mt-12">
          <AccountProfile />
        </div>
      </div>
    </div>
  );
}
