import { NextFunction, Request, Response } from "express";
import Category, { ICategory } from "../models/category.model";
import Restaurant from "../models/restaurant.model";
import mongoose from "mongoose";

// Add a category to a restaurant
export const addCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId).populate('categories');
    const userId = new mongoose.Types.ObjectId(req.user._id)
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found.' });
    }

    // Check if the current user is the owner or staff of the restaurant
    if (!restaurant.owners.includes(userId) && !restaurant.staffs.includes(userId)) {
      return res.status(403).json({ message: 'Access denied. You are not authorized to update categories.' });
    }

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required.' });
    }

    // Check if the category already exists for that restaurant 
    let category = restaurant.categories.find((category) => category.name === name)
    if (category) {
      return res.status(400).json({ message: 'Category already exists for this restaurant.' });
    }

    const newCategory: ICategory = new Category({ name });
    await newCategory.save();

    restaurant.categories.push(newCategory._id);
    await restaurant.save();

    return res.status(201).json(newCategory);
  } catch (error) {
    next(error)
  }
};

// Update a category
export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found.' });
    }

    // Check if the current user is the owner or staff of the restaurant
    const userId = new mongoose.Types.ObjectId(req.user._id);
    if (!restaurant.owners.some((owner) => owner.equals(userId)) && !restaurant.staffs.some((staff) => staff.equals(userId))) {
      return res.status(403).json({ message: 'Access denied. You are not authorized to update categories.' });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.categoryId,
      { name: req.body.name },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    return res.status(200).json(updatedCategory);
  } catch (error) {
    next(error)
  }
}

// delete a category
export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found.' });
    }

    // Check if the current user is the owner or staff of the restaurant
    const userId = new mongoose.Types.ObjectId(req.user._id);
    if (!restaurant.owners.some((owner) => owner.equals(userId)) && !restaurant.staffs.some((staff) => staff.equals(userId))) {
      return res.status(403).json({ message: 'Access denied. You are not authorized to delete categories.' });
    }

    const deletedCategory = await Category.findByIdAndDelete(req.params.categoryId);

    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    return res.status(200).json({ message: 'Category deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
