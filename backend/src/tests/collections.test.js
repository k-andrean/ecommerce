import request from 'supertest';
import app from '../../server';

describe('Collections API', () => {
    let collectionId;
    let multiCollection = [];
  
    // Helper function to create a collection
    const createCollection = async (data) => {
      const response = await request(app).post('/collections').send(data);
      return response.body.id;
    };
  
    // Cleanup any created collections
    const deleteCollection = async (id) => {
      await request(app).delete(`/collections/${id}`);
    };
  
    // Setup a single collection before each relevant test
    beforeEach(async () => {
      const newCollection = { name: 'Summer Collection', description: 'Collection for summer season' };
      collectionId = await createCollection(newCollection);
    });
  
    // Cleanup collections after each test
    afterEach(async () => {
      if (collectionId) {
        await deleteCollection(collectionId);
        collectionId = null;
      }
      // Clean up multiple collections if created
      if (multiCollection.length) {
        for (const id of multiCollection) {
          await deleteCollection(id);
        }
        multiCollection = [];
      }
    });
  
    it('should fetch all collections', async () => {
      const response = await request(app).get('/collections');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  
    it('should fetch a collection by ID', async () => {
      const response = await request(app).get(`/collections/${collectionId}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', collectionId);
      expect(response.body).toHaveProperty('name', 'Summer Collection');
    });
  
    it('should create a new collection', async () => {
      const newCollection = { name: 'Winter Collection', description: 'Collection for winter season' };
      const response = await request(app).post('/collections').send(newCollection);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', newCollection.name);
      await deleteCollection(response.body.id); // Cleanup after creation
    });
  
    it('should update an existing collection', async () => {
      const updatedData = { name: 'Organic Collection Name' };
  
      const response = await request(app).put(`/collections/${collectionId}`).send(updatedData);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', updatedData.name);
    });
  
    it('should delete a collection', async () => {
      const response = await request(app).delete(`/collections/${collectionId}`);
      expect(response.status).toBe(204);
  
      // Verify the collection no longer exists
      const fetchResponse = await request(app).get(`/collections/${collectionId}`);
      expect(fetchResponse.status).toBe(404);
    });
  
    it('should create multiple collections', async () => {
      const collectionsData = [
        { name: 'Fall Collection', description: 'Collection for fall season' },
        { name: 'Spring Collection', description: 'Collection for spring season' },
      ];
  
      const response = await request(app).post('/collections/many').send(collectionsData);
      expect(response.status).toBe(201);
      expect(Array.isArray(response.body)).toBe(true);
  
      multiCollection = response.body.map(collection => collection.id); // Store IDs for cleanup
      expect(response.body.length).toBe(collectionsData.length);
    });
  
    it('should update multiple collections', async () => {
      const collectionsData = [
        { name: 'Fall Collection', description: 'Collection for fall season' },
        { name: 'Spring Collection', description: 'Collection for spring season' },
      ];
      multiCollection = await Promise.all(collectionsData.map(createCollection));
  
      const updateData = [
        { id: multiCollection[0], name: 'Updated Fall Collection', description: 'Updated fall collection description' },
        { id: multiCollection[1], name: 'Updated Spring Collection', description: 'Updated spring collection description' },
      ];
  
      const response = await request(app)
        .put('/collections/multiple/all')
        .send({ collections: updateData });
  
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    //   expect(response.body.data[0]).toHaveProperty('name', 'Updated Fall Collection');
    });
  
    it('should return 404 when fetching a non-existent collection', async () => {
      const response = await request(app).get('/collections/999999');
      expect(response.status).toBe(404);
    });
  });