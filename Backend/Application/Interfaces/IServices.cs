using Domain.Entities;

namespace Application.Interfaces;

public interface IReferenceDataService
{
    Task<List<Client>> GetClientsAsync();
    Task<List<Item>> GetItemsAsync();
}

public interface ISalesOrderService
{
    Task<List<SalesOrder>> GetAllOrdersAsync();
    Task<SalesOrder> GetOrderByIdAsync(int id);
    Task<SalesOrder> CreateOrderAsync(SalesOrder order);
    Task<SalesOrder> UpdateOrderAsync(int id, SalesOrder order);
}
