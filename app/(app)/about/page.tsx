'use client';

import { Shield, FolderKanban, Server, Network, KeyRound, Share2, Search, Zap, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

export default function AboutPage() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';

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
            <p className="text-[var(--neu-text-muted)] text-sm uppercase tracking-widest mt-1">{t('about')}</p>
          </div>
        </div>
        <p className="text-[var(--neu-text-muted)] leading-relaxed text-base md:text-lg">
          {isEn 
            ? "IT-Box is a centralized vault for IT infrastructure: servers, projects, services, access, and secure configuration sharing." 
            : "IT-Box — централизованный сейф для IT-инфраструктуры: серверы, проекты, сервисы, доступы и безопасный шеринг конфигураций."}
        </p>
      </motion.div>

      {/* Intro section */}
      <div className="space-y-6">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--neu-text)] px-2">{isEn ? "What is IT-Box?" : "Что такое IT-Box?"}</h2>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="neu-panel p-8 rounded-3xl"
        >
          <p className="text-[var(--neu-text-muted)] leading-relaxed">
            {isEn 
              ? "IT-Box is a web application for system administrators, DevOps engineers, and webmasters. It allows you to keep all your infrastructure at your fingertips: servers, projects, services, and credentials — in one secure place. No Excel tables, no passwords in messengers."
              : "IT-Box — это веб-приложение для системных администраторов, DevOps-инженеров и веб-мастеров. Оно позволяет держать всю инфраструктуру под рукой: серверы, проекты, сервисы и учётные данные — в одном защищённом месте. Никаких таблиц Excel, никаких паролей в мессенджерах."}
          </p>
        </motion.div>
      </div>

      {/* Main Modules */}
      <div className="space-y-6">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--neu-text)] px-2">{isEn ? "Core Modules" : "Основные модули"}</h2>
        <div className="grid gap-6">
          <ModuleCard 
            icon={FolderKanban}
            title={isEn ? "Projects" : "Проекты"}
            description={isEn 
              ? "Manage projects: status (active / inactive / archive), site URL, technology stack. Servers, services, and credentials are linked to each project."
              : "Управляйте проектами: статус (активен / неактивен / архив), URL сайта, технологический стек. К каждому проекту привязываются серверы, сервисы и доступы."}
            delay={0.15}
          />
          <ModuleCard 
            icon={Server}
            title={isEn ? "Servers" : "Серверы"}
            description={isEn 
              ? "Server inventory: IP address, provider, operating system, notes. Instant link to project."
              : "Инвентаризация серверов: IP-адрес, провайдер, операционная система, заметки. Мгновенная привязка к проекту."}
            delay={0.2}
          />
          <ModuleCard 
            icon={Network}
            title={isEn ? "Services" : "Сервисы"}
            description={isEn 
              ? "List of applications and services on servers: URL, port, description. Convenient overview of all public infrastructure parts."
              : "Список приложений и сервисов на серверах: URL, порт, описание. Удобный обзор всей публичной части инфраструктуры."}
            delay={0.25}
          />
          <ModuleCard 
            icon={KeyRound}
            title={isEn ? "Credentials" : "Доступы"}
            description={isEn 
              ? "Encrypted storage for credentials (SSH, FTP, DB, web panels, API keys). Passwords are encrypted with AES-256-GCM and never transmitted in the clear."
              : "Зашифрованное хранилище учётных данных (SSH, FTP, БД, веб-панели, API-ключи). Пароли зашифрованы AES-256-GCM и никогда не передаются в открытом виде."}
            delay={0.3}
          />
          <ModuleCard 
            icon={Share2}
            title={isEn ? "Secure Sharing" : "Безопасный шеринг"}
            description={isEn 
              ? "Generate temporary links to pass configuration to colleagues. Passwords never get into the link. Flexible expiration: 1 hour, 24 hours, 7 days, or unlimited."
              : "Генерация временных ссылок для передачи конфигурации коллегам. Пароли никогда не попадают в ссылку. Гибкий срок действия: 1 час, 24 часа, 7 дней или бессрочно."}
            delay={0.35}
          />
        </div>
      </div>

      {/* Key features */}
      <div className="space-y-6">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--neu-text)] px-2">{isEn ? "Key Features" : "Ключевые возможности"}</h2>
        <div className="grid gap-6">
          <ModuleCard 
            icon={Shield}
            title={isEn ? "AES-256-GCM Encryption" : "Шифрование AES-256-GCM"}
            description={isEn 
              ? "All passwords are stored encrypted. The encryption key is in an environment variable, not the DB."
              : "Все пароли хранятся в зашифрованном виде. Ключ шифрования — в переменной окружения, не в БД."}
            delay={0.4}
            iconColor="text-blue-400"
          />
          <ModuleCard 
            icon={Share2}
            title={isEn ? "Temporary Links" : "Временные ссылки"}
            description={isEn 
              ? "Share configuration via cryptographic links with configurable lifetime and view counter."
              : "Делитесь конфигурацией через криптографические ссылки с настраиваемым сроком действия и счётчиком просмотров."}
            delay={0.45}
            iconColor="text-blue-400"
          />
          <ModuleCard 
            icon={Smartphone}
            title={isEn ? "PWA App" : "PWA-приложение"}
            description={isEn 
              ? "Installs as a native app on phone or desktop. Offline mode works for cached data."
              : "Устанавливается как нативное приложение на телефон или десктоп. Работает offline-режим для кешированных данных."}
            delay={0.5}
            iconColor="text-blue-400"
          />
          <ModuleCard 
            icon={Search}
            title={isEn ? "Global Search" : "Глобальный поиск"}
            description={isEn 
              ? "Instant search across all entities: servers, projects, services, and credentials."
              : "Мгновенный поиск по всем сущностям: серверам, проектам, сервисам и учётным данным."}
            delay={0.55}
            iconColor="text-blue-400"
          />
          <ModuleCard 
            icon={Zap}
            title={isEn ? "Quick Access" : "Быстрый доступ"}
            description={isEn 
              ? "One-click copy for IP, URL, and passwords. View logs for secure audit."
              : "Копирование IP, URL и паролей в один клик. Логи просмотров для безопасного аудита."}
            delay={0.6}
            iconColor="text-blue-400"
          />
          <ModuleCard 
            icon={Shield}
            title={isEn ? "Security" : "Безопасность"}
            description={isEn 
              ? "Passwords hidden by default. Separate endpoint for revealing. Full access control."
              : "Пароли скрыты по умолчанию. Отдельный endpoint для раскрытия. Полный контроль доступа."}
            delay={0.65}
            iconColor="text-blue-400"
          />
        </div>
      </div>

      {/* Target Audience */}
      <div className="space-y-6">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--neu-text)] px-2">{isEn ? "Who is it for?" : "Для кого?"}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <AudienceCard 
            title={isEn ? "System Administrator" : "Системный администратор"}
            description={isEn 
              ? "Maintains a full server registry, stores encrypted SSH/RDP access, shares configuration via temporary links."
              : "Ведёт полный реестр серверов компании, хранит SSH/RDP-доступы в зашифрованном виде, делится конфигурацией с коллегами через временные ссылки."}
            delay={0.7}
          />
          <AudienceCard 
            title={isEn ? "DevOps Engineer" : "DevOps-инженер"}
            description={isEn 
              ? "Structures infrastructure by projects, links services to servers, tracks each project's technology stack."
              : "Структурирует инфраструктуру по проектам, привязывает сервисы к серверам, отслеживает стек технологий каждого проекта."}
            delay={0.75}
          />
          <AudienceCard 
            title={isEn ? "Webmaster / Freelancer" : "Веб-мастер / фрилансер"}
            description={isEn 
              ? "Manages client hostings and sites, stores FTP/cPanel credentials, quickly finds servers by project."
              : "Управляет хостингами и сайтами клиентов, хранит FTP/cPanel-доступы, быстро находит нужный сервер по проекту."}
            delay={0.8}
          />
          <AudienceCard 
            title={isEn ? "Small IT Team" : "Небольшая IT-команда"}
            description={isEn 
              ? "Centralized infrastructure knowledge hub instead of fragmented tables and messengers."
              : "Централизованное хранилище знаний об инфраструктуре вместо разрозненных таблиц и мессенджеров."}
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

