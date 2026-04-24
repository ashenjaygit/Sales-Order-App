namespace Application.DTOs;

public class SalesOrderDto
{
    public int Id { get; set; }
    public string InvoiceNo { get; set; }
    public DateTime InvoiceDate { get; set; }
    public string ReferenceNo { get; set; }

    public int ClientId { get; set; }
    public string CustomerName { get; set; }

    public decimal TotalExcl { get; set; }
    public decimal TotalTax { get; set; }
    public decimal TotalIncl { get; set; }

    public List<SalesOrderItemDto> SalesOrderItems { get; set; } = new List<SalesOrderItemDto>();
}
