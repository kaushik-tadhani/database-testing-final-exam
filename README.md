# Project: Final_DB_Testing

## Team Members
Onkar Parag Kulkarni (8973145) - Developed Integration Tests, Database Configuration and Documentations

Kaushik Tadhani (8955406) - Developed CRUD Operations, Unit Tests and API Endpoints 

---

This project is containerized. Please have Docker installed. Instructions are
on the README in the project root.

### Instructions To Run Containers

Integration Tests are situated under folder integration-tests/src. You can run 
```bash
docker compose up --build
```

To run tests against the container which is situated under folder persistence-service/backend. You need to keep this container running to execute all the tests.

### Commands to Run Containers
```bash
cd integration-tests/
```

```bash
docker compose up --build
npm install
```
This will compose the docker container and run all tests!

```bash
cd persistence-service/backend
```

```bash
docker compose up -d
```

```bash
npm install
npm start
```
