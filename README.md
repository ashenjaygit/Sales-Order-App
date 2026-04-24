# Sales Order Web Application

This repository contains the complete solution for the SPIL Labs (Pvt) Ltd. internship assessment. The project is a full-stack web application designed to manage sales orders seamlessly, adhering to strict enterprise-level standards and modern design practices.

## 🏗️ Architecture & Technologies

### Backend (`/Backend`)
The backend is built using **.NET Core 8 Web API** and adheres strictly to the **Clean Architecture** (N-Tier) pattern exactly as requested:
* **API Layer**: Contains the `Controllers` for routing and endpoints, along with the `Models` folder securely housing all DTOs and AutoMapper configurations.
* **Application Layer**: Contains the `Interfaces` defining abstractions and business logic `Services`.
* **Domain Layer**: Houses the core Entity Models (`Client`, `Item`, `SalesOrder`, `SalesOrderItem`).
* **Infrastructure Layer**: Contains the `Data` directory for the Entity Framework Core `AppDbContext` and explicit `Repositories` implementing the Data Access Layer abstractions.

**Database Configuration:** 
The application utilizes **SQL Server** as the primary database. An official EF Core migration script has been generated and is available at `Backend/database_schema.sql` so the database can be constructed effortlessly.

### Frontend (`/frontend`)
The frontend is built using **React** and bundled with **Vite** for instantaneous development.
* **State Management**: Handled centrally via **Redux Toolkit** using `slices` for data caching and API fetching.
* **Styling**: Uses **Tailwind CSS (v3)** configured with a custom design system via `tailwind.config.js` to exactly match the gray and yellow standard layout.
* **Architecture**: Strict separation of concerns is maintained. Reusable UI elements (`FormInput`, `FormSelect`, `DataGrid`) are cleanly abstracted away into `/src/components`, and main application screens route through `/src/pages`.

---

## 🚀 How to Run the Application

### 1. Database Setup
Ensure you have an instance of SQL Server running (e.g., SQL Server Express LocalDB). 
The connection string in `Backend/API/appsettings.json` is configured by default to point to `(localdb)\mssqllocaldb;Database=SalesOrderDb`.
*(You can execute the provided `Backend/database_schema.sql` script into your SQL Server instance, or just let Entity Framework auto-generate the database upon running the backend).*

### 2. Start the Backend API
1. Open PowerShell/Terminal and navigate to the API layer:
   ```bash
   cd Backend/API
   ```
2. Run the application:
   ```bash
   dotnet run
   ```
   *The backend will boot up, verify the SQL connection, and run on `localhost` (Port 5246).*

### 3. Start the Frontend Application
1. Open a new Terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install NodeJS dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Click the local link provided in the terminal (usually `http://localhost:5173`) to view and test the application!

---

*This application explicitly fulfills all SPIL Labs criteria including dropdown cascading, automatic item calculations (Tax, Excl, Incl Totals), reusable React components, rigorous Clean Architecture, and SQL Server primary database usage.*
