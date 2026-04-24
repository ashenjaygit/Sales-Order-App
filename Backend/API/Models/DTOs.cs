namespace API.Models;

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

public class SalesOrderItemDto
{
    public int Id { get; set; }
    public int SalesOrderId { get; set; }

    public int ItemId { get; set; }
    public string ItemCode { get; set; }
    public string Description { get; set; }

    public string Note { get; set; }
    public int Quantity { get; set; }
    public decimal TaxRate { get; set; }

    public decimal ExclAmount { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal InclAmount { get; set; }
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
