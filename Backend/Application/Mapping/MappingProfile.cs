using AutoMapper;
using Domain.Entities;
using Application.DTOs;

namespace Application.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<SalesOrder, SalesOrderDto>()
            .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => src.Client.CustomerName))
            .ReverseMap();

        CreateMap<SalesOrderItem, SalesOrderItemDto>()
            .ForMember(dest => dest.ItemCode, opt => opt.MapFrom(src => src.Item.ItemCode))
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Item.Description))
            .ReverseMap()
            .ForMember(dest => dest.Item, opt => opt.Ignore()); // Ignore entity nav property on way back
            
        CreateMap<Client, ClientDto>().ReverseMap();
        CreateMap<Item, ItemDto>().ReverseMap();
    }
}

public class ClientDto
{
    public int Id { get; set; }
    public string CustomerName { get; set; }
    public string Address1 { get; set; }
    public string Address2 { get; set; }
    public string Address3 { get; set; }
}

public class ItemDto
{
    public int Id { get; set; }
    public string ItemCode { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
}
