import { getCollections, getCollectionById, createCollection, updateCollection, deleteCollection } from "../models/collections.js";


export const getAllCollections = async (req, res, next) => {
  try {
    const collections = await getCollections();
    res.status(200).json(collections);
  } catch (error) {
    next(error);
  }
};

export const getCollection = async (req, res, next) => {
  try {
    const collection = await getCollectionById(parseInt(req.params.id));
    if (collection) {
      res.status(200).json(collection);
    } else {
      res.status(404).json({ message: 'Collection not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const createNewCollection = async (req, res, next) => {
    try {
      // Pass the entire req.body object to createProduct
      const newCollection = await createCollection(req.body);
  
      res.status(201).json(newCollection);
    } catch (error) {
      next(error);
    }
  };

export const createMultiCollection = async (req, res, next) => {
    try {
        const dataCollections = req.body; // Expecting an array of collection data
        const createdCollections = []; // To store successfully created collections

        for (const data of dataCollections) {
            const newCollection = await createCollection(data);
            createdCollections.push(newCollection); // Add each new collection to the array
        }

        res.status(201).json(createdCollections); // Return all created collections
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};

export const updateExistingCollection = async (req, res, next) => {
  try {
    const image = req.file; // Get image from uploaded files (if any)
    const dataCollection = {
      ...req.body,
      image_path: image ? image.path : null  // Use image path if uploaded, else null
    };

    const updatedCollection = await updateCollection(parseInt(dataCollection.id), dataCollection);
    if (updatedCollection) {
      res.status(200).json(updatedCollection);
    } else {
      res.status(404).json({ message: 'Collection not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const updateMultiCollections = async (req, res, next) => {
  const { collections } = req.body; // Extract the collections array from the request body

  // Check if the collections are provided
  if (!collections || !collections.length) {
    return res.status(400).json({ message: "No collections provided." });
  }

  try {
    const updatedCollections = [];

    // Loop through each collection in the request
    for (const collection of collections) {
      const { id, name, description, image_path } = collection;

      // Ensure that id is valid and explicitly parse it as an integer
      const parsedId = parseInt(id, 10);

      if (!parsedId || isNaN(parsedId)) {
        return res.status(400).json({ message: `Invalid ID for collection: ${JSON.stringify(collection)}` });
      }

      // Update each collection by its ID using the updateCollection function
      const updatedCollection = await updateCollection(parsedId, {
        name,
        description,
        image_path,
      });

      // Add updated collection to the array if successful
      if (updatedCollection) {
        updatedCollections.push(updatedCollection);
      } else {
        console.error(`No collection found with ID ${parsedId}`);
      }
    }

    // Send a response with the updated collections
    res.json({
      message: "Collections updated successfully.",
      data: updatedCollections,
    });
  } catch (error) {
    console.error("Error updating collections:", error);
    res.status(500).json({
      message: "Error updating collections",
      error: error.message,
    });
  }
};


export const removeCollection = async (req, res, next) => {
    try {
      const collectionId = parseInt(req.params.id);
  
      if (isNaN(collectionId)) {
        return res.status(400).json({ message: "Invalid collection ID" });
      }
  
      const deletedCollection = await deleteCollection(collectionId);
  
      if (!deletedCollection) {
        return res.status(404).json({ message: "Collection not found" });
      }
  
      res.status(204).end(); // No content for successful deletion
    } catch (error) {
      next(error);
    }
  };