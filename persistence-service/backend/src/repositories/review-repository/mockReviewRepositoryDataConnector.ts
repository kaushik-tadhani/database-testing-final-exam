import Book from "../../entities/book";
import Customer from "../../entities/customer";
import Review from "../../entities/review";
import DataConnector from "../../interfaces/dataConnector";
import ReviewFilteringOptions from "../../interfaces/reviewFilteringOptions";

export class MockReviewRepositoryDataConnector implements DataConnector<Review, ReviewFilteringOptions> {
    
    private book: Book = {
        book_id: 1,
        title: "book 1",
        genre: "Fantasy",
        publish_date: new Date("2023-06-26"),
        format: "Hardcover",
        price: 19,
        author: {
            author_id: 1,
            name: "author 1",
            bio: "author 1 bio",
            birth_date: new Date('1992-08-25'),
            books:[]
        },
        publisher: {
            publisher_id: 1,
            name: 'publisher 1',
            address: 'publisher 1 address',
            contact_email: 'publisher1@example.com',
            books:[]
        },
        author_id: 1,
        publisher_id: 1,
        reviews: 0
    };

    private customer: Customer = {
        customer_id: 1,
        name: 'Customer 1',
        email: 'customer1@example.com',
        phone: '999-999-9999',
        join_date: new Date("2024-05-06"),
        reviews:[],
        orders:[]
    }
    private mockReviews: Review[] = [
        {
            review_id: 1,
            review_date: new Date("2024-08-05"),
            rating: 5,
            comment: "review comment 1",
            book: this.book,
            customer: this.customer,
            book_id: 1,
            customer_id: 1
        }
    ]; 

    async findById(filteringOptions: ReviewFilteringOptions): Promise<Review | null> {
        const review = this.mockReviews.find(p => p.review_id === filteringOptions.review_id);
        return review || null;
    }

    async getAll(): Promise<Review[]> {
        return this.mockReviews;
    } 

    async create(entity: Review): Promise<Review> {
        const newId = 2;
        let savedReview: Review = {
            ...entity,
            review_id: newId,
            review_date: new Date()
        };
        this.mockReviews.push(savedReview);
        return savedReview;
    }

    async update (entity: Review): Promise<Review> {
        const index = this.mockReviews.findIndex(p => p.review_id === entity.review_id);

        if (index === -1) {
            throw new Error('Review not found'); // Handle the case where the review is not found
        }

        this.mockReviews[index] = {
            ...this.mockReviews[index],
            ...entity
        };
       
        return this.mockReviews[index];
    }


    async delete (id: number): Promise<void> {
        const index = this.mockReviews.findIndex(p => p.review_id === id);

        if (index === -1) throw new Error('Review not found');

        this.mockReviews.splice(index, 1);
    }
}