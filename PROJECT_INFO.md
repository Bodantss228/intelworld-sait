# IntelWorld - Информация о проекте

## Общая информация
**Проект:** Профессиональный сайт для Minecraft сервера IntelWorld  
**Сезон:** 5 - "What If..." (Юбилейный)  
**Домен:** minecraftic.ru (через редиректы на Vercel)  
**Vercel URL:** https://sait-intel.vercel.app  
**Хостинг:** Vercel (serverless)  
**Minecraft сервер:** play.intelworld.ru (Fabric 1.21.8)

## Технологии
- **Frontend:** Next.js 14 (App Router), React, TypeScript
- **Styling:** Tailwind CSS + Custom CSS
- **Animations:** Framer Motion
- **Backend:** Next.js API Routes (serverless)
- **Деплой:** Vercel
- **Медиа хранилище:** GitHub (https://github.com/Bodantss228/archive-season-intel)

## Структура проекта

### Основные страницы
1. **Главная (/)** - Hero с видео фоном, статистика сервера в реальном времени
2. **Экосистема (/ecosystem)** - Описание банка, маркетплейсов, ИИ Клео
3. **Архив (/timeline)** - История всех 5 сезонов с кнопками "Воспоминания"
4. **Галерея (/gallery/[season])** - Фото и видео из сезонов (загружаются из GitHub)
5. **Статистика (/stats)** - Реальные данные: игроки онлайн, TPS, скины
6. **Скачать (/downloads)** - Инструкции по установке модпака
7. **Карта** - Прямая ссылка на Dynmap (http://white.fnode.me:8316)

### API Routes
- `/api/server/update` - Принимает данные от Fabric мода (POST), отдает live данные (GET)
- `/api/server/event/player` - События игроков (join/leave)
- `/api/stats` - Статистика сервера
- `/api/players` - Список игроков онлайн

## Fabric Mod - IntelWorld Bridge
**Репозиторий:** C:\Users\grinb\mod intelnews

### Что делает мод:
- Отправляет данные на сайт каждые 30 секунд
- Данные: игроки онлайн, TPS, память, версия
- Отправляет события: join/leave игроков

### Конфиг мода:
```json
{
  "enabled": true,
  "apiUrl": "https://sait-intel.vercel.app/api/server",
  "updateInterval": 30,
  "serverName": "IntelWorld",
  "apiKey": ""
}
```

### Данные которые мод отправляет:
```json
{
  "timestamp": 1234567890,
  "version": "1.21.8",
  "motd": "IntelWorld",
  "online": 5,
  "maxPlayers": 100,
  "players": [
    {"name": "Player1", "uuid": "...", "ping": 50}
  ],
  "tps": 20.0,
  "memory": {
    "used": 2048,
    "max": 4096,
    "free": 2048
  }
}
```

## Dynmap
**URL:** http://white.fnode.me:8316  
**Интеграция:** Прямая ссылка в меню (открывается в новой вкладке)  
**Причина:** HTTP/HTTPS mixed content - нельзя встроить в iframe

## Галерея (Архив сезонов)

### GitHub репозиторий для медиа
**Repo:** https://github.com/Bodantss228/archive-season-intel  
**Структура:**
```
seasons/
  season3/  - 22 файла (9 фото + 13 видео)
  season4/  - фото и видео
```

### Поддерживаемые форматы:
- **Фото:** jpg, jpeg, png, gif
- **Видео:** mp4, mov, avi, webm
- **Лимит:** 100MB на файл (GitHub ограничение)

### Как добавить новый сезон:
1. Создать папку `seasons/seasonX` в репозитории
2. Загрузить фото/видео
3. В `app/timeline/page.tsx` поставить `hasGallery: true` для нужного сезона
4. Задеплоить

### Команды для загрузки медиа:
```bash
cd "C:\Users\grinb\Downloads\тест"
git add seasons/seasonX
git commit -m "Add Season X media"
git push origin main
```

## In-Memory хранилище (Vercel)
**Проблема:** Vercel имеет read-only filesystem  
**Решение:** Используем in-memory хранилище в `lib/serverData.ts`

```typescript
let liveData: any = {
  timestamp: 0,
  online: 0,
  maxPlayers: 100,
  version: '1.21.8',
  tps: 20.0,
  players: []
};
```

**Важно:** Данные сбрасываются при каждом деплое или перезапуске serverless функции.

## Логотип
**Файл:** `public/logo.jpg`  
**Расположение:** Header (слева вверху)  
**Размер:** 120x40px (адаптивный)

## Домены и DNS

### Текущая настройка (через редиректы):
- `minecraftic.ru` → редирект на Vercel
- `www.minecraftic.ru` → редирект на Vercel

### Правильная настройка DNS (если захочешь исправить):
В Timeweb добавить:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## Что сделано

### ✅ Основной функционал
- [x] Профессиональный дизайн (черный, золотой, фиолетовый)
- [x] Видео фон на главной (с reverse loop эффектом)
- [x] Реальная статистика от Fabric мода
- [x] Список игроков онлайн со скинами (minotar.net + fallback)
- [x] Интеграция Dynmap
- [x] Галерея с фото и видео (GitHub)
- [x] Логотип в Header
- [x] Адаптивный дизайн (мобильные устройства)

### ✅ Fabric Mod
- [x] Отправка данных каждые 30 секунд
- [x] TPS, память, игроки, версия
- [x] События join/leave
- [x] Конфиг файл

### ✅ Галерея
- [x] Сезон 3 - 22 файла (фото + видео)
- [x] Сезон 4 - фото + видео
- [x] Поддержка видео (mp4, mov, avi, webm)
- [x] Lightbox с навигацией (стрелки, Escape)
- [x] Автозагрузка из GitHub

## Что можно добавить в будущем

### Идеи для развития:
- [ ] Добавить медиа для сезонов 1, 2, 5
- [ ] Раскрыть загадочные ивенты (сейчас "???")
- [ ] Добавить страницу Wiki с правилами/гайдами
- [ ] Интеграция с Telegram ботом (если есть)
- [ ] Статистика по игрокам (топ по времени игры, алмазам)
- [ ] История событий сервера (timeline)
- [ ] Настроить HTTPS для Dynmap (через Cloudflare Tunnel или Nginx)
- [ ] Добавить поиск по галерее
- [ ] Фильтры в галерее (только фото / только видео)

## Важные пути

### Локальные папки:
- **Сайт:** `C:\Users\grinb\Downloads\сайт intel`
- **Мод:** `C:\Users\grinb\mod intelnews`
- **Медиа для GitHub:** `C:\Users\grinb\Downloads\тест`
- **Скриншоты Minecraft:** `C:\Users\grinb\AppData\Roaming\.minecraft\versions\IntelLand\screenshots`

### Команды для деплоя:
```bash
# Деплой сайта
cd "C:\Users\grinb\Downloads\сайт intel"
vercel --prod

# Загрузка медиа
cd "C:\Users\grinb\Downloads\тест"
git add seasons/seasonX
git commit -m "Add media"
git push origin main
```

## Проблемы и решения

### Проблема: HTTP 500 на API routes
**Причина:** Попытка записи в файлы на Vercel (read-only filesystem)  
**Решение:** Использовать in-memory хранилище

### Проблема: Dynmap не работает в iframe
**Причина:** HTTP контент внутри HTTPS сайта (mixed content)  
**Решение:** Прямая ссылка в новой вкладке

### Проблема: Скины не загружаются
**Причина:** mc-heads.net не всегда работает  
**Решение:** Fallback система (minotar.net → crafatar.com → visage.surgeplay.com)

### Проблема: Большие видео не загружаются на GitHub
**Причина:** Лимит 100MB на файл  
**Решение:** Удалять/сжимать большие файлы или использовать YouTube

### Проблема: Домены работают только с VPN
**Причина:** DNS кеш провайдера  
**Решение:** Очистить DNS кеш (`ipconfig /flushdns`) или сменить DNS на 8.8.8.8

## Контакты и ссылки

- **GitHub медиа:** https://github.com/Bodantss228/archive-season-intel
- **Vercel проект:** sait-intel
- **Minecraft сервер:** play.intelworld.ru
- **Dynmap:** http://white.fnode.me:8316

## Заметки

- Все данные от мода хранятся in-memory и сбрасываются при деплое
- Галерея автоматически подгружает новые файлы из GitHub
- Видео в галерее открываются с контролами (play/pause, громкость)
- Сайт полностью на русском языке
- Дизайн: темный, серьезный, профессиональный (без эмодзи в коде)
- Временные аномалии (ивенты) скрыты как "???" для интриги

---

**Последнее обновление:** 2026-04-20  
**Статус:** Полностью функциональный, готов к использованию
