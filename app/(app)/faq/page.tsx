'use client';

import { HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const faqs = [
  {
    q: "Что такое IT-Box?",
    a: "IT-Box — это централизованный сейф для хранения информации о ваших серверах, проектах, микросервисах и аутентификационных данных."
  },
  {
    q: "Где хранятся мои пароли?",
    a: "Все данные безопасно хранятся в Cloud Firestore. При этом пароли, приватные ключи и прочие критические секреты шифруются на сервере с использованием алгоритма AES-256-GCM."
  },
  {
    q: "Могу ли я поделиться доступом с подрядчиком?",
    a: "Да, вы можете сгенерировать временную ссылку в разделе 'Доступы' или 'Ссылки', чтобы безопасно передать нужные доступы внешним подрядчикам. Ссылку можно отозвать в любой момент."
  },
  {
    q: "Как восстановить доступ, если я забыл мастер-пароль?",
    a: "Вход осуществляется через ваш Google Аккаунт. Отдельного мастер-пароля для системы не требуется — если вы имеете доступ к вашему Google Аккаунту, вы сможете войти в IT-Box."
  },
  {
    q: "Безопасно ли использовать систему?",
    a: "Да, база данных защищена настроенными правилами безопасности (Firestore Security Rules), а дешифровка данных происходит исключительно при явном запросе."
  }
];

export default function FAQPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1 md:mb-2 flex items-center gap-2">
          <HelpCircle className="w-8 h-8 text-[var(--neu-accent)]" />
          FAQ
        </h1>
        <p className="text-sm md:text-base text-[var(--neu-text-muted)]">Часто задаваемые вопросы о платформе IT-Box</p>
      </div>

      <div className="grid gap-6">
        {faqs.map((faq, index) => (
          <div key={index} className="neu-panel p-6 flex flex-col">
            <h3 className="text-lg font-bold mb-3">{faq.q}</h3>
            <p className="text-[var(--neu-text-muted)] leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
