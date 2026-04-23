'use client';

import { HelpCircle } from "lucide-react";
import { motion } from "motion/react";

const faqs = [
  {
    q: "Что такое IT-Box?",
    a: "IT-Box — это централизованный сейф для хранения информации о ваших серверах, проектах, микросервисах и аутентификационных данных."
  },
  {
    q: "Где хранятся мои пароли?",
    a: "Все данные безопасно хранятся в защищенной базе. При этом пароли, приватные ключи и прочие критические секреты шифруются на сервере с использованием алгоритма AES-256-GCM."
  },
  {
    q: "Могу ли я поделиться доступом с подрядчиком?",
    a: "Да, вы можете сгенерировать временную ссылку с определенным таймером и счетчиком открытий, чтобы безопасно передать нужные доступы внешним подрядчикам. Пароли в ссылку не попадают."
  },
  {
    q: "Как восстановить доступ?",
    a: "Авторизация происходит через ваш привязанный Google Аккаунт. Отдельного мастер-пароля, который можно было бы потерять или забыть, в системе не требуется."
  },
  {
    q: "Безопасно ли использовать систему?",
    a: "Да, мы используем строгие правила безопасности Firebase Security Rules (нулевое доверие). Пароли скрыты по умолчанию, и их дешифровка происходит исключительно при явном запросе через защищенный API."
  }
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-10">
      {/* Header section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="neu-panel p-8 md:p-10 rounded-3xl"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="neu-panel-inset p-3 rounded-full text-blue-400 shrink-0">
             <HelpCircle className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-wide text-[var(--neu-text)]">FAQ</h1>
            <p className="text-[var(--neu-text-muted)] text-sm uppercase tracking-widest mt-1">Ответы на вопросы</p>
          </div>
        </div>
        <p className="text-[var(--neu-text-muted)] leading-relaxed text-base md:text-lg">
          Здесь собраны ответы на самые частые вопросы о возможностях, безопасности и устройстве платформы IT-Box.
        </p>
      </motion.div>

      {/* FAQ Items */}
      <div className="space-y-6">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--neu-text)] px-2">Вопросы и ответы</h2>
        <div className="grid gap-6">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="neu-panel p-6 md:p-8 rounded-3xl flex flex-col items-start"
            >
              <h3 className="text-lg font-bold text-[var(--neu-text)] mb-3">{faq.q}</h3>
              <p className="text-[var(--neu-text-muted)] leading-relaxed text-sm md:text-base">
                {faq.a}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
