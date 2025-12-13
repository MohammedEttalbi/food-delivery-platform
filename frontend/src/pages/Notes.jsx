import { useState } from 'react';
import noteApi from '../api/noteApi';
import Modal from '../components/Modal';

function Notes() {
    const [ratings, setRatings] = useState([]);
    const [average, setAverage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [restaurantId, setRestaurantId] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        restaurantId: '',
        userId: '',
        score: 5,
        comment: '',
    });

    const fetchRatings = async () => {
        if (!restaurantId) {
            setError('Please enter a Restaurant ID');
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const [ratingsData, avgData] = await Promise.all([
                noteApi.getByRestaurant(restaurantId),
                noteApi.getAverage(restaurantId),
            ]);
            setRatings(ratingsData);
            setAverage(avgData.average);
        } catch (err) {
            setError('Failed to fetch ratings. Make sure the backend is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const openCreateModal = () => {
        setFormData({
            restaurantId: restaurantId || '',
            userId: '',
            score: 5,
            comment: '',
        });
        setIsModalOpen(true);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await noteApi.create({
                restaurantId: parseInt(formData.restaurantId),
                userId: parseInt(formData.userId),
                score: parseInt(formData.score),
                comment: formData.comment,
            });
            setIsModalOpen(false);
            if (restaurantId) fetchRatings();
        } catch (err) {
            console.error('Error creating rating:', err);
            alert('Failed to create rating');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this rating?')) return;
        try {
            await noteApi.delete(id);
            fetchRatings();
        } catch (err) {
            console.error('Error deleting rating:', err);
            alert('Failed to delete rating');
        }
    };

    const renderStars = (score) => {
        return '★'.repeat(score) + '☆'.repeat(5 - score);
    };

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">⭐ Ratings & Reviews</h1>
                    <button className="btn btn-primary" onClick={openCreateModal}>
                        + Add Rating
                    </button>
                </div>

                <div className="filter-bar">
                    <input
                        type="number"
                        className="form-input"
                        placeholder="Enter Restaurant ID"
                        value={restaurantId}
                        onChange={(e) => setRestaurantId(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={fetchRatings}>
                        Search
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                {average !== null && (
                    <div className="average-container">
                        <div className="average-card">
                            <div className="average-rating">
                                <span className="rating-stars">{renderStars(Math.round(average))}</span>
                                <span className="rating-number">{average?.toFixed(1)}</span>
                            </div>
                            <p className="average-label">Average rating for Restaurant #{restaurantId}</p>
                            <p className="rating-count">{ratings.length} review(s)</p>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                ) : ratings.length === 0 && restaurantId ? (
                    <div className="empty-state">
                        <h3>No ratings found</h3>
                        <p>Be the first to rate this restaurant</p>
                    </div>
                ) : !restaurantId ? (
                    <div className="empty-state">
                        <h3>Search for ratings</h3>
                        <p>Enter a restaurant ID to view its ratings</p>
                    </div>
                ) : (
                    <div className="cards-grid">
                        {ratings.map((rating) => (
                            <div className="card rating-card" key={rating.id}>
                                <div className="rating-header">
                                    <span className="rating-stars">{renderStars(rating.score)}</span>
                                    <span className="rating-score">{rating.score}/5</span>
                                </div>
                                <div className="rating-content">
                                    {rating.comment && (
                                        <p className="rating-comment">"{rating.comment}"</p>
                                    )}
                                    <p className="rating-customer">User #{rating.userId}</p>
                                </div>
                                <div className="rating-actions">
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(rating.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Add New Rating"
                >
                    <form onSubmit={handleCreate}>
                        <div className="form-group">
                            <label className="form-label">Restaurant ID *</label>
                            <input
                                type="number"
                                name="restaurantId"
                                className="form-input"
                                value={formData.restaurantId}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">User ID *</label>
                            <input
                                type="number"
                                name="userId"
                                className="form-input"
                                value={formData.userId}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Score (1-5) *</label>
                            <select
                                name="score"
                                className="form-input"
                                value={formData.score}
                                onChange={handleInputChange}
                            >
                                {[5, 4, 3, 2, 1].map((num) => (
                                    <option key={num} value={num}>
                                        {renderStars(num)} ({num})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Comment</label>
                            <textarea
                                name="comment"
                                className="form-input"
                                value={formData.comment}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="Write your review..."
                            />
                        </div>
                        <div className="modal-actions">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Submit Rating
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>

            <style>{`
        .average-container {
          margin-bottom: 2rem;
        }

        .average-card {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: var(--radius-lg);
          padding: 2rem;
          text-align: center;
        }

        .average-rating {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }

        .rating-number {
          font-size: 2rem;
          font-weight: 700;
          color: var(--secondary);
        }

        .average-label {
          color: var(--gray-400);
          margin-bottom: 0.25rem;
        }

        .rating-count {
          color: var(--gray-500);
          font-size: 0.9rem;
        }

        .rating-card {
          display: flex;
          flex-direction: column;
        }

        .rating-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .rating-stars {
          font-size: 1.25rem;
          color: var(--secondary);
        }

        .rating-score {
          background: rgba(245, 158, 11, 0.2);
          color: var(--secondary);
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 0.85rem;
        }

        .rating-content {
          flex: 1;
          margin-bottom: 1rem;
        }

        .rating-comment {
          color: var(--gray-300);
          font-style: italic;
          margin-bottom: 0.75rem;
        }

        .rating-customer {
          color: var(--gray-500);
          font-size: 0.85rem;
        }

        .rating-actions {
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>
        </div>
    );
}

export default Notes;
