using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class SalesOrderRepository : ISalesOrderRepository
{
    private readonly AppDbContext _context;

    public SalesOrderRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<SalesOrder>> GetAllOrdersAsync()
    {
        return await _context.SalesOrders
            .Include(o => o.Client)
            .Include(o => o.SalesOrderItems)
                .ThenInclude(i => i.Item)
            .OrderByDescending(o => o.InvoiceDate)
            .ToListAsync();
    }

    public async Task<SalesOrder> GetOrderByIdAsync(int id)
    {
        return await _context.SalesOrders
            .Include(o => o.Client)
            .Include(o => o.SalesOrderItems)
                .ThenInclude(i => i.Item)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<SalesOrder> CreateOrderAsync(SalesOrder order)
    {
        order.Client = null; 
        foreach(var item in order.SalesOrderItems) { item.Item = null; item.SalesOrder = null; }

        _context.SalesOrders.Add(order);
        await _context.SaveChangesAsync();

        return await GetOrderByIdAsync(order.Id);
    }

    public async Task<SalesOrder> UpdateOrderAsync(SalesOrder order)
    {
        var existingOrder = await _context.SalesOrders
            .Include(o => o.SalesOrderItems)
            .FirstOrDefaultAsync(o => o.Id == order.Id);

        if (existingOrder == null) return null;

        existingOrder.InvoiceDate = order.InvoiceDate;
        existingOrder.InvoiceNo = order.InvoiceNo;
        existingOrder.ReferenceNo = order.ReferenceNo;
        existingOrder.ClientId = order.ClientId;
        existingOrder.TotalExcl = order.TotalExcl;
        existingOrder.TotalTax = order.TotalTax;
        existingOrder.TotalIncl = order.TotalIncl;

        _context.SalesOrderItems.RemoveRange(existingOrder.SalesOrderItems);
        
        foreach(var ni in order.SalesOrderItems) { ni.Item = null; ni.SalesOrderId = order.Id; }
        
        existingOrder.SalesOrderItems = order.SalesOrderItems;

        await _context.SaveChangesAsync();
        return await GetOrderByIdAsync(order.Id);
    }
}
