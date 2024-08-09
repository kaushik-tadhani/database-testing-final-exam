import axios from "axios";

const targetUrl = `${process.env.TARGET_URL}`;

describe("Customer API", () => {
  it("GET /customer/:id - should return 200 and the customer data", async () => {
    const response = await axios.get(`${targetUrl}/customer/1`);
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("name");
    expect(response.data).toHaveProperty("email");
    expect(response.data).toHaveProperty("phone");
  });

  it("GET /customers - should return 200 and the list of customers", async () => {
    const response = await axios.get(`${targetUrl}/customers`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  it("POST /customer - should create a new customer and return 200", async () => {
    const newCustomer = {
      name: "New Customer",
      email: "new.customer@example.com",
      phone: "123-456-7890"
    };

    const response = await axios.post(`${targetUrl}/customer`, newCustomer);
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("name", newCustomer.name);
  });

  it("PUT /customer/:id - should update the customer and return 200", async () => {
    const updatedCustomer = {
      name: "Updated Customer",
      email: "updated.customer@example.com",
      phone: "987-654-3210"
    };

    const response = await axios.put(`${targetUrl}/customer/1`, updatedCustomer);
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("name", updatedCustomer.name);
  });

  it("DELETE /customer/:id - should delete the customer and return 200", async () => {
    const response = await axios.delete(`${targetUrl}/customer/1`);
    expect(response.status).toBe(200);
  });

  it("DELETE /customer/:id - should return 404 if the customer does not exist", async () => {
    try {
      await axios.delete(`${targetUrl}/customer/999`);
    } catch (error: any) {
      expect(error.response.status).toBe(404);
    }
  });
});