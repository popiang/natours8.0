const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

exports.getTop5Cheap = (req, res, next) => {
    req.query.limit = 5;
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,ratingsAverage,price,difficulty';

    next();
};

exports.getAllTours = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(404).json({
            status: 'Fail',
            message: error,
        });
    }
};

exports.getTourById = async (req, res) => {
    try {
        const id = req.params.id;
        const tour = await Tour.findById(id);

        res.status(200).json({
            status: 'Success',
            data: {
                tour,
            },
        });
    } catch (error) {
        res.status(404).json({
            status: 'Fail',
            message: error,
        });
    }
};

exports.createATour = async (req, res) => {
    try {
        const createdTour = await Tour.create(req.body);

        res.status(200).json({
            status: 'Success',
            data: {
                createdTour,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: 'Fail',
            message: error,
        });
    }
};

exports.udpateATour = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedTour = await Tour.findByIdAndUpdate(id, req.body);

        res.status(200).json({
            status: 'Success',
            data: {
                updatedTour,
            },
        });
    } catch (error) {
        res.status(404).json({
            status: 'Fail',
            message: error,
        });
    }
};

exports.deleteATourById = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedTour = await Tour.findByIdAndDelete(id);

        res.status(204).json({
            status: 'Success',
            data: {
                deletedTour,
            },
        });
    } catch (error) {
        res.status(404).json({
            status: 'Fail',
            message: error,
        });
    }
};

exports.getGoodTourStats = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(404).json({
            status: 'Fail',
            message: error,
        });
    }
};

exports.getMonthlyPlan = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(404).json({
            status: 'Fail',
            message: error,
        });
    }
};
