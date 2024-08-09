import Review from "../../entities/review";
import { MockReviewRepositoryDataConnector } from "./mockReviewRepositoryDataConnector";
import ReviewRepository from "./reviewRepository";
import { MockAuthorRepositoryDataConnector } from "../author-repository/mockAuthorRepositoryDataConnector";
import { MockPublisherRepositoryDataConnector } from "../publisher-repository/mockPublisherRepositoryDataConnector";
import { MockBookRepositoryDataConnector } from "../book-repository/mockBookRepositoryDataConnector";
import { MockCustomerRepositoryDataConnector } from "../customer-repository/mockCustomerRepositoryDataConnector";

describe('Review Api', () => {
    let reviewApi: any;
    let bookDataConnector: any;
    let customerDataConnector: any;
    let bookMockData: any;
    let customerMockData: any;

    beforeAll(() => {
        bookDataConnector = new MockBookRepositoryDataConnector();
        customerDataConnector = new MockCustomerRepositoryDataConnector();
        reviewApi = new ReviewRepository(new MockReviewRepositoryDataConnector(), bookDataConnector, customerDataConnector);
    
        bookMockData = {
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

        customerMockData = {
            customer_id: 1,
            name: 'Customer 1',
            email: 'customer1@example.com',
            phone: '999-999-9999',
            join_date: new Date("2024-05-06"),
            reviews:[],
            orders:[]
        }
    });

    test('will throw an error if id is not a number', async () => {
        let review = await reviewApi.get('abcd');

        expect(review.error).toBe('ID must be a number')
        expect(review.errorCode).toBe(400);
    });

    test('will throw an error if id is less than 0', async () => {
        let review = await reviewApi.get('-1');

        expect(review.error).toBe('Review ID cannot be less than 0')
        expect(review.errorCode).toBe(400);
    });

    test('will throw an error if id is not found', async () => {
        let review = await reviewApi.get('2');

        expect(review.error).toBe('Review not found')
        expect(review.errorCode).toBe(404);
    });

    test('a review is returned if a positive id is provided', async () => {
        let review = await reviewApi.get('1');

        expect(review.data).toStrictEqual(
            {
                review_id: 1,
                review_date: new Date("2024-08-05"),
                rating: 5,
                comment: "review comment 1",
                book: bookMockData,
                customer: customerMockData,
                book_id: 1,
                customer_id: 1
            });
    });

    test('will retrieve all reviews', async () => {
        let reviews = await reviewApi.getAll();

        expect(reviews.data).toStrictEqual(
            [{
                review_id: 1,
                review_date: new Date("2024-08-05"),
                rating: 5,
                comment: "review comment 1",
                book: bookMockData,
                customer: customerMockData,
                book_id: 1,
                customer_id: 1
            }]);
    });

    test('will saved the review', async () => {
        let review: Review = new Review();
        review.review_date= new Date("2024-08-05");
        review.rating= 5;
        review.comment= "review comment 2";
        review.book= bookMockData;
        review.customer= customerMockData;
        review.book_id = 1;
        review.customer_id = 1

        let savedReview = await reviewApi.post(review);

        expect(savedReview.data).toStrictEqual(
            {
                review_id: 2,
                review_date: new Date(),
                rating: 5,
                comment: "review comment 2",
                book: bookMockData,
                customer: customerMockData,
                book_id: 1,
                customer_id: 1
            });
    });

    test('will update the review', async () => {
        let review: Review = new Review();
        review.review_id = 2;
        review.review_date= new Date("2024-08-05");
        review.rating= 3;
        review.comment= "review updated comment 2";
        review.book= bookMockData;
        review.customer= customerMockData;
        review.book_id = 1;
        review.customer_id = 1

        let savedReview = await reviewApi.put(review);

        expect(savedReview.data).toStrictEqual(
            {
                review_id: 2,
                review_date: new Date("2024-08-05"),
                rating: 3,
                comment: "review updated comment 2",
                book: bookMockData,
                customer: customerMockData,
                book_id: 1,
                customer_id: 1
            });
    });

    test('will throw an error if customer is not found during insert operations', async () => {
        let review: Review = new Review();
        review.review_date= new Date("2024-08-05");
        review.rating= 2;
        review.comment= "review comment 2";
        review.book= bookMockData;
        review.customer= customerMockData;
        review.book_id = 1;
        review.customer_id = 2222

        let savedReview = await reviewApi.post(review);
        
        expect(savedReview.errorCode).toBe(400);
        expect(savedReview.error).toEqual('Customer not found');
    });

    test('will throw an error if book is not found during insert operations', async () => {
        let review: Review = new Review();
        review.review_date= new Date("2024-08-05");
        review.rating= 2;
        review.comment= "review comment 2";
        review.book= bookMockData;
        review.customer= customerMockData;
        review.book_id = 333333;
        review.customer_id = 1

        let savedReview = await reviewApi.post(review);
        
        expect(savedReview.errorCode).toBe(400);
        expect(savedReview.error).toEqual('Book not found');
    });

        
    it('should handle deleting a non-existent review', async () => {
        const nonExistentReviewId = 9999;
        let review = await reviewApi.delete(nonExistentReviewId)
        expect(review.error).toBe('Review not found')
        expect(review.errorCode).toBe(404);
    });

    it('should delete an existing review', async () => {
        await reviewApi.delete(2);
        const deletedReview = await reviewApi.get('2');
        expect(deletedReview.error).toBe('Review not found')
        expect(deletedReview.errorCode).toBe(404);
    });
});
