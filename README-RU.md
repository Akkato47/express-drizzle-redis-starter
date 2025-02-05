# Express Starter

**Express Starter** – это стартовый шаблон для создания API на базе Node.js с использованием Express, Drizzle ORM, PostgreSQL и Redis. Этот проект обеспечивает быстрый старт и удобную настройку сервиса с базой данных и кэшем.

## 📋 Содержание

- [О проекте](#-о-проекте)
- [Чек лист](#-чек-лист)
- [Технологии](#-технологии)
- [Установка](#-установка)
- [Настройка окружения](#-настройка-окружения)
- [Запуск приложения](#️-запуск-приложения)
- [Команды](#-команды)
- [Лицензия](#-лицензия)
- [Совместимость](#-cовместимость)

---

## 🚀 О проекте

Express Drizzle Redis Starter предоставляет основу для быстрого разворачивания backend-приложений. Проект содержит уже настроенную интеграцию с Redis и PostgreSQL, а также готовую к использованию структуру REST API.

## ✔ Чек-лист

Реализованные возможности в проекте

- [x] Express.
- [x] PostgreSQL.
- [x] Drizzle ORM.
- [x] Настроены базовые миграции базы данных.
- [x] Redis.
- [x] Dockerfile и Docker compose.
- [x] Mail sender.
- [x] S3 uploads.
- [x] Подключена OAuth2.0 авторизация через Яндекс.
- [x] Eslint & Prettier.
- [ ] Тестирование.
- [ ] Подключена OAuth2.0 авторизация через VK.
- [ ] ELK.
- [ ] Prometheus and Grafana.
- [ ] RabbitMQ/Kafka.

## 🛠 Технологии

Проект построен на основе следующих технологий и библиотек:

- **[Node.js](https://nodejs.org/)** – среда выполнения JavaScript на сервере
- **[Express](https://expressjs.com/)** – минималистичный и гибкий веб-фреймворк для Node.js
- **[Drizzle ORM](https://orm.drizzle.team/)** – ORM для PostgreSQL
- **[Redis](https://redis.io/)** – высокопроизводительный кэш
- **[Docker](https://www.docker.com/)** – контейнеризация и управление зависимостями

## 📦 Установка

1. Клонируйте репозиторий:

   ```bash
   git clone https://github.com/Akkato47/express-drizzle-redis-starter.git
   cd express-drizzle-redis-starter
   ```

2. Убедитесь, что на вашем компьютере установлены **Docker** и **Docker Compose**. Этот проект использует Docker для контейнеризации сервисов.

## 🔧 Настройка окружения

Создайте файл `.env` в корневой папке проекта и заполните его, используя [ENV EXAMPLE](example.env):

## ▶️ Запуск приложения

Запустить проект можно с помощью Docker Compose:

```bash
docker-compose up -d --build
```

После успешного запуска проект будет доступен по адресу: `http://localhost:8000/api`.

## 📜 Команды

- **`docker-compose up`**: запускает проект в Docker.
- **`docker-compose down`**: останавливает и удаляет контейнеры.
- **`yarn dev`**: локальный запуск проекта для разработки (без Docker).
- **`yarn migrate`**: запуск миграций базы данных.
- **`yarn generate`**: генерация необходимых файлов на основе схемы Drizzle.

## ⚖️ Лицензия

Этот проект лицензирован под [MIT License](LICENSE).

## 🔥 Совместимость

- [React-starter](https://github.com/SergeyV1S/react-starter) by [V1S](https://github.com/SergeyV1S)

---
