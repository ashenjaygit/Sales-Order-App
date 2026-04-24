using Application.DTOs;
using Application.Mapping;
using Application.Interfaces;
using AutoMapper;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services;

public class ReferenceDataService : IReferenceDataService
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public ReferenceDataService(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<ClientDto>> GetClientsAsync()
    {
        var clients = await _context.Clients.ToListAsync();
        return _mapper.Map<List<ClientDto>>(clients);
    }

    public async Task<List<ItemDto>> GetItemsAsync()
    {
        var items = await _context.Items.ToListAsync();
        return _mapper.Map<List<ItemDto>>(items);
    }
}
