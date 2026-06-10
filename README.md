# RehabiliTrack – Rehabilitation Center Management System

This application was developed as a portfolio project to showcase my skills in cross-platform mobile app development (React Native / TypeScript) and building a modern, secure REST API (C# / .NET / CQRS).

## About the project
RehabiliTrack is a comprehensive system designed to facilitate the daily management of rehabilitation facilities. It enables the organization of appointments, management of staff (therapists) and rooms, as well as the coordination of multi-day rehabilitation stays for patients.

The main educational goal of this project was the practical application of architectural patterns (such as CQRS) on the backend side, and designing a seamless, secure client-server architecture as a full-stack project, connecting a .NET REST API with a React Native consumer.

## Technologies & Architecture
For this project, I chose a modern and highly sought-after technology stack, emphasizing security and performance:

### Frontend (Mobile) 
* **React Native** – building a cross-platform mobile application.
* **TypeScript** – strong typing of data models (DTOs) ensuring type safety and reducing runtime errors.
* **React Navigation** – handling smooth navigation (Stacks, route parameters, protected routes).
* **React Native Paper** – a consistent UI based on Material Design principles.
* **Context API & Encrypted Storage** – global application state management combined with secure local storage for JWT tokens.

### Backend (API)
* **C# & .NET 8** – a robust and high-performance server environment.
* **Entity Framework Core** – ORM for object-relational mapping (SQL Database).
* **MediatR** – implementation of the CQRS (Command Query Responsibility Segregation) pattern.
* **ASP.NET Core Identity & JWT** – secure authentication, token generation, and role management.

#### Query Architecture: Utilizing "flat" DTOs for write operations (POST/PUT - passing IDs) and nested DTOs (Nested JSONs) for read operations (GET - building full entity relations).

## Key Features
* **Authentication & RBAC (Role-Based Access Control):** Secure login system using JWT. The application conditionally renders UI elements and restricts navigation based on the user's role (e.g., only 'Admin' can register new system users or access infrastructure management screens).
* **Search, Filtering & Pagination:** Optimized list views utilizing server-side filtering and cursor/offset pagination. Features dynamic searching through lists (e.g., finding specific patients) and filtering appointments to maintain a clean, performant UI via `FlatList`.
* **Therapist Management:** Adding, editing (including roles), deleting, and displaying a list of employees using Dropdown Pickers that fetch dictionaries from the API.
* **Stays Management:** Creating multi-day stays with a defined maximum capacity. Date validation using an integrated native calendar (`react-native-date-picker`).
* **Stay Participations:** Junction table logic – dynamically assigning and enrolling patients to specific stays.
* **Appointments Management:** A full appointment scheduling flow connecting a Patient, Therapist, Rehab Room, and Treatment.
* **Dashboard Analytics:** A summary screen fetching parallel data to display current stay metrics, total patient counts, and today's therapy schedules.
## Screenshots
![RehabiliTrack MOBILE](readme-img/1.png)

## Running the project locally
### Prerequisites
* Node.js (v18+)
* Yarn or pnpm
* React Native environment setup (Android Studio / Xcode)
* .NET SDK

**Frontend Setup**
```bash
# Clone the repository
git clone https://github.com/YourUsername/RehabiliTrack.git

# Navigate to the mobile app folder
cd RehabiliTrack/mobile

# Install dependencies
pnpm install

# Run the app on Android
pnpm react-native run-android
```

**Backend Setup (API & Database)**

```bash
# Navigate to the API folder
cd RehabiliTrack/api

# 1. Start the database using Docker 
 docker-compose up -d

# 2. Apply Entity Framework migrations to create the database schema
dotnet ef database update

# 3. Run the server
dotnet run
```
