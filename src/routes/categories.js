import { Router } from "express";
import getCategories from "../services/categories/getCategories.js";
import createCategory from "../services/categories/createCategory.js";
import getCategoryById from "../services/categories/getCategoryById.js";
import deleteCategoryById from "../services/categories/deleteCategoryById.js";
import updateCategoryById from "../services/categories/updateCategoryById.js";
import auth from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const { name } = req.body;
    const newCategory = await createCategory(name);

    res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await getCategoryById(id);

    if (!category) {
      res.status(404).json({ message: `Category with id ${id} not found` });
    } else {
      res.status(200).json(category);
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await deleteCategoryById(id);

    if (category) {
      res.status(200).send({
        message: `Category with id ${id} successfully deleted`,
        category,
      });
    } else {
      res.status(404).json({
        message: `Category with id ${id} not found`,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:id", auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await updateCategoryById(id, { name });

    if (category) {
      res.status(200).send({
        message: `Category with id ${id} successfully updated`,
      });
    } else {
      res.status(404).json({
        message: `Category with id ${id} not found`,
      });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
