import Customer from "../../entities/customer";
import DataConnector from "../../interfaces/dataConnector";
import CustomerFilteringOptions from "../../interfaces/customerFilteringOptions";

export class MockCustomerRepositoryDataConnector implements DataConnector<Customer, CustomerFilteringOptions> {
    
    private mockCustomers: Customer[] = [
        {
            customer_id: 1,
            name: 'Customer 1',
            email: 'customer1@example.com',
            phone: '999-999-9999',
            join_date: new Date("2024-05-06"),
            reviews:[],
            orders:[]
        }
    ]; 

    async findById(filteringOptions: CustomerFilteringOptions): Promise<Customer | null> {
        const customer = this.mockCustomers.find(p => p.customer_id === filteringOptions.customer_id);
        return customer || null;
    }

    async getAll(): Promise<Customer[]> {
        return this.mockCustomers;
    } 

    async create(entity: Customer): Promise<Customer> {
        const newId = 2;
        let savedCustomer: Customer = {
            ...entity,
            customer_id: newId,
            reviews:[],
            orders:[]
        };
        this.mockCustomers.push(savedCustomer);
        return savedCustomer;
    }

    async update (entity: Customer): Promise<Customer> {
        const index = this.mockCustomers.findIndex(p => p.customer_id === entity.customer_id);

        if (index === -1) {
            throw new Error('Customer not found'); // Handle the case where the customer is not found
        }

        this.mockCustomers[index] = {
            ...this.mockCustomers[index],
            ...entity
        };
       
        return this.mockCustomers[index];
    }


    async delete (id: number): Promise<void> {
        const index = this.mockCustomers.findIndex(p => p.customer_id === id);

        if (index === -1) throw new Error('Customer not found');

        this.mockCustomers.splice(index, 1);
    }
}