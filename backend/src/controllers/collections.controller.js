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
      const image = req.file
      const collection = req.body

      if(image){
        collection.image_path = image.path
      }
      const newCollection = await createCollection(collection);
  
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
    const collectionId = parseInt(req.params.id, 10);

    if (isNaN(collectionId)) {
      return res.status(400).json({ message: `Invalid ID for collection: ${collectionId}` });
    }

    const existingCollection = await getCollectionById(collectionId);
    if (!existingCollection) {
      return res.status(404).json({ message: `No collection found with ID ${collectionId}` });
    }

    const dataCollection = {
      ...req.body,
      image_path: image ? image.path : existingCollection.image_path  // Use new image path if uploaded, otherwise keep the existing one
    };

    const updatedCollection = await updateCollection(collectionId, dataCollection);
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
  // const { collections } = req.body; // Extract the collections array from the request body

  const collections = typeof req.body.collections === 'string'
  ? JSON.parse(req.body.collections)
  : req.body.collections;

  // Check if the collections are provided
  if (!collections || !collections.length) {
    return res.status(400).json({ message: "No collections provided." });
  }

  try {
    const updatedCollections = [];

    // Loop through each collection in the request
    for (const collection of collections) {
      const { id, name, description} = collection;

      // Ensure that id is valid and explicitly parse it as an integer
      const parsedId = parseInt(id, 10);
      console.log('parsed id', parsedId)

      if (!parsedId || isNaN(parsedId)) {
        return res.status(400).json({ message: `Invalid ID for collection: ${JSON.stringify(collection)}` });
      }

      const existingCollection = await getCollectionById(parsedId);
      if (!existingCollection) {
        console.error(`No collection found with ID ${parsedId}`);
        continue; // Skip to the next category if it doesn't exist
      }

      // Update each collection by its ID using the updateCollection function
      const updatedCollection = await updateCollection(parsedId, {
        name,
        description,
        image_path: collection.image_path ? collection.image_path : existingCollection.image_path,
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
      console.log('collection Id', collectionId)
  
      if (isNaN(collectionId)) {
        return res.status(400).json({ message: "Invalid collection ID" });
      }
  
      const deletedCollectionCount = await deleteCollection(collectionId);
  
      if (deletedCollectionCount === 0) {
        return res.status(404).json({ message: "Collection not found" });
      }
  
      res.status(204).end(); // No content for successful deletion
    } catch (error) {
      next(error);
    }
  };