import axios from 'axios';
import {Router} from 'express';
import userData  from '../data/users.js';
import eventData  from '../data/events.js';

const router = Router();

// gets the event info
router.get('/events/:id', async (req, res) => {
    try {
      const event = await eventData.get(req.params.id);
      res.json(event);
    } catch (error) {
      res.status(404).json({ message: 'Something broke.' });
    }
});

router.get('/events', async (req, res) => {
    try {
        const allEvents = await eventData.getAll();
        res.render('eventsList', { events: allEvents });
      } catch (error) {
        res.status(500).json({ message: 'Something broke.' });
      }
});

// expand the event info
router.get('/events/:id/info', async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await eventData.get(eventId);
        res.render('eventsInfo', { event });
      } catch (error) {
        res.status(404).json({ message: error });
      }
});

// add more routes

export default router;