using Domain.Entities;

namespace Application.Interfaces;

public interface IReferenceDataRepository
{
    Task<List<Client>> GetClientsAsync();
    Task<List<Item>> GetItemsAsync();
}

public interface ISalesOrderRepository
{
    Task<List<SalesOrder>> GetAllOrdersAsync();
    Task<SalesOrder> GetOrderByIdAsync(int id);
    Task<SalesOrder> CreateOrderAsync(SalesOrder order);
    Task<SalesOrder> UpdateOrderAsync(SalesOrder order);
}
