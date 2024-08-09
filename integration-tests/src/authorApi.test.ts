import axios from "axios";

const targetUrl = `${process.env.TARGET_URL}`;

describe("Author API", () => {
  it("GET /author/:id - should return 200 and the author data", async () => {
    const response = await axios.get(`${targetUrl}/author/1`);
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("name");
    expect(response.data).toHaveProperty("bio");
    expect(response.data).toHaveProperty("birth_date");
  });

  it("GET /authors - should return 200 and the list of authors", async () => {
    const response = await axios.get(`${targetUrl}/authors`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  it("POST /author - should create a new author and return 200", async () => {
    const newAuthor = {
      name: "New Author",
      bio: "Bio of the new author",
      birth_date: "1980-01-01"
    };

    const response = await axios.post(`${targetUrl}/author`, newAuthor);
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("name", newAuthor.name);
  });

  it("PUT /author/:id - should update the author and return 200", async () => {
    const updatedAuthor = {
      name: "Updated Author",
      bio: "Updated bio",
      birth_date: "1980-01-01"
    };

    const response = await axios.put(`${targetUrl}/author/1`, updatedAuthor);
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("name", updatedAuthor.name);
  });

  it("DELETE /author/:id - should delete the author and return 200", async () => {
    const response = await axios.delete(`${targetUrl}/author/1`);
    expect(response.status).toBe(200);
  });

  it("DELETE /author/:id - should return 404 if the author does not exist", async () => {
    try {
      await axios.delete(`${targetUrl}/author/999`);
    } catch (error: any) {
      expect(error.response.status).toBe(404);
    }
  });
});