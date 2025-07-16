import express from 'express';
import { Auth } from '../Authendication/auth.js';
import { createBill, getAllBills, getBillById } from '../controller/Bill.js';


const router = express.Router();

router.post('/create', Auth, createBill);
router.get('/', Auth, getAllBills);
router.get('/:id', Auth, getBillById);

export default router;