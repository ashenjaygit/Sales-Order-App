using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SalesOrdersController : ControllerBase
{
    private readonly ISalesOrderService _salesOrderService;

    public SalesOrdersController(ISalesOrderService salesOrderService)
    {
        _salesOrderService = salesOrderService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _salesOrderService.GetAllOrdersAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var order = await _salesOrderService.GetOrderByIdAsync(id);
        if (order == null) return NotFound();
        return Ok(order);
    }

    [HttpPost]
    public async Task<IActionResult> Create(SalesOrderDto orderDto)
    {
        var createdOrder = await _salesOrderService.CreateOrderAsync(orderDto);
        return CreatedAtAction(nameof(GetById), new { id = createdOrder.Id }, createdOrder);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, SalesOrderDto orderDto)
    {
        var updatedOrder = await _salesOrderService.UpdateOrderAsync(id, orderDto);
        if (updatedOrder == null) return NotFound();
        return Ok(updatedOrder);
    }
}
