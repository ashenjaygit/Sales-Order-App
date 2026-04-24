using Application.Interfaces;
using Domain.Entities;

namespace Application.Services;

public class SalesOrderService : ISalesOrderService
{
    private readonly ISalesOrderRepository _repository;

    public SalesOrderService(ISalesOrderRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<SalesOrder>> GetAllOrdersAsync()
    {
        return await _repository.GetAllOrdersAsync();
    }

    public async Task<SalesOrder> GetOrderByIdAsync(int id)
    {
        return await _repository.GetOrderByIdAsync(id);
    }

    public async Task<SalesOrder> CreateOrderAsync(SalesOrder order)
    {
        return await _repository.CreateOrderAsync(order);
    }

    public async Task<SalesOrder> UpdateOrderAsync(int id, SalesOrder order)
    {
        return await _repository.UpdateOrderAsync(order);
    }
}
