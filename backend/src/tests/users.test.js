import request from 'supertest';
import app from '../../server';

describe('Users API', () => {
  let userId;

  // Helper function to create a user
  const createUser = async (data) => {
    const response = await request(app).post('/users').send(data);
    return response.body.id;
  };

  // Cleanup function to delete a user
  const deleteUser = async (id) => {
    await request(app).delete(`/users/${id}`);
  };

  // Setup a single user before each test
  beforeEach(async () => {
    const newUser = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password123",
      phone_number: 123456,
    };
    userId = await createUser(newUser);
    console.log('User ID created', userId);
  });

  // Cleanup user after each test
  afterEach(async () => {
    if (userId) {
      await deleteUser(userId);
      userId = null;
    }
  });

  it('should fetch all users', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should fetch a single user by userId', async () => {
    const response = await request(app).get(`/users/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', userId);
    expect(response.body).toHaveProperty('email', 'johndoe@example.com');
  });

  it('should create a new user', async () => {
    const newUser = {
      name: "Jane Doe",
      email: "janedoe@example.com",
      password: "password123",
      phone_number: 234567,
    };
    const response = await request(app).post('/users').send(newUser);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('email', 'janedoe@example.com');
    await deleteUser(response.body.id); // Cleanup
  });

  it('should update an existing user', async () => {
    const updatedData = {
      email: "johndoe4444@gmail.com",
    };

    const response = await request(app).put(`/users/${userId}`).send(updatedData);
    console.log('update response', response)
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('email', updatedData.email);
  });

  it('should delete a user', async () => {
    const response = await request(app).delete(`/users/${userId}`);
    expect(response.status).toBe(204);

    // Verify the user no longer exists
    const fetchResponse = await request(app).get(`/users/${userId}`);
    expect(fetchResponse.status).toBe(404);
  });

  it('should return 404 when fetching a non-existent user', async () => {
    const response = await request(app).get('/users/99999');
    expect(response.status).toBe(404);
  });
});