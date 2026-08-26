/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BOTPRESS_BOT_ID?: string;
  readonly VITE_FORMSPREE_FORM_ID?: string;
  readonly VITE_EMAILJS_PUBLIC_KEY?: string;
  readonly VITE_EMAILJS_SERVICE_ID?: string;
  readonly VITE_EMAILJS_TEMPLATE_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  solicitarAccesoAdmin?: () => void;
  closeModalAdmin?: () => void;
}

