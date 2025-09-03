# Collabri -- Hybrid Collaboration Platform

Collabri is a **hybrid collaboration platform** built with **NestJS**,
combining **REST, GraphQL, and WebSockets**.\
It provides **real-time chat, task management, collaborative documents,
notifications, and a knowledge graph**.

---

## Features

- **Auth & User Management** with JWT (REST + GraphQL)
- **Real-Time Chat** (channels, direct messages, typing indicators)
- **Task Management** (CRUD, assignments, real-time updates)
- **Collaborative Documents** (Google Docs style editing, live
  updates)
- **Knowledge Graph** (Neo4j integration for relationships)
- **Notifications System** (in-app + email, powered by queues)
- **REST API + GraphQL API** (hybrid queries & mutations)
- **WebSockets** for real-time events

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/0xEbrahim/collabri.git
cd collabri
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Create a `.env` file:

```bash
# ENV
APP_BASE_URL=BASE_URL
APP_MASTER_USER=MASTER_MAIL
APP_PORT=PORT
NODE_ENV=ENV

# DB
DB_TYPE=TYPE_OF_DB_
DB_PORT=PORT
DB_USER=USER
DB_PASS=PASS
DB_SYNC=SYNC_OR_NOT
DB_HOST=HOST
DB_DB=DATABASE_NAME

# GOOGLE OAUTH
GOOGLE_CLIENT_ID=CLIENT_ID
GOOGLE_CLIENT_SECRET=CLIENT
GOOGLE_CALLBACK=CB_URL

# CLOUDINARY
CLOUD_NAME=NAME
CLOUD_KEY=KEY
CLOUD_SECRET=SECRET
CLOUDINARY_URL=URL

# EMAIL SERVICE
SMTP_HOST=SERVICE_HOST
SMTP_PORT=PORT
SMTP_USER=EMAIL
SMTP_PASS=PASS

# QUEUE
QUEUE_HOST=HOST
QUEUE_PORT=PORT

# BCRYPT
BCRYPT_SALT_ROUNDS=YOUR_SALT_OR_ROUNDS

# JsonWebToken
ACC_SECRET=YOUR_SECRET
ACC_EXP=1h
REF_SECRET=YOUR_SECRET
REF_EXP=30d
```

### 4. Run database migrations

```bash
npm run typeorm migration:run
```

- note: Changes on the schema requires migrations:

```bash
npm run migration:generate src/db/migrations/[migration_name]
```

### 5. Start the server

```bash
npm run start:dev
```

---

## APIs

### REST Endpoints

- `POST /auth/signup` -- Register new user
- `POST /auth/login` -- Login user
- `POST /auth/refresh` -- refersh token
- `POST /auth/logout` -- Logout
- `PATCH auth/verifyEmail/:code` -- verify email

### GraphQL API

Schema available at `/graphql`. Queries & Mutations:

```graphql
type Query {
  users(query: QueryAllInputType): [UserEntity!]!
  user(id: Int!): UserEntity!
}

type Mutation {
  createUser(createUser: CreateUserDto!): UserEntity!
  updateUser(updateUser: UpdateUserDto!): UserEntity!
  deleteUser(id: Int!): String!
}
```

---

## WebSocket Events (Socket.IO)

### Auth handshake

```ts
socket.io - client(url, { authorization: { token: 'Bearer <JWT>' } });
```

### Events

### Event → {data with event}

#### Client → Server

- `initSocket` → `{}`
- `openDm` → `receiverId`
- `sendMessage` → `{  roomId?, message, receiverId?}`
- `updateMessage` → `{ message, roomId, messageId}`
- `deleteMessage` → `{  roomId, messageId}`
- `readMessage` → `{  roomId, messageId}`
- `joinDmRoom` → `roomId`
- `createChatRoom` → `{ name}`
- `joinChatRoom` → `{ roomId}`
- `leaveChatRoom` → `{  roomId}`

#### Server → Client

- `dmRoomCreated` → `{  roomId, senderId}`
- `dmOpened` → `{ room, messages}`
- `messageSent` → `{  message}`
- `messageUpdated` → `{ message}`
- `messageDeleted` → `{ message}`
- `messageRead` → `{  message}`
- `newMember` → `{  message: "A new member joined"}`
- `chatRoomCreated` → `{ room, message: "Room created"}`
- `chatRoomJoined` → `You joined the room`
- `chatRoomLeft` → `{ message: "You left the room"}`

---

## Milestones

### M1 -- Auth & User Management

- [x] REST: User CRUD (`/users`)
- [x] REST: Auth (`/auth/login`, `/auth/register`, `/auth/refresh`, `/auth/logout`)
- [x] GraphQL: User query + auth mutations
- [x] JWT + Refresh tokens
- [x] Role-based access control

### M2 -- Real-Time Chat (in progress)

- [x] REST: Room & Message CRUD
- [x] WebSockets: Real-time messaging
- [ ] GraphQL subscriptions
- [ ] Redis Pub/Sub integration

### M3 -- Task Management

- [ ] REST: Task CRUD + assignments
- [ ] GraphQL: Nested queries
- [ ] WebSockets: Real-time task updates

### M4 -- Collaborative Documents

- [ ] REST + GraphQL: Docs CRUD
- [ ] WebSockets: Real-time editing

### M5 -- Knowledge Graph

- [ ] Neo4j integration
- [ ] Smart relationship queries

### M6 -- Notifications & Queue

- [ ] RabbitMQ / Kafka for async jobs
- [ ] Email + in-app notifications

### M7 -- Deployment & Monitoring

- [ ] CI/CD pipeline
- [ ] Kubernetes deployment
- [ ] Logging & metrics

---

## Checklist (what's done)

- [x] User CRUD
- [x] Auth (JWT, refresh)
- [x] Role-based access
- [x] Rooms (DM + channels)
- [x] Messages (REST + WS)
- [ ] Redis Pub/Sub
- [ ] GraphQL subscriptions
- [ ] Tasks module
- [ ] Docs collaboration
- [ ] Neo4j integration
- [ ] Notifications system
- [ ] CI/CD + Monitoring

---

## License

MIT © 2025 Collabri [LICENSE ](https://github.com/0xEbrahim/Collabri/blob/main/LICENSE)
