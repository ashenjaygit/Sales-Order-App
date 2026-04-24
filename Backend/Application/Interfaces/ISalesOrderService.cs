using Application.DTOs;

namespace Application.Interfaces;

public interface ISalesOrderService
{
    Task<List<SalesOrderDto>> GetAllOrdersAsync();
    Task<SalesOrderDto> GetOrderByIdAsync(int id);
    Task<SalesOrderDto> CreateOrderAsync(SalesOrderDto orderDto);
    Task<SalesOrderDto> UpdateOrderAsync(int id, SalesOrderDto orderDto);
}
