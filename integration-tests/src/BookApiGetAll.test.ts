import express, { Express } from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import bookApi from "../persistence-service/backend/src/api/bookApi";
import { book } from "../persistence-service/backend/src/entities/book";
import { MockBookApiDataConnector } from "../books/BookApi";

describe("bookApi", () => {
  let app: Express;
  let dataSource: DataSource;
  let mockDataConnector: MockBookApiDataConnector;
  let bookApi: bookApi;

  beforeEach(() => {
    app = express();
    mockDataConnector = new MockBookApiDataConnector();
    dataSource = new DataSource({ type: "sqlite", database: ":memory:", synchronize: true, entities: [book] });
    bookApi = new bookApi(mockDataConnector, dataSource, app);
  });

    describe("GET /books", () => {
        it("should return all books", async () => {
        const response = await request(app).get("/books");
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
        }, 10000);

        it("should return 500 if there is an error", async () => {
        jest.spyOn(dataSource.manager, "find").mockRejectedValue(new Error("DB error"));
        const response = await request(app).get("/books");
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Error fetching books" });
        }, 10000);
    });
});