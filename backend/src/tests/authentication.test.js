import request from 'supertest';
import app from '../../server';
import jwt from 'jsonwebtoken';

describe('Auth API', () => {
  const loginEndpoint = '/login';
  const logoutEndpoint = '/logout';
  let userId;
  let userToken;
  
  const testUser = {
    name: "John Doe",
    email: "johndoe@example.com",
    password: "password123",
    phone_number: 123456
  };

  // Helper function to create a user
  const createUser = async (data) => {
    const response = await request(app).post('/users').send(data);
    return response.body.id;
  };

  // Helper function to delete a user
  const deleteUser = async (id) => {
    await request(app).delete(`/users/${id}`);
  };

  // Setup a user before each test
  beforeEach(async () => {
    userId = await createUser(testUser);
    console.log('User ID created:', userId);
  });

  // Cleanup user after each test
  afterEach(async () => {
    if (userId) {
      await deleteUser(userId);
      userId = null;
    }
  });

  describe('POST /login', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post(`/auth/${loginEndpoint}`)
        .send({ identifier: testUser.name, password: testUser.password });


      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('userId', userId);
      expect(response.body).toHaveProperty('username', testUser.name);

      // Store token for further tests
      userToken = response.body.token;
      expect(response.headers['set-cookie'][0]).toContain('authToken'); // Check for cookie
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .post(`/auth/${loginEndpoint}`)
        .send({ identifier: 'nonexistent@example.com', password: testUser.password });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('should return 401 for invalid password', async () => {
      const response = await request(app)
        .post(`/auth/${loginEndpoint}`)
        .send({ identifier: testUser.name, password: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });
  });

  describe('GET /logout', () => {
    it('should log out the user and clear the token', async () => {
      // First, login to get the token
      const loginResponse = await request(app)
        .post(`/auth/${loginEndpoint}`)
        .send({ identifier: testUser.name, password: testUser.password });
      userToken = loginResponse.body.token;

      const response = await request(app)
        .get(`/auth/${logoutEndpoint}`)
        .set('Authorization', `Bearer ${userToken}`);
        console.log('response', response)

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Logout successful');
      expect(response.headers['set-cookie'][0]).toContain('token=;'); // Ensure the cookie is cleared
    });
  });
});