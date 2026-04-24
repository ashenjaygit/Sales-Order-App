using Application.Interfaces;
using Domain.Entities;

namespace Application.Services;

public class ReferenceDataService : IReferenceDataService
{
    private readonly IReferenceDataRepository _repository;

    public ReferenceDataService(IReferenceDataRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<Client>> GetClientsAsync()
    {
        return await _repository.GetClientsAsync();
    }

    public async Task<List<Item>> GetItemsAsync()
    {
        return await _repository.GetItemsAsync();
    }
}
