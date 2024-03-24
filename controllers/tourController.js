const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getTop5Cheap = (req, res, next) => {
    req.query.limit = 5;
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,ratingsAverage,price,difficulty';

    next();
};

exports.getAllTours = catchAsync(async (req, res) => {
    const apiFeatures = new APIFeatures(req.query, Tour.find())
        .filter()
        .sort()
        .limitFields()
        .pagination();

    const tours = await apiFeatures.query;

    res.status(200).json({
        status: 'Success',
        result: tours.length,
        data: {
            tours,
        },
    });
});

exports.getTourById = catchAsync(async (req, res) => {
    const id = req.params.id;
    const tour = await Tour.findById(id);

    if (!tour) {
        return next(new AppError('The tour ID cannot be found', 404));
    }

    res.status(200).json({
        status: 'Success',
        data: {
            tour,
        },
    });
});

exports.createATour = catchAsync(async (req, res) => {
    const createdTour = await Tour.create(req.body);

    res.status(200).json({
        status: 'Success',
        data: {
            createdTour,
        },
    });
});

exports.udpateATour = catchAsync(async (req, res) => {
    const id = req.params.id;
    const updatedTour = await Tour.findByIdAndUpdate(id, req.body);

    if (!updatedTour) {
        return next(new AppError('Tour ID cannot be found', 404));
    }

    res.status(200).json({
        status: 'Success',
        data: {
            updatedTour,
        },
    });
});

exports.deleteATourById = catchAsync(async (req, res) => {
    const id = req.params.id;
    const deletedTour = await Tour.findByIdAndDelete(id);

	if (!deletedTour) {
		return next(new AppError('Tour ID cannot be found', 404));
	}

    res.status(204).json({
        status: 'Success',
        data: {
            deletedTour,
        },
    });
});

exports.getGoodTourStats = catchAsync(async (req, res) => {
    const stats = await Tour.aggregate([
        {
            $match: {
                ratingsAverage: { $gte: 4.5 },
            },
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                tours: { $push: '$name' },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRatings: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            },
        },
        {
            $sort: { avgPrice: 1 },
        },
    ]);

    res.status(200).json({
        status: 'Success',
        data: {
            stats,
        },
    });
});

exports.getMonthlyPlan = catchAsync(async (req, res) => {
    const year = req.params.year * 1;

    const monthlyTours = await Tour.aggregate([
        {
            $unwind: '$startDates',
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                },
            },
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' },
            },
        },
        {
            $addFields: {
                month: '$_id',
            },
        },
        {
            $project: {
                _id: 0,
            },
        },
        {
            $sort: { _id: -1 },
        },
        {
            $limit: 12,
        },
    ]);

    res.status(200).json({
        status: 'Success',
        data: {
            monthlyTours,
        },
    });
});
