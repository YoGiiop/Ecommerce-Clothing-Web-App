import express, { Router } from 'express'
import { adminLogin, getUserProfile, loginUser, registerUser } from '../controllers/user.controller.js'
import authUser from '../middleware/auth.js'

const userRouter = Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
userRouter.get('/profile', authUser, getUserProfile)

export default userRouter