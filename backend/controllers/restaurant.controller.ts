import { NextFunction, Request, Response } from "express";
import Restaurant from "../models/restaurant.model";
import MenuItem, { IMenuItem } from "../models/menuItem.model";
import { Document, mongo } from "mongoose";
import Staff from "../models/staff.model";
import Category, { ICategory } from '../models/category.model';
import mongoose from 'mongoose';

// Add a new restaurant (as an owner)
export const createRestaurant = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { name, address, phone, restaurantPhotos } = req.body

    // Create a new restaurant and add the current user as an owner
    const newRestaurant = new Restaurant({
      name,
      address,
      phone,
      restaurantPhotos,
      owners: [req.user._id],
    });


    // // Create items and add them to the restaurant's menu
    // const menuItems = items.map((item: IMenuItem) => ({
    //   name: item.name,
    //   images: item.images,
    //   description: item.description,
    //   categories: item.categories, // array of categories object id
    //   price: item.price,
    // }));

    // const savedItems = await MenuItem.insertMany(menuItems);

    // newRestaurant.menuItems = savedItems.map((item) => item._id);

    await newRestaurant.save();
    return res.status(201).json(newRestaurant);
  } catch (error) {
    next(error)
  }
}

// Get a restaurant by id
export const getRestaurant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId).populate('menuItems categories').select('-staffs -owners')

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found.' });
    }

    return res.status(200).json(restaurant);
  } catch (error) {
    next(error)
  }
};

// Get all restaurants 
export const getAllRestaurants = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const restaurants = await Restaurant.find({ owners: req.user._id }).populate('categories menuItems').select('-staffs -owners')

    return res.status(200).json(restaurants);
  } catch (error) {
    next(error)
  }
}

// Add a new staff to a restaurant
export const addStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const restaurantId = req.params.restaurantId
    const { name, email, password, address, phone, profilePhoto } = req.body
    const { _id: ownerId } = req.user;

    // find the restaurant
    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      'owners': ownerId,
    });

    if (!restaurant) {
      return res.status(403).json({ message: 'Access denied. You are not the owner of this restaurant.' });
    }

    // Create a new staff and add them to the restaurant
    const newStaff = new Staff({
      name,
      phone,
      email,
      address,
      password,
      profilePhoto,
      restaurant: restaurantId,
    });

    await newStaff.save();

    // Add the new staff to the restaurant as manager or staff
    restaurant.staffs.push(newStaff._id);
    await restaurant.save();

    return res.status(201).json({ message: 'Staff added to the restaurant successfully.' });
  } catch (error) {
    next(error)
  }
}


