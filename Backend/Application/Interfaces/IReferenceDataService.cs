using Application.DTOs;
using Application.Mapping;

namespace Application.Interfaces;

public interface IReferenceDataService
{
    Task<List<ClientDto>> GetClientsAsync();
    Task<List<ItemDto>> GetItemsAsync();
}
