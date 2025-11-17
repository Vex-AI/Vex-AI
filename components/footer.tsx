// components/Footer.tsx
"use client"

import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"

const Footer = () => {
  const { t } = useTranslation()

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="
        fixed bottom-0 w-full
        bg-neutral-900 border-t border-white/10
        px-4 py-4
      "
    >
      <div className="flex items-center justify-center gap-3">
        <div className="h-10 w-10 rounded-full overflow-hidden">
          <img
            src="/cookieukw.jpg"
            alt="name"
            className="object-cover h-full w-full"
          />
        </div>

        <p className="text-sm text-white">
          {t("developedBy")}&nbsp;
          <a
            href="html_url"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            CookieUkw
          </a>
        </p>
      </div>

      <div className="flex items-center justify-center mt-2">
        <p className="text-xs text-white/70">
          © {new Date().getFullYear()} {t("allRights")}
        </p>
      </div>
    </motion.footer>
  )
}

export default Footer
