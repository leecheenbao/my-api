# my-api
first nodejs project

### 1. Setup
```bash
npm install
```
---

### 2. Development Server
```bash
npm run start
```
---

### Generate API Documentation
```bash
apidoc -i routes_api -o docs
```

### Build Image and Push to GCP Artifact Registry
```bash
sh build.sh
```

### create .env
```bash
touch .env
```
```bash
# API-SERVER
MAIN_NODE_PORT=8080

# DB-local
DB_HOST=<your database host>
DB_PORT=<your database port>
DB_USER=<your database user>
DB_PASS=<your database password>
DB_NAME=my_api
DB_DIALECT=DB_DIALECT=mysql

# JWT settings
JWT_SECRET=<your-secret-key>
JWT_EXPIRES=1h
```