IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [Clients] (
    [Id] int NOT NULL IDENTITY,
    [CustomerName] nvarchar(max) NOT NULL,
    [Address1] nvarchar(max) NOT NULL,
    [Address2] nvarchar(max) NOT NULL,
    [Address3] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_Clients] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Items] (
    [Id] int NOT NULL IDENTITY,
    [ItemCode] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [Price] decimal(18,2) NOT NULL,
    CONSTRAINT [PK_Items] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [SalesOrders] (
    [Id] int NOT NULL IDENTITY,
    [InvoiceNo] nvarchar(max) NOT NULL,
    [InvoiceDate] datetime2 NOT NULL,
    [ReferenceNo] nvarchar(max) NOT NULL,
    [ClientId] int NOT NULL,
    [TotalExcl] decimal(18,2) NOT NULL,
    [TotalTax] decimal(18,2) NOT NULL,
    [TotalIncl] decimal(18,2) NOT NULL,
    CONSTRAINT [PK_SalesOrders] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_SalesOrders_Clients_ClientId] FOREIGN KEY ([ClientId]) REFERENCES [Clients] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [SalesOrderItems] (
    [Id] int NOT NULL IDENTITY,
    [SalesOrderId] int NOT NULL,
    [ItemId] int NOT NULL,
    [Note] nvarchar(max) NOT NULL,
    [Quantity] int NOT NULL,
    [TaxRate] decimal(18,2) NOT NULL,
    [ExclAmount] decimal(18,2) NOT NULL,
    [TaxAmount] decimal(18,2) NOT NULL,
    [InclAmount] decimal(18,2) NOT NULL,
    CONSTRAINT [PK_SalesOrderItems] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_SalesOrderItems_Items_ItemId] FOREIGN KEY ([ItemId]) REFERENCES [Items] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_SalesOrderItems_SalesOrders_SalesOrderId] FOREIGN KEY ([SalesOrderId]) REFERENCES [SalesOrders] ([Id]) ON DELETE CASCADE
);
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Address1', N'Address2', N'Address3', N'CustomerName') AND [object_id] = OBJECT_ID(N'[Clients]'))
    SET IDENTITY_INSERT [Clients] ON;
INSERT INTO [Clients] ([Id], [Address1], [Address2], [Address3], [CustomerName])
VALUES (1, N'123 Main St', N'Apt 4B', N'New York, NY', N'John Doe'),
(2, N'456 Oak Ave', N'', N'Los Angeles, CA', N'Jane Smith'),
(3, N'789 Pine Road', N'Building C', N'Austin, TX', N'Tech Corp');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Address1', N'Address2', N'Address3', N'CustomerName') AND [object_id] = OBJECT_ID(N'[Clients]'))
    SET IDENTITY_INSERT [Clients] OFF;
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Description', N'ItemCode', N'Price') AND [object_id] = OBJECT_ID(N'[Items]'))
    SET IDENTITY_INSERT [Items] ON;
INSERT INTO [Items] ([Id], [Description], [ItemCode], [Price])
VALUES (1, N'Laptop Pro 15', N'ITM-001', 1200.0),
(2, N'Wireless Mouse', N'ITM-002', 25.5),
(3, N'Mechanical Keyboard', N'ITM-003', 85.0),
(4, N'USB-C Hub', N'ITM-004', 45.0),
(5, N'4K Monitor', N'ITM-005', 350.0);
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Description', N'ItemCode', N'Price') AND [object_id] = OBJECT_ID(N'[Items]'))
    SET IDENTITY_INSERT [Items] OFF;
GO

CREATE INDEX [IX_SalesOrderItems_ItemId] ON [SalesOrderItems] ([ItemId]);
GO

CREATE INDEX [IX_SalesOrderItems_SalesOrderId] ON [SalesOrderItems] ([SalesOrderId]);
GO

CREATE INDEX [IX_SalesOrders_ClientId] ON [SalesOrders] ([ClientId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260424185334_InitialCreate', N'8.0.4');
GO

COMMIT;
GO

