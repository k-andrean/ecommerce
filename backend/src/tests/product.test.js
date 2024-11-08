// tests/products.test.js
import request from 'supertest';
import app from '../../server';

describe('Product API', () => {
  // Test: Get all products
  it('should fetch all products', async () => {
    const response = await request(app).get('/products/all');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

//   Test: Get a product by ID
  it('should fetch a product by ID', async () => {
    const productId = 1; // Replace with a valid product ID in your test database
    const response = await request(app).get(`/products/${productId}`);
    if (response.status === 200) {
      expect(response.body).toHaveProperty('id', productId);
    } else {
      expect(response.status).toBe(404);
    }
  });

  // Test: Get products by category ID
  it('should fetch products by category ID', async () => {
    const categoryId = 1; // Replace with a valid category ID
    const response = await request(app).get(`/products/categories/${categoryId}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test: Get products by collection ID
  it('should fetch products by collection ID', async () => {
    const collectionId = 1; // Replace with a valid collection ID
    const response = await request(app).get(`/products/collections/${collectionId}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test: Create a new product
  it('should create a new product', async () => {
    const newProduct = {
      name: "Test Product",
      price: 100,
      collection_id: 1,
      category_id: 1,
      size: "M",
      color: "Red",
      description: "Test product description",
      details: ["Detail 1", "Detail 2"],
      rating: 4.5,
      image_path: "/path/to/image.jpg",
      quantity: 10,
    };
    const response = await request(app).post('/products').send(newProduct);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(newProduct.name);
  });

  // Test: Update an existing product
  it('should update an existing product', async () => {
    const productId = 6; // Replace with a valid product ID
    const updatedData = { price: 150 };
    const response = await request(app).put(`/products/${productId}`).send(updatedData);

    console.log("Response Status:", response.status); // Log the response status
    console.log("Response Body:", response.body);

    if (response.status === 200) {
      expect(response.body.price).toBe(updatedData.price.toFixed(2));
    } else {
      expect(response.status).toBe(404);
    }
  });

  // Test: Delete a product
  it('should delete a product', async () => {
    const productId = 1; // Replace with a valid product ID
    const response = await request(app).delete(`/products/${productId}`);
    if (response.status === 204) {
      expect(response.body).toEqual({});
    } else {
      expect(response.status).toBe(404);
    }
  });

  // Test: Search products by name
  it('should search products by name', async () => {
    const searchTerm = 'desk'; // Replace with a valid search term
    const response = await request(app).get(`/products/name/search?name=${searchTerm}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});