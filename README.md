# Express Starter

**Express Starter** is a boilerplate for creating APIs using Node.js with Express, Drizzle ORM, PostgreSQL, and Redis. This project offers a quick start and convenient setup for services with a database and cache.

## 📋 Contents

- [About the Project](#-about-the-project)
- [Checklist](#-checklist)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Running the Application](#️-running-the-application)
- [Commands](#-commands)
- [License](#-license)
- [Compatibility](#-compatibility)

---

## 🚀 About the Project

The Express Drizzle Redis Starter provides a foundation for rapidly deploying backend applications. It includes ready-to-use integration with Redis and PostgreSQL, along with a REST API structure.

## ✔ Checklist

Implemented features in the project:

- [x] Express.
- [x] PostgreSQL.
- [x] Drizzle ORM.
- [x] Basic database migrations configured.
- [x] Redis.
- [x] Dockerfile and Docker Compose.
- [x] Mail sender.
- [x] S3 uploads.
- [x] Eslint & Prettier.
- [x] OAuth2.0 authorization via Yandex.
- [ ] OAuth2.0 authorization via VK.
- [ ] Testing.
- [ ] CDN.
- [ ] ELK.
- [ ] Prometheus and Grafana.
- [ ] RabbitMQ/Kafka.

## 🛠 Technologies

The project is based on the following technologies and libraries:

- **[Node.js](https://nodejs.org/)** – JavaScript runtime for server-side programming
- **[Express](https://expressjs.com/)** – minimalist and flexible web framework for Node.js
- **[Drizzle ORM](https://orm.drizzle.team/)** – ORM for PostgreSQL
- **[Redis](https://redis.io/)** – high-performance cache
- **[Docker](https://www.docker.com/)** – containerization and dependency management

## 📦 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Akkato47/express-drizzle-redis-starter.git
   cd express-drizzle-redis-starter
   ```

2. Ensure that **Docker** and **Docker Compose** are installed on your machine. This project uses Docker for containerizing services.

## 🔧 Environment Setup

Create a `.env` file in the root folder of the project and fill it with the values based on the [ENV EXAMPLE](example.env):

## ▶️ Running the Application

You can start the project using Docker Compose:

```bash
docker-compose up -d --build
```

After a successful start, the project will be available at: `http://localhost:8000/api`.

## 📜 Commands

- **`docker-compose up`**: starts the project in Docker.
- **`docker-compose down`**: stops and removes containers.
- **`yarn dev`**: starts the project locally for development (without Docker).
- **`yarn migrate`**: runs database migrations.
- **`yarn generate`**: generates necessary files based on the Drizzle schema.

## ⚖️ License

This project is licensed under the [MIT License](LICENSE).

## 🔥 Compatibility

- [React-starter](https://github.com/SergeyV1S/react-starter) by [V1S](https://github.com/SergeyV1S)

---
