using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReferenceDataController : ControllerBase
{
    private readonly IReferenceDataService _referenceDataService;

    public ReferenceDataController(IReferenceDataService referenceDataService)
    {
        _referenceDataService = referenceDataService;
    }

    [HttpGet("clients")]
    public async Task<IActionResult> GetClients()
    {
        return Ok(await _referenceDataService.GetClientsAsync());
    }

    [HttpGet("items")]
    public async Task<IActionResult> GetItems()
    {
        return Ok(await _referenceDataService.GetItemsAsync());
    }
}
