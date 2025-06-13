import request from "supertest";
import app from "../../server";

describe("Orders API", () => {
  let orderId;
  let userId = 1;

  const createOrder = async (data) => {
    const response = await request(app).post("/orders").send(data);
    return response.body.id;
  };

  const deleteOrder = async (id) => {
    await request(app).delete(`/orders/${id}`);
  };

  beforeEach(async () => {
    const newOrder = {
      user_id: userId,
      products: JSON.stringify([
        { id: 1, name: "Product A", quantity: 2, price: 100 },
        { id: 2, name: "Product B", quantity: 1, price: 200 },
      ]),
      order_date: new Date(),
      shipping_info: {
        address: "123 Random St, Apt 5B",
        city: "RandomCity",
        state: "CA",
        zip: "90210",
        country: "United States",
        shipping_option: "Standard Shipping",
      },
      order_Status: true,
      payment_info: {
        paymentIntentId: "pi_3QITMaKXFl2C7taS0DMVct1Y",
        amount: 500,
        currency: "USD",
        status: "succeeded",
      },
      total_amount: 500,
    };
    orderId = await createOrder(newOrder);
    console.log("order id created", orderId);
  });

  afterEach(async () => {
    if (orderId) {
      await deleteOrder(orderId);
      orderId = null;
    }
  });

  it("should fetch all orders", async () => {
    const response = await request(app).get("/orders");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should fetch a single order by userId and orderId", async () => {
    const response = await request(app).get(`/orders/${userId}/${orderId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", orderId);
    expect(response.body).toHaveProperty("user_id", userId);
  });

  it("should fetch orders by userId", async () => {
    const response = await request(app).get(`/orders/${userId}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty("user_id", userId);
  });

  it("should create a new order", async () => {
    const newOrder = {
      user_id: userId,
      products: JSON.stringify([
        { id: 1, name: "Product A", quantity: 2, price: 100 },
        { id: 2, name: "Product B", quantity: 1, price: 200 },
      ]),
      order_date: new Date(),
      shipping_info: {
        address: "123 Random St, Apt 5B",
        city: "RandomCity",
        state: "CA",
        zip: "90210",
        country: "United States",
        shipping_option: "Standard Shipping",
      },
      order_Status: true,
      payment_info: {
        paymentIntentId: "pi_3QITMaKXFl2C7taS0DMVct1Y",
        amount: 500,
        currency: "USD",
        status: "succeeded",
      },
      total_amount: 500,
    };
    const response = await request(app).post("/orders").send(newOrder);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("user_id", userId);
    await deleteOrder(response.body.id);
  });

  it("should update an existing order", async () => {
    const updatedData = {
      total_amount: 1000,
      order_status: false,
    };

    const response = await request(app)
      .put(`/orders/${orderId}`)
      .send(updatedData);
    console.log("updated response", response);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "total_amount",
      updatedData.total_amount.toFixed(2)
    );
    expect(response.body).toHaveProperty(
      "order_status",
      updatedData.order_status
    );
  });

  it("should delete an order", async () => {
    const response = await request(app).delete(`/orders/${orderId}`);
    expect(response.status).toBe(204);

    const fetchResponse = await request(app).get(
      `/orders/${userId}/${orderId}`
    );
    expect(fetchResponse.status).toBe(404);
  });

  it("should return 404 when fetching a non-existent order", async () => {
    const response = await request(app).get("/orders/9999/999999");
    expect(response.status).toBe(404);
  });
});
