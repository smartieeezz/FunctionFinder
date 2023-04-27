import axios from 'axios';
//imported the router from express
import {Router} from 'express';
const router = Router();


router.route('/').get(async (req, res) => {
    res.render('searchResults')
  });