import Customer from "../../entities/customer";
import { MockCustomerRepositoryDataConnector } from "./mockCustomerRepositoryDataConnector";
import CustomerRepository from "./customerRepository";

describe.skip('Customer Api', () => {
    let customerApi: any;

    beforeAll(() => {
        customerApi = new CustomerRepository(new MockCustomerRepositoryDataConnector());
    });

    test('will throw an error if id is not a number', async () => {
        let customer = await customerApi.get('abcd');

        expect(customer.error).toBe('ID must be a number')
        expect(customer.errorCode).toBe(400);
    });

    test('will throw an error if id is less than 0', async () => {
        let customer = await customerApi.get('-1');

        expect(customer.error).toBe('Customer ID cannot be less than 0')
        expect(customer.errorCode).toBe(400);
    });

    test('will throw an error if id is not found', async () => {
        let customer = await customerApi.get('2');

        expect(customer.error).toBe('Customer not found')
        expect(customer.errorCode).toBe(404);
    });

    test('a customer is returned if a positive id is provided', async () => {
        let customer = await customerApi.get('1');

        expect(customer.data).toStrictEqual(
            {
                customer_id: 1,
                name: 'customer 1',
                email: 'customer1@example.com',
                phone: '999-999-9999',
                join_date: new Date(),
                reviews:[],
                orders: []
            });
    });

    test('will retrieve all customers', async () => {
        let customers = await customerApi.getAll();

        expect(customers.data).toStrictEqual(
            [{
                customer_id: 1,
                name: 'customer 1',
                email: 'customer1@example.com',
                phone: '999-999-9999',
                join_date: new Date(),
                reviews:[],
                orders: []
            }]);
    });

    test('will saved the customer', async () => {
        let customer: Customer = new Customer();
        customer.name = "customer 2";
        customer.email = "customer2@example.com";
        customer.phone = '999-999-9999';

        let savedCustomer = await customerApi.post(customer);

        expect(savedCustomer.data).toStrictEqual(
            {
                customer_id: 2,
                name: 'customer 2',
                email: 'customer2@example.com',
                phone: '999-999-9999',
                join_date: new Date(),
                reviews:[],
                orders: []
            });
    });

    test('will update the customer', async () => {
        let customer: Customer = new Customer();
        customer.customer_id = 2;
        customer.name = "customer 2 updated";
        customer.email = "customer2@example.com";
        customer.phone = '999-999-9999';

        let savedCustomer = await customerApi.put(customer);
        
        expect(savedCustomer.data).toStrictEqual(
            {
                customer_id: 2,
                name: 'customer 2 updated',
                email: 'customer2@example.com',
                phone: '999-999-9999',
                join_date: new Date(),
                reviews:[],
                orders: []
            });
    });

        
    it('should handle deleting a non-existent customer', async () => {
        const nonExistentCustomerId = 9999;
        let customer = await customerApi.delete(nonExistentCustomerId)
        expect(customer.error).toBe('Customer not found')
        expect(customer.errorCode).toBe(404);
    });

    it('should delete an existing customer', async () => {
        await customerApi.delete(2);
        const deletedCustomer = await customerApi.get('2');
        expect(deletedCustomer.error).toBe('Customer not found')
        expect(deletedCustomer.errorCode).toBe(404);
    });
});
