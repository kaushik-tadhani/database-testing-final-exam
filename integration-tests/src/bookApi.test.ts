import axios from "axios";

const targetUrl = `${process.env.TARGET_URL}`;

describe("Book API", () => {
  it("GET /book/:id - should return 200 and the book data", async () => {
    const response = await axios.get(`${targetUrl}/book/1`);
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("title");
    expect(response.data).toHaveProperty("genre");
    expect(response.data).toHaveProperty("publish_date");
    expect(response.data).toHaveProperty("format");
    expect(response.data).toHaveProperty("price");
    expect(response.data).toHaveProperty("author_id");
    expect(response.data).toHaveProperty("publisher_id");
  });

  it("GET /books - should return 200 and the list of books", async () => {
    const response = await axios.get(`${targetUrl}/books`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  it("POST /book - should create a new book and return 200", async () => {
    const newBook = {
      title: "New Book Title",
      genre: "Fiction",
      publish_date: "2024-08-01",
      format: "Hardcover",
      price: 29.99,
      author_id: 1,
      publisher_id: 1
    };

    const response = await axios.post(`${targetUrl}/book`, newBook);
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("title", newBook.title);
  });

  it("PUT /book/:id - should update the book and return 200", async () => {
    const updatedBook = {
      title: "Updated Book Title",
      genre: "Non-Fiction",
      publish_date: "2024-08-15",
      format: "Paperback",
      price: 19.99,
      author_id: 2,
      publisher_id: 2
    };

    const response = await axios.put(`${targetUrl}/book/1`, updatedBook);
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("title", updatedBook.title);
  });

  it("DELETE /book/:id - should delete the book and return 200", async () => {
    const response = await axios.delete(`${targetUrl}/book/1`);
    expect(response.status).toBe(200);
  });

  it("DELETE /book/:id - should return 404 if the book does not exist", async () => {
    try {
      await axios.delete(`${targetUrl}/book/999`);
    } catch (error: any) {
      expect(error.response.status).toBe(404);
    }
  });
});