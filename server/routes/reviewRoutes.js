import express from 'express';
import Review from '../models/Review.js';
import { sendNewReviewNotification } from '../utils/emailService.js';

const router = express.Router();

// ── Admin Authorization Middleware ───────────────────────────────────────────
const requireAdmin = (req, res, next) => {
  const adminSecret = process.env.ADMIN_SECRET || 'plt2025';
  const providedSecret = req.headers['x-admin-secret'] || req.query.secret;

  if (!providedSecret || providedSecret !== adminSecret) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid or missing admin credentials',
    });
  }
  next();
};

// ── Public Endpoint: Submit New Review ───────────────────────────────────────
// POST /api/reviews
router.post('/reviews', async (req, res) => {
  try {
    const { customerName, country, rating, reviewContent, photoUrl, name, comment, image } = req.body;

    // Normalize field names to accommodate both frontend naming formats
    const finalName = (customerName || name || '').trim();
    const finalCountry = (country || '').trim();
    const finalRating = Number(rating);
    const finalContent = (reviewContent || comment || '').trim();
    const finalPhoto = photoUrl || image || '';

    if (!finalName || !finalCountry || !finalRating || !finalContent) {
      return res.status(400).json({
        success: false,
        message: 'Name, country, rating, and review story are all required.',
      });
    }

    if (finalRating < 1 || finalRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5.',
      });
    }

    // Save to MongoDB with pending status
    const newReview = await Review.create({
      customerName: finalName,
      country: finalCountry,
      rating: finalRating,
      reviewContent: finalContent,
      photoUrl: finalPhoto,
      status: 'pending',
    });

    // Asynchronously dispatch email notification
    sendNewReviewNotification(newReview).catch((err) => {
      console.error('[ReviewRoutes] Async email dispatch error:', err);
    });

    return res.status(201).json({
      success: true,
      message: 'Review submitted successfully and queued for moderation.',
      data: {
        id: newReview._id,
        customerName: newReview.customerName,
        country: newReview.country,
        rating: newReview.rating,
        status: newReview.status,
        createdAt: newReview.createdAt,
      },
    });
  } catch (error) {
    console.error('[ReviewRoutes] Error creating review:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit review. Server error.',
      error: error.message,
    });
  }
});

// ── Public Endpoint: Get Approved Reviews ───────────────────────────────────
// GET /api/reviews/public
router.get('/reviews/public', async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews.map((r) => ({
        id: r._id,
        name: r.customerName,
        country: r.country,
        rating: r.rating,
        comment: r.reviewContent,
        image: r.photoUrl || '',
        date: new Date(r.createdAt).toLocaleDateString('en-GB', {
          month: 'long',
          year: 'numeric',
        }),
        createdAt: r.createdAt,
      })),
    });
  } catch (error) {
    console.error('[ReviewRoutes] Error fetching public reviews:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews.',
      error: error.message,
    });
  }
});

// ── Admin Endpoint: Get All Reviews (Pending, Approved, Rejected) ────────────
// GET /api/admin/reviews
router.get('/admin/reviews', requireAdmin, async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).lean();

    const pending = reviews.filter((r) => r.status === 'pending');
    const approved = reviews.filter((r) => r.status === 'approved');
    const rejected = reviews.filter((r) => r.status === 'rejected');

    return res.status(200).json({
      success: true,
      counts: {
        total: reviews.length,
        pending: pending.length,
        approved: approved.length,
        rejected: rejected.length,
      },
      data: {
        pending,
        approved,
        rejected,
        all: reviews,
      },
    });
  } catch (error) {
    console.error('[ReviewRoutes] Error fetching admin reviews:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch admin reviews.',
      error: error.message,
    });
  }
});

// ── Admin Endpoint: Update Review Moderation Status ──────────────────────────
// PATCH /api/admin/reviews/:id/status
router.patch('/admin/reviews/:id/status', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be pending, approved, or rejected.',
      });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return res.status(404).json({
        success: false,
        message: `Review with id ${id} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Review status updated to '${status}'.`,
      data: updatedReview,
    });
  } catch (error) {
    console.error('[ReviewRoutes] Error updating review status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update review status.',
      error: error.message,
    });
  }
});

// ── Admin Endpoint: Delete Review ───────────────────────────────────────────
// DELETE /api/admin/reviews/:id
router.delete('/admin/reviews/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({
        success: false,
        message: `Review with id ${id} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Review deleted successfully.',
    });
  } catch (error) {
    console.error('[ReviewRoutes] Error deleting review:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete review.',
      error: error.message,
    });
  }
});

export default router;
