import express from 'express';
import { Auth, protect } from '../Authendication/auth.js';
import { createAdmin, createOwner, deleteUser, getUsers, loginUser, toggleUserStatus, updateUserDetails,  } from '../controller/User.js';

const router = express.Router();

router.post('/createowner',createOwner);
router.post('/createadmin',Auth, protect, createAdmin);
router.post('/login', loginUser);
router.get('/getallusers', Auth,protect, getUsers);
router.put('/updateuser/:id',Auth,protect,updateUserDetails);
router.patch('/toggle-status/:id', Auth,protect, toggleUserStatus);
router.delete('/delete/:id', Auth,protect, deleteUser);

export default router;
 