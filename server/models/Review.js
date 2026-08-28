import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    country: {
      type: String,
      required: [true, 'Country of origin is required'],
      trim: true,
      maxlength: [100, 'Country cannot exceed 100 characters'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1 star'],
      max: [5, 'Rating cannot exceed 5 stars'],
    },
    reviewContent: {
      type: String,
      required: [true, 'Review content is required'],
      trim: true,
      maxlength: [2000, 'Review content cannot exceed 2000 characters'],
    },
    photoUrl: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'rejected'],
        message: '{VALUE} is not a valid moderation status',
      },
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Helpful index for fast retrieval of live public approved reviews
reviewSchema.index({ status: 1, createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
