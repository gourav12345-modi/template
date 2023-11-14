import { NextFunction, Request, Response } from "express";
import Restaurant from "../models/restaurant.model";
import mongoose from "mongoose";
import MenuItem from "../models/menuItem.model";

// Add a menu item to a restaurant
export const addItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    const userId = new mongoose.Types.ObjectId(req.user._id)

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found.' });
    }

    const { name,
      price,
      images,
      description,
      isVeg,
      categories,
      isServed
    } = req.body;

    // Check if the current user is the owner or staff of the restaurant
    if (!restaurant.owners.includes(userId) && !restaurant.staffs.includes(userId)) {
      return res.status(403).json({ message: 'Access denied. You are not authorized to update menu items.' });
    }

    const newItem = new MenuItem(
      {
        name,
        price,
        images,
        description,
        isVeg,
        categories,
        isServed
      }
    );
    await newItem.save();

    restaurant.menuItems.push(newItem._id);
    await restaurant.save();

    return res.status(201).json(newItem);
  } catch (error) {
    next(error)
  }
}

// Update a menu item
export const updateItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found.' });
    }

    // Check if the current user is the owner or staff of the restaurant
    const userId = new mongoose.Types.ObjectId(req.user._id);
    if (!restaurant.owners.some((owner) => owner.equals(userId)) && !restaurant.staffs.some((staff) => staff.equals(userId))) {
      return res.status(403).json({ message: 'Access denied. You are not authorized to update menu items.' });
    }

    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      req.params.itemId,
      req.body,
      { new: true }
    );

    if (!updatedMenuItem) {
      return res.status(404).json({ message: 'Menu item not found.' });
    }

    return res.status(200).json(updatedMenuItem);
  } catch (error) {
    next(error)
  }
};

// Delete a menu item
export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found.' });
    }

    // Check if the current user is the owner or staff of the restaurant
    const userId = new mongoose.Types.ObjectId(req.user._id);
    if (!restaurant.owners.some((owner) => owner.equals(userId)) && !restaurant.staffs.some((staff) => staff.equals(userId))) {
      return res.status(403).json({ message: 'Access denied. You are not authorized to delete menu items.' });
    }

    const deletedMenuItem = await MenuItem.findByIdAndDelete(req.params.itemId);

    if (!deletedMenuItem) {
      return res.status(404).json({ message: 'Menu item not found.' });
    }

    return res.status(200).json({ message: 'Menu item deleted successfully.' });
  } catch (error) {
    next(error)
  }
};


