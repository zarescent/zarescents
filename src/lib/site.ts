export const SITE = {
  name: "Zaré Scents",
  email: "zarescent@gmail.com",
  phoneDisplay: "0303 3331301",
  phoneRaw: "03033331301",
  /** WhatsApp / tel international format */
  phoneIntl: "923033331301",
  instagram: "https://www.instagram.com/zare_scents",
  tiktok: "https://www.tiktok.com/@zare.scents",
  maker: {
    name: "SyedTalhaHashmi",
    url: "#",
  },
  get mailto() {
    return `mailto:${this.email}`;
  },
  get tel() {
    return `tel:${this.phoneRaw}`;
  },
  get whatsapp() {
    return `https://wa.me/${this.phoneIntl}`;
  },
} as const;
