using AutoMapper;
using Domain.Entities;
using API.Models;

namespace API.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<SalesOrder, SalesOrderDto>()
            .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => src.Client != null ? src.Client.CustomerName : string.Empty))
            .ReverseMap();

        CreateMap<SalesOrderItem, SalesOrderItemDto>()
            .ForMember(dest => dest.ItemCode, opt => opt.MapFrom(src => src.Item != null ? src.Item.ItemCode : string.Empty))
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Item != null ? src.Item.Description : string.Empty))
            .ReverseMap()
            .ForMember(dest => dest.Item, opt => opt.Ignore()); 
            
        CreateMap<Client, ClientDto>().ReverseMap();
        CreateMap<Item, ItemDto>().ReverseMap();
    }
}
