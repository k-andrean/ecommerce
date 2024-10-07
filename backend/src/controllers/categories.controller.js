import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from "../models/categories.js";


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
      const newCategory = await createCategory(req.body);
  
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
    const dataCategory = {
      ...req.body,
      image_path: image ? image.path : null  // Use image path if uploaded, else null
  };
    const updatedCategory = await updateCategory(parseInt(dataCategory.id), dataCategory);
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
  const { categories } = req.body; // Extract the categories array from the request body

  // Check if the categories are provided
  if (!categories || !categories.length) {
    return res.status(400).json({ message: "No categories provided." });
  }

  try {
    const updatedCategories = [];

    // Loop through each category in the request
    for (const category of categories) {
      const { id, name, description, image_path } = category;

      // Ensure that id is valid and explicitly parse it as an integer
      const parsedId = parseInt(id, 10);

      if (!parsedId || isNaN(parsedId)) {
        return res.status(400).json({ message: `Invalid ID for category: ${JSON.stringify(category)}` });
      }

      // Update each category by its ID using the updateCategory function
      const updatedCategory = await updateCategory(parsedId, {
        name,
        description,
        image_path,
      });

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
  
      const deletedCategory = await deleteCategory(categoryId);
  
      if (!deletedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
  
      res.status(204).end(); // No content for successful deletion
    } catch (error) {
      next(error);
    }
  };