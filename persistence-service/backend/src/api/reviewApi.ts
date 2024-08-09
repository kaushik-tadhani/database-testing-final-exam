import { Express } from "express";
import Review from "../entities/review";
import ReviewRepository from "../repositories/review-repository/reviewRepository";
import Result from "../utils/result";

export default class ReviewApi {
    #reviewRepository: ReviewRepository;
    #express: Express;

    constructor(reviewRepository: ReviewRepository, express: Express) {
        this.#reviewRepository = reviewRepository;
        this.#express = express;

        this.#express.get("/review/:id", async (req, res) => {
            try {
                const result: Result<Review> = await this.#reviewRepository.get(req.params.id);

                if (result.error && result.errorCode) {
                    res.status(result.errorCode).json({ message: result.error });
                } else {
                    res.status(200).json(result.data);
                }
            } catch (error) {
                console.error('Update operation failed:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        this.#express.get("/reviews", async (req, res) => {
            try {
                const reviews = await this.#reviewRepository.getAll();
        
                res.status(200).json(reviews.data);
            } catch (err) {
                console.error('Failed to retrieve review:', err);
                res.status(500).json({ error: 'Internal server error' });
            }
        });

        this.#express.post("/review", async (req, res) => {
            const { body } = req;

            const review = new Review();
            review.rating = body.rating;
            review.comment = body.comment;
            review.book_id = body.book_id;
            review.customer_id = body.customer_id;

            try {
                let result = await this.#reviewRepository.post(review);
                
                if (result.error && result.errorCode) {
                    res.status(result.errorCode).json({ message: result.error });
                } else {
                    res.status(200).json(result.data);
                }
            } catch (error) {
                console.error('Update operation failed:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        });

        this.#express.put("/review/:id", async (req, res) => {
            const { id } = req.params;
            const { body } = req;
        
            const review_id = parseInt(id);
            if (isNaN(review_id)) {
                return res.status(400).json({ message: 'ID must be a number' });
            }

            const review: Review = new Review();

            review.review_id = review_id;
            review.rating = body.rating;
            review.comment = body.comment;
            review.book_id = body.book_id;
            review.customer_id = body.customer_id;
        
            try {
                let result = await this.#reviewRepository.put(review);
        
                if (result.error && result.errorCode) {
                    res.status(result.errorCode).json({ message: result.error });
                } else {
                    res.status(200).json(result.data);
                }
            } catch (error) {
                console.error('Update operation failed:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
        
        this.#express.delete("/review/:id", async (req, res) => {
            const { id } = req.params;

            try {
                let result = await this.#reviewRepository.delete(id);
        
                if (result.error && result.errorCode) {
                    res.status(result.errorCode).json({ message: result.error });
                } else {
                    res.status(200).send();
                }
            } catch (err) {
                console.error('Delete operation failed:', err);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}

