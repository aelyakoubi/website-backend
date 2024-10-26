import { Router } from "express";
import getEvents from "../services/events/getEvents.js";
import createEvent from "../services/events/createEvent.js";
import getEventById from "../services/events/getEventById.js";
import deleteEventById from "../services/events/deleteEventById.js";
import updateEventById from "../services/events/updateEventById.js";
import auth from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { title, location } = req.query;
    const events = await getEvents(title, location);
    res.json(events);
  } catch (error) {
    next(error);
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const {
      title,
      description,
      location,
      image,
      startTime,
      endTime,
      categoryIds,
    } = req.body;

    const createdBy = req.user.id;

    const newEvent = await createEvent(
      title,
      description,
      location,
      image,
      startTime,
      endTime,
      createdBy,
      categoryIds
    );

    res.status(201).json(newEvent);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await getEventById(id);

    if (!event) {
      res.status(404).json({ message: `Event with id ${id} not found` });
    } else {
      res.status(200).json(event);
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Get the userId from the authenticated user
    const eventId = await deleteEventById(id, userId); // Pass the userId to the function

    if (eventId) {
      res.status(200).send({
        message: `Event with id ${id} successfully deleted`,
      });
    } else {
      res.status(404).json({
        message: `Event with id ${id} not found`,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:id", auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Get the userId from the authenticated user
    const updatedEvent = await updateEventById(id, req.body, userId); // Pass the userId to the function

    if (updatedEvent) {
      res.status(200).json({
        message: `Event with id ${id} successfully updated`,
      });
    } else {
      res.status(404).json({
        message: `Event with id ${id} not found`,
      });
    }
  } catch (error) {
    next(error);
  }
});


export default router;
