# IntelWorld - Полная информация о деплое и подключениях

## Дата последнего обновления: 2026-04-20

---

## 🔐 Учетные данные и подключения

### SFTP доступ к серверу Minecraft
```
Хост: white.ru.faithnode.net
Порт: 2022
Логин: kakat_stoia.a8971ece
Пароль: vVvgpuU3K+Ergpvru.^R60d7
Протокол: SFTP
SSH ключ: ~/.ssh/faithnode_key (ed25519)
```

**SSH публичный ключ (уже добавлен на сервер):**
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILwfgsO3XvDhjBYbR+NFTlXQr9gN1pbqcKVpZQgV58Ec faithnode_upload
```

**Команда для подключения:**
```bash
sftp -P 2022 -i ~/.ssh/faithnode_key kakat_stoia.a8971ece@white.ru.faithnode.net
```

**Структура сервера:**
```
/ (корень)
├── mods/                    # Папка с модами
├── config/                  # Конфиги модов
├── world/                   # Мир сервера
├── dynmap/                  # Данные Dynmap
├── intelworld-bank/         # Данные банка (JSON файлы)
├── logs/                    # Логи сервера
└── server.properties        # Настройки сервера
```

---

## 🌐 Сервер Minecraft

### Основная информация
```
IP: purple.fnode.me:25606 (для игроков: play.intelworld.ru)
Версия: Fabric 1.21.8
Открытые порты:
  - 25606 (Minecraft)
  - 8118 (Bank API)
  - 25522 (Dynmap)
  - 8317 (свободный)
```

### Dynmap
```
URL: http://purple.fnode.me:25522
Статус: Работает
Примечание: Порт был занят, поэтому Bank API перенесен на 8118
```

---

## 🏦 IntelWorld Bank & Bridge Mod

### Информация о моде
```
Название: intelworld-bank-and-bridge
Версия: 1.0.0
Файл: intelworld-bank-and-bridge-1.0.0.jar
Размер: ~228KB
Расположение на сервере: /mods/intelworld-bank-and-bridge-1.0.0.jar
Локальная сборка: C:\Users\grinb\mod bank\build\libs\
```

### Функционал мода
1. **Bank API Server** (порт 8118)
   - Генерация кодов для авторизации
   - Проверка кодов
   - Получение баланса игроков
   - Хранение данных в JSON файлах

2. **Bridge** (статистика сервера)
   - Отправка данных на сайт каждые 30 секунд
   - TPS, онлайн игроки, память
   - События join/leave

### API Endpoints мода

**POST** `http://purple.fnode.me:8118/api/auth/verify`
```json
Request:
{
  "username": "Steve",
  "code": "ABC123"
}

Response (success):
{
  "success": true,
  "uuid": "...",
  "username": "Steve"
}

Response (error):
{
  "error": "Неверный код или истек срок действия"
}
```

**GET** `http://purple.fnode.me:8118/api/bank/balance?uuid=...`
```json
Response:
{
  "balance": 15420
}
```

### Конфиг Bridge (intelworld-bridge.json)
```json
{
  "enabled": true,
  "apiUrl": "https://minecraftic.ru/api/server/update",
  "updateInterval": 30,
  "serverName": "IntelWorld",
  "apiKey": ""
}
```

### Команды в игре
```
/account link - Получить код для входа на сайт (действует 5 минут)
/balance - Проверить баланс
/pay <игрок> <сумма> - Перевести деньги
```

### Сборка мода
```bash
cd "C:\Users\grinb\mod bank"
./gradlew build

# JAR файл появится в:
# build/libs/intelworld-bank-and-bridge-1.0.0.jar
```

### Загрузка мода на сервер
```bash
sftp -P 2022 -i ~/.ssh/faithnode_key kakat_stoia.a8971ece@white.ru.faithnode.net << 'EOF'
cd mods
put "C:/Users/grinb/mod bank/build/libs/intelworld-bank-and-bridge-1.0.0.jar"
bye
EOF
```

---

## 🌍 Сайт (Next.js)

### Vercel
```
Проект: sait-intel
URL: https://sait-intel.vercel.app
Домен: https://minecraftic.ru (через редирект)
Аккаунт: grinbogdan2006-6563s-projects
```

### Переменные окружения Vercel
```
JWT_SECRET=intelworld-super-secret-key-change-me-in-production-2026
MINECRAFT_SERVER_URL=http://purple.fnode.me:8118
```

**Как обновить переменные:**
1. Зайти на https://vercel.com/grinbogdan2006-6563s-projects/sait-intel
2. Settings → Environment Variables
3. Изменить значение
4. Redeploy

### Локальная разработка
```bash
cd "C:\Users\grinb\Downloads\сайт intel"

# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev
# Сайт доступен на http://localhost:3000

# Сборка
npm run build

# Деплой на Vercel
vercel --prod
```

### .env.local (локальная разработка)
```
JWT_SECRET=intelworld-super-secret-key-change-me-in-production-2026
MINECRAFT_SERVER_URL=http://purple.fnode.me:8118
MINECRAFT_DATA_DIR=
```

---

## 📡 API Routes сайта

### Авторизация
**POST** `/api/auth/verify`
- Проверяет код через Minecraft API
- Создает JWT токен
- Устанавливает HttpOnly cookie
- Rate limit: 5 попыток за 10 минут

**POST** `/api/auth/logout`
- Удаляет cookie с токеном

### Пользователь
**GET** `/api/user/profile`
- Возвращает профиль авторизованного пользователя
- Требует JWT токен в cookie

**GET** `/api/user/transactions`
- История транзакций пользователя
- Требует JWT токен

### Статистика сервера
**GET** `/api/stats`
- Онлайн игроки, TPS, версия
- Данные обновляются модом каждые 30 секунд
- Если данные старше 2 минут - показывает "Offline"

**POST** `/api/server/update`
- Принимает данные от Bridge мода
- Сохраняет в in-memory хранилище

**GET** `/api/players`
- Список игроков онлайн

### Банк
**GET** `/api/bank/[playerId]`
- Баланс игрока по UUID
- Проксирует запрос к Minecraft API

---

## 🔄 Процесс авторизации

```
1. Игрок на сервере → /account link
   ↓
2. Мод генерирует код (хранится 5 минут в памяти)
   ↓
3. Игрок видит в чате:
   "Ваш код для входа: ABC123"
   "Код действителен 5 минут"
   "Перейдите на сайт и введите ваш ник и код"
   "https://minecraftic.ru/login"
   ↓
4. Игрок открывает сайт → вводит ник + код
   ↓
5. Сайт → POST http://purple.fnode.me:8118/api/auth/verify
   ↓
6. Мод проверяет код → возвращает UUID и username
   ↓
7. Сайт создает JWT токен → устанавливает HttpOnly cookie
   ↓
8. Игрок авторизован → редирект на /profile
```

---

## 🔧 Troubleshooting

### Статистика показывает 0 игроков / 0 TPS

**Причина:** Bridge мод не отправляет данные на сайт

**Решение:**
1. Проверь что мод установлен: `/mods/intelworld-bank-and-bridge-1.0.0.jar`
2. Проверь логи сервера:
   ```
   [IntelWorld Bank API] Bank API Server started on port 8118
   [IntelWorld Bridge] Bridge enabled, sending data to https://minecraftic.ru/api/server/update
   ```
3. Проверь конфиг: `/config/intelworld-bridge.json`
   - `apiUrl` должен быть `https://minecraftic.ru/api/server/update`
4. Перезапусти сервер

### "Не удалось подключиться к серверу" при авторизации

**Причина:** Сайт не может достучаться до Bank API

**Решение:**
1. Проверь что порт 8118 открыт:
   ```bash
   curl http://purple.fnode.me:8118/api/bank/balance?uuid=test
   ```
2. Проверь переменную `MINECRAFT_SERVER_URL` на Vercel
3. Проверь что мод запущен (логи сервера)

### "Неверный код или истек срок действия"

**Причина:** Код истек (5 минут) или неправильно введен

**Решение:**
1. Генерируй новый код: `/account link`
2. Проверь регистр (код чувствителен к регистру)
3. Проверь что ник написан правильно

### Порт 8118 занят

**Причина:** Другой процесс использует порт

**Решение:**
1. Найди процесс: `netstat -an | grep 8118`
2. Останови процесс
3. Или измени порт в `BankApiServer.java` (строка 23)

---

## 📦 Важные файлы

### Мод
```
C:\Users\grinb\mod bank\
├── src\main\java\com\intelworld\
│   ├── bank\
│   │   ├── api\BankApiServer.java          # HTTP API сервер (порт 8118)
│   │   ├── commands\AccountCommands.java   # Команда /account link
│   │   ├── data\BankDataManager.java       # Работа с балансами
│   │   └── data\VerificationCodeManager.java # Генерация кодов
│   └── bridge\
│       ├── config\BridgeConfig.java        # Конфиг (apiUrl, interval)
│       └── IntelWorldBridge.java           # Отправка статистики
├── gradle.properties                        # Версия мода, название
└── build\libs\intelworld-bank-and-bridge-1.0.0.jar
```

### Сайт
```
C:\Users\grinb\Downloads\сайт intel\
├── app\
│   ├── api\
│   │   ├── auth\verify\route.ts            # Проверка кодов
│   │   ├── server\update\route.ts          # Прием данных от мода
│   │   ├── stats\route.ts                  # Статистика сервера
│   │   └── user\profile\route.ts           # Профиль пользователя
│   ├── login\page.tsx                      # Страница авторизации
│   └── profile\page.tsx                    # Личный кабинет
├── lib\
│   ├── auth.ts                             # JWT токены
│   ├── serverData.ts                       # In-memory хранилище
│   └── dataManager.ts                      # Управление аккаунтами
└── .env.local                              # Переменные окружения
```

---

## 🚀 Быстрые команды

### Пересобрать и загрузить мод
```bash
# Сборка
cd "C:\Users\grinb\mod bank"
./gradlew build

# Загрузка на сервер
sftp -P 2022 -i ~/.ssh/faithnode_key kakat_stoia.a8971ece@white.ru.faithnode.net << 'EOF'
cd mods
put "C:/Users/grinb/mod bank/build/libs/intelworld-bank-and-bridge-1.0.0.jar"
bye
EOF

# Перезапуск сервера (через панель хостинга)
```

### Обновить сайт
```bash
cd "C:\Users\grinb\Downloads\сайт intel"
vercel --prod
```

### Проверить что API работает
```bash
# Bank API
curl http://purple.fnode.me:8118/api/bank/balance?uuid=test

# Сайт статистика
curl https://minecraftic.ru/api/stats
```

---

## 📝 История изменений

### 2026-04-20 (текущая версия)
- ✅ Объединены моды bank и bridge в один JAR
- ✅ Изменен порт Bank API с 8080 → 8317 → 8118 (из-за конфликтов)
- ✅ Обновлен Bridge конфиг: apiUrl = https://minecraftic.ru/api/server/update
- ✅ Создан endpoint `/api/server/update` на сайте
- ✅ Настроен SFTP доступ с SSH ключом
- ✅ Упрощено сообщение с кодом (убрана обводка, добавлена кликабельная ссылка)
- ✅ Переименован мод: intelworld-bank → intelworld-bank-and-bridge
- ✅ Мод загружен на сервер через SFTP

### Предыдущие версии
- Создан личный кабинет с авторизацией через Minecraft
- Реализована система банка (балансы, транзакции)
- Добавлена статистика сервера в реальном времени
- Интеграция с Dynmap

---

## ⚠️ Важные замечания

1. **In-memory хранилище на Vercel**
   - Данные статистики сбрасываются при каждом деплое
   - Это нормально - мод отправит новые данные через 30 секунд

2. **Коды авторизации**
   - Хранятся в памяти мода (не в файлах)
   - Живут 5 минут
   - Одноразовые (после использования удаляются)

3. **Порты**
   - 8118 - Bank API (авторизация, балансы)
   - 25522 - Dynmap (карта)
   - 25606 - Minecraft сервер

4. **Безопасность**
   - JWT токены живут 7 дней
   - HttpOnly cookies (защита от XSS)
   - Rate limiting на авторизацию (5 попыток за 10 минут)
   - SSH ключ для SFTP (безопаснее пароля)

---

**Автор документа:** Claude (AI Assistant)  
**Дата создания:** 2026-04-20  
**Статус:** Актуально, все работает
