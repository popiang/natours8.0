const mongoose = require('mongoose');

const tourSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        trim: true,
        required: [true, 'A Tour must have a name'],
        minLength: [10, 'A Tour name must be equal or more than 10 characters'],
        maxLength: [40, 'A Tour name must be equal or less than 40 characters'],
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A Tour must have a duration'],
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A Tour must have a maximum group size'],
    },
    difficulty: {
        type: String,
        required: [true, 'A Tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'A difficulty must be easy, medium or difficult',
        },
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be equal or more than 1'],
        max: [5, 'Rating must be equal or less than 5'],
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: [true, 'A Tour must have a price'],
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                return val < this.price;
            },
            message: `The discount ({PRICE}) must be below the regular price`,
        },
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A Tour must have a summary'],
    },
    description: {
        type: String,
        trim: true,
    },
    imageCover: {
        type: String,
        required: [true, 'A Tour must have a image cover'],
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false,
    },
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
