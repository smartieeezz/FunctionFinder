import axios from 'axios';
import {Router} from 'express';
import userData  from '../data/users.js';
import eventData  from '../data/events.js';
import { compareSync } from 'bcrypt';

const router = Router();

// event info
router.get('/events/:id', async (req, res) => {
  try {
    const event = await eventData.get(req.params.id);
    res.json(event);
  } catch (error) {
    res.status(404).json({ message: 'Event not found.' });
  }
});
router.put('/events/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.session.user.id;
    const previousGuestsAttending = (await eventData.get(eventId)).guestsAttending;

    if (req.query.action === 'register') {
      const updatedFields = {
        guestsAttending: [...previousGuestsAttending, userId]
      }
      const updatedEvent = await eventData.update(eventId, updatedFields);
      const updatedUser = await userData.updateRegisteredEvents(userId, eventId, req.query.action);
      res.json({ event: updatedEvent, user: updatedUser });
    } 
    else if (req.query.action === 'unregister') {
      const updatedFields = {
        guestsAttending: previousGuestsAttending.filter(guestId => guestId !== userId)
      }
      const updatedEvent = await eventData.update(eventId, updatedFields);
      const updatedUser = await userData.updateRegisteredEvents(userId, eventId, req.query.action);
      res.json({ event: updatedEvent, user: updatedUser });
    }
    else if (req.query.action === 'favorite') {
      const user = await userData.get(userId);
      const eventAdded = !user.favoritedEvents.includes(eventId);
      await userData.update(userId, { favoritedEvents: eventAdded ? user.favoritedEvents.concat(eventId) : user.favoritedEvents });
      res.json({ message: eventAdded ? 'Event favorited.' : 'Event already favorited.' });
    }
    else if (req.query.action === 'unfavorite') {
      const user = await userData.get(userId);
      const updatedFields = {
        favoritedEvents: user.favoritedEvents.includes(eventId)
          ? user.favoritedEvents.filter(favoriteId => favoriteId !== eventId)
          : user.favoritedEvents
      }
      await userData.update(userId, updatedFields);
      res.json({ message: 'Event unfavorited.' });
    }
    else {
      res.status(400).json({ message: 'Invalid action.' });
    }
  } catch (error) {
    res.status(404).json({ message: 'Event not found.' });
  }
});

router.get('/events/:id/comments', async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.session.user.id;

  if (!userId) {
    return res.redirect('/account/login');
  }

    const [event, userComment] = await Promise.all([
      eventData.get(eventId),
      eventData.getUserComment(eventId, userId)
    ]);
    const username = await userData.getUsername(userId);;
    const comments = event.functionComments;
    
    res.render('eventComments', { event, userId, comments, username, userComment });
  } catch (error) {
    res.status(404).json({ message: error });
  }
});
router.post('/events/:id/comments', async (req, res) => {
  const eventId = req.params.id;
  const userId = req.session.user.id;
  const comment = req.body.comment;

  try {
    const newEventComment = await eventData.createComment(eventId, userId, comment);
    res.status(201).send(newEventComment); 
    // res.redirect(`/events/${eventId}/comments?userId=${userId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});
router.delete('/events/:id/comments', async (req, res) => {
  const eventId = req.params.id;
  const userId = req.session.user.id;
    
  try {
    const deletedComment = await eventData.deleteRecentComment(eventId, userId);
    res.status(200).send(deletedComment);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
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
      const userId = req.session.user.id;
      // const userId = req.query.userId;
    
    // res.render('eventInfo', { event });
    res.render('eventInfo', { event, userId });
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// add more routes

export default router;