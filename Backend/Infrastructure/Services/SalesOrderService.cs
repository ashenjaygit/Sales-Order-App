using Application.DTOs;
using Application.Mapping;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Infrastructure.Services;

public class SalesOrderService : ISalesOrderService
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public SalesOrderService(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<SalesOrderDto>> GetAllOrdersAsync()
    {
        var orders = await _context.SalesOrders
            .Include(o => o.Client)
            .Include(o => o.SalesOrderItems)
                .ThenInclude(i => i.Item)
            .OrderByDescending(o => o.InvoiceDate)
            .ToListAsync();
            
        return _mapper.Map<List<SalesOrderDto>>(orders);
    }

    public async Task<SalesOrderDto> GetOrderByIdAsync(int id)
    {
        var order = await _context.SalesOrders
            .Include(o => o.Client)
            .Include(o => o.SalesOrderItems)
                .ThenInclude(i => i.Item)
            .FirstOrDefaultAsync(o => o.Id == id);
            
        if (order == null) return null;
        return _mapper.Map<SalesOrderDto>(order);
    }

    public async Task<SalesOrderDto> CreateOrderAsync(SalesOrderDto orderDto)
    {
        var order = _mapper.Map<SalesOrder>(orderDto);
        
        // Ensure nav properties are not tracked as new entities if we just pass IDs
        order.Client = null; 
        foreach(var item in order.SalesOrderItems) { item.Item = null; item.SalesOrder = null; }

        _context.SalesOrders.Add(order);
        await _context.SaveChangesAsync();

        return await GetOrderByIdAsync(order.Id);
    }

    public async Task<SalesOrderDto> UpdateOrderAsync(int id, SalesOrderDto orderDto)
    {
        var existingOrder = await _context.SalesOrders
            .Include(o => o.SalesOrderItems)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (existingOrder == null) return null;

        // Update properties
        existingOrder.InvoiceDate = orderDto.InvoiceDate;
        existingOrder.InvoiceNo = orderDto.InvoiceNo;
        existingOrder.ReferenceNo = orderDto.ReferenceNo;
        existingOrder.ClientId = orderDto.ClientId;
        existingOrder.TotalExcl = orderDto.TotalExcl;
        existingOrder.TotalTax = orderDto.TotalTax;
        existingOrder.TotalIncl = orderDto.TotalIncl;

        // Update items (simplified approach: remove all and recreate for demo purposes)
        _context.SalesOrderItems.RemoveRange(existingOrder.SalesOrderItems);
        
        var newItems = _mapper.Map<List<SalesOrderItem>>(orderDto.SalesOrderItems);
        foreach(var ni in newItems) { ni.Item = null; ni.SalesOrderId = id; }
        
        existingOrder.SalesOrderItems = newItems;

        await _context.SaveChangesAsync();
        return await GetOrderByIdAsync(id);
    }
}
