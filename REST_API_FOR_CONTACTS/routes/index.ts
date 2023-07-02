import express, { Router } from 'express';
import { Request, Response } from 'express';
import contactController from '../controller/contactController';

const router: Router = express.Router();

router.post('/identify', (req: Request, res: Response, next: any) => {
  contactController.create(req, res, next);
});

export default router;