const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');

dotenv.config();

const defaultCategories = [
    'Groceries',
    'Rent',
    'Utilities',
    'Takeout',
    'Transportation',
    'Entertainment',
    'Income',
    'Health',
    'Shopping',
    'Other'
];

const seedCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const existing = await Category.find({});
        if (existing.length > 0) {
            console.log('Categories already exist. Skipping seed.');
            return process.exit();
        }

        for (const name of defaultCategories) {
            await Category.create({ name });
        }

        console.log('✅ Default categories seeded.');
        process.exit();
    } catch (err) {
        console.error('Error seeding categories:', err.message);
        process.exit(1);
    }
};

seedCategories();
