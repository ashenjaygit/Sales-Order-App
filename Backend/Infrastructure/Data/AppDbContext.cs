using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Client> Clients { get; set; }
    public DbSet<Item> Items { get; set; }
    public DbSet<SalesOrder> SalesOrders { get; set; }
    public DbSet<SalesOrderItem> SalesOrderItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Decimal precision configurations
        modelBuilder.Entity<Item>().Property(i => i.Price).HasColumnType("decimal(18,2)");
        
        modelBuilder.Entity<SalesOrder>().Property(o => o.TotalExcl).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<SalesOrder>().Property(o => o.TotalTax).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<SalesOrder>().Property(o => o.TotalIncl).HasColumnType("decimal(18,2)");
        
        modelBuilder.Entity<SalesOrderItem>().Property(i => i.TaxRate).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<SalesOrderItem>().Property(i => i.ExclAmount).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<SalesOrderItem>().Property(i => i.TaxAmount).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<SalesOrderItem>().Property(i => i.InclAmount).HasColumnType("decimal(18,2)");

        // Seed data
        modelBuilder.Entity<Client>().HasData(
            new Client { Id = 1, CustomerName = "John Doe", Address1 = "123 Main St", Address2 = "Apt 4B", Address3 = "New York, NY" },
            new Client { Id = 2, CustomerName = "Jane Smith", Address1 = "456 Oak Ave", Address2 = "", Address3 = "Los Angeles, CA" },
            new Client { Id = 3, CustomerName = "Tech Corp", Address1 = "789 Pine Road", Address2 = "Building C", Address3 = "Austin, TX" }
        );

        modelBuilder.Entity<Item>().HasData(
            new Item { Id = 1, ItemCode = "ITM-001", Description = "Laptop Pro 15", Price = 1200.00m },
            new Item { Id = 2, ItemCode = "ITM-002", Description = "Wireless Mouse", Price = 25.50m },
            new Item { Id = 3, ItemCode = "ITM-003", Description = "Mechanical Keyboard", Price = 85.00m },
            new Item { Id = 4, ItemCode = "ITM-004", Description = "USB-C Hub", Price = 45.00m },
            new Item { Id = 5, ItemCode = "ITM-005", Description = "4K Monitor", Price = 350.00m }
        );
    }
}
