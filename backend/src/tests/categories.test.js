import request from 'supertest';
import app from '../../server';

describe('Categories API', () => {
    let categoryId;
    let multiCategory = [];
  
    // Helper function to create a category
    const createCategory = async (data) => {
      const response = await request(app).post('/categories').send(data);
      return response.body.id;
    };
  
    // Cleanup any created categories
    const deleteCategory = async (id) => {
      await request(app).delete(`/categories/${id}`);
    };
  
    // Setup a single category before each relevant test
    beforeEach(async () => {
      const newCategory = { name: 'Summer Category', description: 'Category for summer season' };
      categoryId = await createCategory(newCategory);
    });
  
    // Cleanup categories after each test
    afterEach(async () => {
      if (categoryId) {
        await deleteCategory(categoryId);
        categoryId = null;
      }
      // Clean up multiple categories if created
      if (multiCategory.length) {
        for (const id of multiCategory) {
          await deleteCategory(id);
        }
        multiCategory = [];
      }
    });
  
    it('should fetch all categories', async () => {
      const response = await request(app).get('/categories');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  
    it('should fetch a category by ID', async () => {
      const response = await request(app).get(`/categories/${categoryId}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', categoryId);
      expect(response.body).toHaveProperty('name', 'Summer Category');
    });
  
    it('should create a new category', async () => {
      const newCategory = { name: 'Winter Category', description: 'Category for winter season' };
      const response = await request(app).post('/categories').send(newCategory);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', newCategory.name);
      await deleteCategory(response.body.id); // Cleanup after creation
    });
  
    it('should update an existing category', async () => {
      const updatedData = { name: 'Organic Category Name' };
  
      const response = await request(app).put(`/categories/${categoryId}`).send(updatedData);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', updatedData.name);
    });
  
    it('should delete a category', async () => {
      const response = await request(app).delete(`/categories/${categoryId}`);
      expect(response.status).toBe(204);
  
      // Verify the category no longer exists
      const fetchResponse = await request(app).get(`/categories/${categoryId}`);
      expect(fetchResponse.status).toBe(404);
    });
  
    it('should create multiple categories', async () => {
      const categoriesData = [
        { name: 'Fall Category', description: 'Category for fall season' },
        { name: 'Spring Category', description: 'Category for spring season' },
      ];
  
      const response = await request(app).post('/categories/many').send(categoriesData);
      expect(response.status).toBe(201);
      expect(Array.isArray(response.body)).toBe(true);
  
      multiCategory = response.body.map(category => category.id); // Store IDs for cleanup
      expect(response.body.length).toBe(categoriesData.length);
    });
  
    it('should update multiple categories', async () => {
      const categoriesData = [
        { name: 'Fall Category', description: 'Category for fall season' },
        { name: 'Spring Category', description: 'Category for spring season' },
      ];
      multiCategory = await Promise.all(categoriesData.map(createCategory));

      console.log('multi categories', multiCategory)
  
      const updateData = [
        { id: multiCategory[0], name: 'Updated Fall Category', description: 'Updated fall category description' },
        { id: multiCategory[1], name: 'Updated Spring Category', description: 'Updated spring category description' },
      ];
  
    //   const response = await request(app)
    //     .put('/categories/multiple/all')
    //     .send({ categories: updateData });

        // Use .field to send data as form-data
  const response = await request(app)
  .put('/categories/multiple/all')
  .field('categories[0][id]', updateData[0].id)
  .field('categories[0][name]', updateData[0].name)
  .field('categories[0][description]', updateData[0].description)
  .field('categories[1][id]', updateData[1].id)
  .field('categories[1][name]', updateData[1].name)
  .field('categories[1][description]', updateData[1].description);
    
    console.log('response', response)
  
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    //   expect(response.body.data[0]).toHaveProperty('name', 'Updated Fall Category');
    });
  
    it('should return 404 when fetching a non-existent category', async () => {
      const response = await request(app).get('/categories/999999');
      expect(response.status).toBe(404);
    });
});