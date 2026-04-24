namespace Domain.Entities;

public class SalesOrder
{
    public int Id { get; set; }
    public string InvoiceNo { get; set; }
    public DateTime InvoiceDate { get; set; }
    public string ReferenceNo { get; set; }

    public int ClientId { get; set; }
    public Client Client { get; set; }

    public decimal TotalExcl { get; set; }
    public decimal TotalTax { get; set; }
    public decimal TotalIncl { get; set; }

    public ICollection<SalesOrderItem> SalesOrderItems { get; set; } = new List<SalesOrderItem>();
}
