using Application.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using API.Models;
using Domain.Entities;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SalesOrdersController : ControllerBase
{
    private readonly ISalesOrderService _salesOrderService;
    private readonly IMapper _mapper;

    public SalesOrdersController(ISalesOrderService salesOrderService, IMapper mapper)
    {
        _salesOrderService = salesOrderService;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var orders = await _salesOrderService.GetAllOrdersAsync();
        return Ok(_mapper.Map<List<SalesOrderDto>>(orders));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var order = await _salesOrderService.GetOrderByIdAsync(id);
        if (order == null) return NotFound();
        return Ok(_mapper.Map<SalesOrderDto>(order));
    }

    [HttpPost]
    public async Task<IActionResult> Create(SalesOrderDto orderDto)
    {
        var entity = _mapper.Map<SalesOrder>(orderDto);
        var createdOrder = await _salesOrderService.CreateOrderAsync(entity);
        return CreatedAtAction(nameof(GetById), new { id = createdOrder.Id }, _mapper.Map<SalesOrderDto>(createdOrder));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, SalesOrderDto orderDto)
    {
        orderDto.Id = id;
        var entity = _mapper.Map<SalesOrder>(orderDto);
        var updatedOrder = await _salesOrderService.UpdateOrderAsync(id, entity);
        if (updatedOrder == null) return NotFound();
        return Ok(_mapper.Map<SalesOrderDto>(updatedOrder));
    }
}
