// IMPORTS AT THE TOP
const express = require("express");
const Dog = require("./dog-model.js");

// INSTANCE OF EXPRESS APP
const server = express();

// GLOBAL MIDDLEWARE
server.use(express.json());

// [GET]    /             (Hello World endpoint)
// ENDPOINTS
server.get("/hello-world", (req, res) => {
  res.status(200).json({ message: "Hello World!" });
});

// [GET]    /api/dogs     (R of CRUD, fetch all dogs)
server.get("/api/dogs", async (req, res) => {
  try {
    const dogs = await Dog.findAll();
    res.status(200).json(dogs);
  } catch (err) {
    res.status(500).json({ message: `Failed to get dogs ${err.message}` });
  }
});
// [GET]    /api/dogs/:id (R of CRUD, fetch dog by :id)

server.get("/api/dogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const dog = await Dog.findById(id);
    if (!dog) {
      res.status(404).json({ message: `Dog with id ${id} not found` });
    } else {
      res.status(200).json(dog);
    }
  } catch (err) {
    res.status(500).json({
      message: `Error fetching dog ${req.params.id}: ${err.message}`,
    });
  }
});

// [POST]   /api/dogs     (C of CRUD, create new dog from JSON payload)
server.post("/api/dogs", async (req, res) => {
  try {
    const { name, weight } = req.body;
    if (!name || !weight) {
      res.status(422).json({
        message: "Please provide name and weight for the dog",
      });
    } else {
      const createdDog = await Dog.create({ name, weight });
      res.status(201).json({
        message: "Successfully created dog",
        data: createdDog,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: `Error creating dog: ${err.message}`,
    });
  }
});

// [PUT]    /api/dogs/:id (U of CRUD, update dog with :id using JSON payload)
server.put("/api/dogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, weight } = req.body;
    if (!name || !weight) {
      res.status(422).json({
        message: "Please provide name and weight for the dog",
      });
    } else {
      const updatedDog = await Dog.update(id, { name, weight });
      if (!updatedDog) {
        res.status(404).json({
          message: `Dog with id ${id} not found`,
        });
      }else {
        res.status(200).json({
          message: "Successfully updated dog",
          data: updatedDog,
        });
      }
    }
   // console.log(id, name, weight);
  } catch (err) {
    res.status(500).json({
      message: `Error updating dog: ${err.message}`,
    });
  }
});

// server.put("/api/dogs/:id", async (req, res) => {
//     try {
//       const { id } = req.params;
//       const { name, weight } = req.body;
//       const dog = await Dog.findById(id);
//       if (!dog) {
//         return res.status(404).json({ message: `Dog with id ${id} not found` });
//       }
  
//       if (!name && !weight) {
//         return res.status(422).json({ message: "Please provide name or weight for the dog" });
//       }
  
//       let changes = {};
//       let messageParts = [];
  
//       if (name && name !== dog.name) {
//         changes.name = name;
//         messageParts.push('name');
//       }
  
//       if (weight && weight !== dog.weight) {
//         changes.weight = weight;
//         messageParts.push('weight');
//       }
  
//       if (Object.keys(changes).length === 0) {
//         return res.status(400).json({ message: "No new information provided" });
//       }
  
//       const updatedDog = await Dog.update(id, changes);
  
//       res.status(200).json({
//         message: `Dog ${messageParts.join(' and ')} changed successfully`,
//         data: updatedDog,
//       });
  
//     } catch (error) {
//       res.status(500).json({ message: "Server error", error });
//     }
//   });
  

// [DELETE] /api/dogs/:id (D of CRUD, remove dog with :id)

server.delete("/api/dogs/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDog = await Dog.delete(id);
        if (!deletedDog) {
        res.status(404).json({
            message: `Dog with id ${id} not found`,
        });
        } else {
        res.status(200).json({
            message: `${deletedDog.name} is dead, long live ${deletedDog.name} :(`,
            data: deletedDog,
        });
        }
    } catch (err) {
        res.status(500).json({
        message: `Error deleting dog: ${err.message}`,
        });
    }
    }
);

// EXPOSING THE SERVER TO OTHER MODULES
module.exports = server;
