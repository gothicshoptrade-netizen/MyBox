'use client';

import { Shield, FolderKanban, Server, Network, KeyRound, Share2, Search, Zap, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';

export default function AboutPage() {
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
             <Shield className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-wide text-[var(--neu-text)]">IT-Box</h1>
            <p className="text-[var(--neu-text-muted)] text-sm uppercase tracking-widest mt-1">О продукте</p>
          </div>
        </div>
        <p className="text-[var(--neu-text-muted)] leading-relaxed text-base md:text-lg">
          IT-Box — централизованный сейф для IT-инфраструктуры: серверы, проекты, сервисы, доступы и безопасный шеринг конфигураций.
        </p>
      </motion.div>

      {/* Intro section */}
      <div className="space-y-6">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--neu-text)] px-2">Что такое IT-Box?</h2>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="neu-panel p-8 rounded-3xl"
        >
          <p className="text-[var(--neu-text-muted)] leading-relaxed">
            IT-Box — это веб-приложение для системных администраторов, DevOps-инженеров и веб-мастеров. 
            Оно позволяет держать всю инфраструктуру под рукой: серверы, проекты, сервисы и учётные данные — в одном защищённом месте. 
            Никаких таблиц Excel, никаких паролей в мессенджерах.
          </p>
        </motion.div>
      </div>

      {/* Main Modules */}
      <div className="space-y-6">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--neu-text)] px-2">Основные модули</h2>
        <div className="grid gap-6">
          <ModuleCard 
            icon={FolderKanban}
            title="Проекты"
            description="Управляйте проектами: статус (активен / неактивен / архив), URL сайта, технологический стек. К каждому проекту привязываются серверы, сервисы и доступы."
            delay={0.15}
          />
          <ModuleCard 
            icon={Server}
            title="Серверы"
            description="Инвентаризация серверов: IP-адрес, провайдер, операционная система, заметки. Мгновенная привязка к проекту."
            delay={0.2}
          />
          <ModuleCard 
            icon={Network}
            title="Сервисы"
            description="Список приложений и сервисов на серверах: URL, порт, описание. Удобный обзор всей публичной части инфраструктуры."
            delay={0.25}
          />
          <ModuleCard 
            icon={KeyRound}
            title="Доступы"
            description="Зашифрованное хранилище учётных данных (SSH, FTP, БД, веб-панели, API-ключи). Пароли зашифрованы AES-256-GCM и никогда не передаются в открытом виде."
            delay={0.3}
          />
          <ModuleCard 
            icon={Share2}
            title="Безопасный шеринг"
            description="Генерация временных ссылок для передачи конфигурации коллегам. Пароли никогда не попадают в ссылку. Гибкий срок действия: 1 час, 24 часа, 7 дней или бессрочно."
            delay={0.35}
          />
        </div>
      </div>

      {/* Key features */}
      <div className="space-y-6">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--neu-text)] px-2">Ключевые возможности</h2>
        <div className="grid gap-6">
          <ModuleCard 
            icon={Shield}
            title="Шифрование AES-256-GCM"
            description="Все пароли хранятся в зашифрованном виде. Ключ шифрования — в переменной окружения, не в БД."
            delay={0.4}
            iconColor="text-blue-400"
          />
          <ModuleCard 
            icon={Share2}
            title="Временные ссылки"
            description="Делитесь конфигурацией через криптографические ссылки с настраиваемым сроком действия и счётчиком просмотров."
            delay={0.45}
            iconColor="text-blue-400"
          />
          <ModuleCard 
            icon={Smartphone}
            title="PWA-приложение"
            description="Устанавливается как нативное приложение на телефон или десктоп. Работает offline-режим для кешированных данных."
            delay={0.5}
            iconColor="text-blue-400"
          />
          <ModuleCard 
            icon={Search}
            title="Глобальный поиск"
            description="Мгновенный поиск по всем сущностям: серверам, проектам, сервисам и учётным данным."
            delay={0.55}
            iconColor="text-blue-400"
          />
          <ModuleCard 
            icon={Zap}
            title="Быстрый доступ"
            description="Копирование IP, URL и паролей в один клик. Логи просмотров для безопасного аудита."
            delay={0.6}
            iconColor="text-blue-400"
          />
          <ModuleCard 
            icon={Shield}
            title="Безопасность"
            description="Пароли скрыты по умолчанию. Отдельный endpoint для раскрытия. Полный контроль доступа."
            delay={0.65}
            iconColor="text-blue-400"
          />
        </div>
      </div>

      {/* Target Audience */}
      <div className="space-y-6">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--neu-text)] px-2">Для кого?</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <AudienceCard 
            title="Системный администратор"
            description="Ведёт полный реестр серверов компании, хранит SSH/RDP-доступы в зашифрованном виде, делится конфигурацией с коллегами через временные ссылки."
            delay={0.7}
          />
          <AudienceCard 
            title="DevOps-инженер"
            description="Структурирует инфраструктуру по проектам, привязывает сервисы к серверам, отслеживает стек технологий каждого проекта."
            delay={0.75}
          />
          <AudienceCard 
            title="Веб-мастер / фрилансер"
            description="Управляет хостингами и сайтами клиентов, хранит FTP/cPanel-доступы, быстро находит нужный сервер по проекту."
            delay={0.8}
          />
          <AudienceCard 
            title="Небольшая IT-команда"
            description="Централизованное хранилище знаний об инфраструктуре вместо разрозненных таблиц и мессенджеров."
            delay={0.85}
          />
        </div>
      </div>

    </div>
  );
}

function ModuleCard({ icon: Icon, title, description, delay, iconColor = "text-[var(--neu-accent)]" }: { icon: any, title: string, description: string, delay: number, iconColor?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="neu-panel p-6 md:p-8 rounded-3xl flex flex-col md:flex-row gap-6 items-start"
    >
      <div className={`neu-panel-inset p-4 rounded-2xl shrink-0 ${iconColor}`}>
         <Icon className="h-6 w-6 md:h-7 md:w-7" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-[var(--neu-text)] mb-3">{title}</h3>
        <p className="text-[var(--neu-text-muted)] leading-relaxed text-sm md:text-base">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

function AudienceCard({ title, description, delay }: { title: string, description: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="neu-panel p-6 md:p-8 rounded-3xl h-full flex flex-col"
    >
      <h3 className="text-lg font-bold text-[var(--neu-text)] mb-3">{title}</h3>
      <p className="text-[var(--neu-text-muted)] leading-relaxed text-sm md:text-base flex-1">
        {description}
      </p>
    </motion.div>
  );
}
