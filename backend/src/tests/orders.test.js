import request from 'supertest';
import app from '../../server';

describe('Orders API', () => {
  let orderId;
  let userId = 1; 

  // Helper function to create an order
  const createOrder = async (data) => {
    const response = await request(app).post('/orders').send(data);
    return response.body.id;
  };

  // Cleanup function to delete an order
  const deleteOrder = async (id) => {
    await request(app).delete(`/orders/${id}`);
  };

  // Setup a single order before each test
  beforeEach(async () => {
    const newOrder = {
        user_id: userId,  
        products: JSON.stringify([
            { id: 1, name: "Product A", quantity: 2, price: 100 },
            { id: 2, name: "Product B", quantity: 1, price: 200 }
        ]), 
        order_date: new Date(),  
        shipping_info: {
            address: "123 Random St, Apt 5B",  
            city: "RandomCity", 
            state: "CA", 
            zip: "90210", 
            country: "United States", 
            shipping_option: "Standard Shipping" 
        },
        order_Status: true,  // Order is confirmed
        payment_info: {
            paymentIntentId: "pi_3QITMaKXFl2C7taS0DMVct1Y",  // Random payment intent ID
            amount: 500,  // Random payment amount
            currency: "USD",  // Currency
            status: "succeeded"  // Payment successful
        },
        total_amount: 500  // Total amount of the order
    };
    orderId = await createOrder(newOrder);
    console.log('order id created', orderId)
  });

  // Cleanup orders after each test
  afterEach(async () => {
    if (orderId) {
      await deleteOrder(orderId);
      orderId = null;
    }
  });

  it('should fetch all orders', async () => {
    const response = await request(app).get('/orders');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should fetch a single order by userId and orderId', async () => {
    const response = await request(app).get(`/orders/${userId}/${orderId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', orderId);
    expect(response.body).toHaveProperty('user_id', userId);
  });

  it('should fetch orders by userId', async () => {
    const response = await request(app).get(`/orders/${userId}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('user_id', userId);
  });

  it('should create a new order', async () => {
    const newOrder = {
        user_id: userId,  
        products: JSON.stringify([
            { id: 1, name: "Product A", quantity: 2, price: 100 },
            { id: 2, name: "Product B", quantity: 1, price: 200 }
        ]), 
        order_date: new Date(),  
        shipping_info: {
            address: "123 Random St, Apt 5B",  
            city: "RandomCity", 
            state: "CA", 
            zip: "90210", 
            country: "United States", 
            shipping_option: "Standard Shipping" 
        },
        order_Status: true,  // Order is confirmed
        payment_info: {
            paymentIntentId: "pi_3QITMaKXFl2C7taS0DMVct1Y",  // Random payment intent ID
            amount: 500,  // Random payment amount
            currency: "USD",  // Currency
            status: "succeeded"  // Payment successful
        },
        total_amount: 500  // Total amount of the order
    };
    const response = await request(app).post('/orders').send(newOrder);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('user_id', userId);
    await deleteOrder(response.body.id); // Cleanup
  });

  it('should update an existing order', async () => {
    const updatedData = { 
        total_amount: 1000,  // New address
        order_status: false  // New order status
    };

    const response = await request(app).put(`/orders/${orderId}`).send(updatedData);
    console.log('updated response', response)
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('total_amount', updatedData.total_amount.toFixed(2));
    expect(response.body).toHaveProperty('order_status', updatedData.order_status);
  });

  it('should delete an order', async () => {
    const response = await request(app).delete(`/orders/${orderId}`);
    expect(response.status).toBe(204);

    // Verify the order no longer exists
    const fetchResponse = await request(app).get(`/orders/${userId}/${orderId}`);
    expect(fetchResponse.status).toBe(404);
  });


  it('should return 404 when fetching a non-existent order', async () => {
    const response = await request(app).get('/orders/9999/999999');
    expect(response.status).toBe(404);
  });
});