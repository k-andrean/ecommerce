import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory, deleteAllCategories } from "../models/categories.js";


export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await getCategories();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

export const getCategory = async (req, res, next) => {
  try {
    const category = await getCategoryById(parseInt(req.params.id));
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const createNewCategory = async (req, res, next) => {
    try {
      // Pass the entire req.body object to createProduct
      const image = req.file
      const category = req.body

      if(image){
        category.image_path = image.path
      }
      const newCategory = await createCategory(category);
  
      res.status(201).json(newCategory);
    } catch (error) {
      next(error);
    }
  };

export const createMultiCategories = async (req, res, next) => {
    try {
        const dataCategories = req.body; // Expecting an array of collection data
        const createdCategories = []; // To store successfully created collections

        for (const data of dataCategories) {
            const newCategory = await createCategory(data);
            createdCategories.push(newCategory); // Add each new collection to the array
        }

        res.status(201).json(createdCategories); // Return all created collections
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};

export const updateExistingCategory = async (req, res, next) => {
  try {
    const image = req.file; // Get image from uploaded files (if any)
    const categoryId = parseInt(req.params.id, 10);

    if (isNaN(categoryId)) {
      return res.status(400).json({ message: `Invalid ID for category: ${categoryId}` });
    }

    const existingCategory = await getCategoryById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({ message: `No category found with ID ${categoryId}` });
    }

    const dataCategory = {
      ...req.body,
      image_path: image ? image.path : existingCategory.image_path  // Use new image path if uploaded, otherwise keep the existing one
    };

    const updatedCategory = await updateCategory(categoryId, dataCategory);
    if (updatedCategory) {
      res.status(200).json(updatedCategory);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const updateMultiCategories = async (req, res, next) => {
  // const { categories } = req.body;
  
  const categories = typeof req.body.categories === 'string'
  ? JSON.parse(req.body.categories)
  : req.body.categories;

  // console.log('categories', categories);

  // Check if the categories are provided
  if (!categories || !categories.length) {
    return res.status(400).json({ message: "No categories provided." });
  }

  try {
    const updatedCategories = [];

    // Loop through each category in the request
    for (const category of categories) {
      const { id, name, description } = category;
      
      // Ensure that id is valid and explicitly parse it as an integer
      const parsedId = parseInt(id, 10);

      if (!parsedId || isNaN(parsedId)) {
        return res.status(400).json({ message: `Invalid ID for category: ${JSON.stringify(category)}` });
      }

      // Fetch the existing category from the database
      const existingCategory = await getCategoryById(parsedId);
      if (!existingCategory) {
        console.error(`No category found with ID ${parsedId}`);
        continue; // Skip to the next category if it doesn't exist
      }

      // Prepare the update object, preserving existing image_path if not provided in the request
      const updateData = {
        name,
        description,
        image_path: category.image_path ? category.image_path : existingCategory.image_path, // Only update if image_path is provided
      };

      const updatedCategory = await updateCategory(parsedId, updateData);

      // Add updated category to the array if successful
      if (updatedCategory) {
        updatedCategories.push(updatedCategory);
      } else {
        console.error(`No category found with ID ${parsedId}`);
      }
    }

    // Send a response with the updated categories
    res.json({
      message: "Categories updated successfully.",
      data: updatedCategories,
    });
  } catch (error) {
    console.error("Error updating categories:", error);
    res.status(500).json({
      message: "Error updating categories",
      error: error.message,
    });
  }
};

export const removeCategory = async (req, res, next) => {
    try {
      const categoryId = parseInt(req.params.id);
  
      if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
  
      const deletedCategoryCount = await deleteCategory(categoryId);
  
      if (deletedCategoryCount === 0) {
        return res.status(404).json({ message: "Category not found" });
      }
  
      res.status(204).end(); // No content for successful deletion
    } catch (error) {
      next(error);
    }
  };

  export const removeAllCategoriesController = async (req, res, next) => {
    try {
      console.log('delete all called')
      await deleteAllCategories();
      res.status(204).end(); // No content for successful deletion
    } catch (error) {
      next(error);
    }
  };