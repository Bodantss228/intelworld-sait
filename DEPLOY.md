# IntelWorld - Деплой на Timeweb

## Шаги деплоя:

### 1. Подготовка локально
```bash
cd "C:\Users\grinb\Downloads\сайт intel"
npm run build
```

### 2. Загрузка на сервер
Через FileZilla/SFTP загрузи эти файлы:
```
.next/
public/
node_modules/ (или установи на сервере)
package.json
package-lock.json
next.config.js
ecosystem.config.js
data/
app/
components/
types/
tailwind.config.ts
postcss.config.js
tsconfig.json
```

**Или через Git:**
```bash
# На сервере
cd /var/www/intelworld.ru
git clone <твой-репозиторий>
npm install
npm run build
```

### 3. На сервере (SSH)
```bash
# Перейди в папку сайта
cd /var/www/intelworld.ru

# Установи зависимости (если не загружал node_modules)
npm install --production

# Собери проект
npm run build

# Запусти через PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 4. Nginx конфигурация
Создай файл `/etc/nginx/sites-available/intelworld.ru`:

```nginx
server {
    listen 80;
    server_name intelworld.ru www.intelworld.ru;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Активируй:
```bash
sudo ln -s /etc/nginx/sites-available/intelworld.ru /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. SSL (Let's Encrypt)
```bash
sudo certbot --nginx -d intelworld.ru -d www.intelworld.ru
```

### 6. Обновление конфига мода
В `config/intelworld-bridge.json` на Minecraft сервере:
```json
{
  "apiUrl": "https://intelworld.ru/api/server"
}
```

## PM2 команды:
```bash
pm2 list                    # Список процессов
pm2 logs intelworld-site    # Логи
pm2 restart intelworld-site # Перезапуск
pm2 stop intelworld-site    # Остановка
pm2 delete intelworld-site  # Удалить
```

## Обновление сайта:
```bash
cd /var/www/intelworld.ru
git pull
npm install
npm run build
pm2 restart intelworld-site
```
