using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ReferenceDataRepository : IReferenceDataRepository
{
    private readonly AppDbContext _context;

    public ReferenceDataRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Client>> GetClientsAsync()
    {
        return await _context.Clients.ToListAsync();
    }

    public async Task<List<Item>> GetItemsAsync()
    {
        return await _context.Items.ToListAsync();
    }
}
