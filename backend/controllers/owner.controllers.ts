import { NextFunction, Request, Response } from 'express';
import bcrypt from "bcrypt";
import Owner, { IOwner } from '../models/owner.model';
import jwt from "jsonwebtoken"

// register new owner
const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, name, phone, email, address, password, profilePhoto } = req.body

    // Check if the username and email are unique
    const existingOwner = await Owner.findOne({
      $or: [{ username }, { email }],
    })

    if (existingOwner) {
      return res.status(400).json({ message: 'Email already exists.' })
    }

    // Create a new owner
    const newOwner = new Owner({
      username,
      name,
      phone, 
      email,
      address,
      password,
      profilePhoto
    })

    await newOwner.save();
    return res.status(201).json({ message: 'Owner registered successfully.' })
  } catch (error) {
    next(error)
  }
}

// login for owner
const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone, password} = req.body

    const owner = await Owner.findOne({ phone }).select('password')

    if (!owner) {
      return res.status(401).json({ message: 'Authentication failed. User not found.' })
    }
    const passwordMatch = await bcrypt.compare(password, owner.password)

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Authentication failed. Invalid password.' })
    }

    // Generate a JWT token for authentication
    const token = jwt.sign(
      { _id: owner._id, type: 'owner' },
      process.env.JWT_TOKEN_SECRET as string,
      { expiresIn: '48h' }
    )

    return res.status(200).json({ message: 'Authentication successful', token })
  } catch (error) {
    next(error)
  }
}

export {
  register,
  login
}
