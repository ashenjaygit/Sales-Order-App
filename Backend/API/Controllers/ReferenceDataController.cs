using Application.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using API.Models;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReferenceDataController : ControllerBase
{
    private readonly IReferenceDataService _referenceDataService;
    private readonly IMapper _mapper;

    public ReferenceDataController(IReferenceDataService referenceDataService, IMapper mapper)
    {
        _referenceDataService = referenceDataService;
        _mapper = mapper;
    }

    [HttpGet("clients")]
    public async Task<IActionResult> GetClients()
    {
        var clients = await _referenceDataService.GetClientsAsync();
        return Ok(_mapper.Map<List<ClientDto>>(clients));
    }

    [HttpGet("items")]
    public async Task<IActionResult> GetItems()
    {
        var items = await _referenceDataService.GetItemsAsync();
        return Ok(_mapper.Map<List<ItemDto>>(items));
    }
}
