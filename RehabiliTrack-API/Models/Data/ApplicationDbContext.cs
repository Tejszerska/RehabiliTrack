using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace RehabiliTrack_API.Models.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Stay> Stays { get; set; }
        public DbSet<StayParticipation> StayParticipations { get; set; }
        public DbSet<Therapist> Therapists { get; set; }
        public DbSet<TherapistRole> TherapistRoles { get; set; }
        public DbSet<Treatment> Treatments { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<RehabRoom> RehabRooms { get; set; }
        public DbSet<RoomType> RoomTypes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // anulling cascade delete for all relationships in the model
            foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.Restrict;
            }

            // saves enum as name instead of number in database

            modelBuilder.Entity<Appointment>()
                .Property(e => e.Status)
                .HasConversion<string>();

            SeedData(modelBuilder);

        }
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            // get all tracked entities that are being added, modified, or deleted
            var entries = ChangeTracker.Entries();

            // get current UTC time once to use for all entities in this save operation (to ensure consistency)
            var utcNow = DateTime.UtcNow;

            foreach (var entry in entries)
            {
                // check if the entity is a BaseEntity (or derived from it) to apply common logic for CreatedAt, UpdatedAt, and IsActive
                if (entry.Entity is BaseEntity baseEntity)
                {
                    switch (entry.State)
                    {
                        // CREATE
                        case EntityState.Added:
                            baseEntity.CreatedAt = utcNow;
                            baseEntity.UpdatedAt = utcNow;
                            baseEntity.IsActive = true;
                            break;

                        // UPDATE
                        case EntityState.Modified:
                            baseEntity.UpdatedAt = utcNow;
                            break;

                        // SOFT DELETE
                        case EntityState.Deleted:
                            // Change the state back to Modified to prevent physical deletion from the database (DELETE command)
                            entry.State = EntityState.Modified;

                            // Set the record as inactive and update the modification date
                            baseEntity.IsActive = false;
                            baseEntity.UpdatedAt = utcNow;
                            break;
                    }
                }
            }

            return base.SaveChangesAsync(cancellationToken);
        }

        private static void SeedData(ModelBuilder modelBuilder)
        {
            // A common, fixed date for all seeds (to prevent migration issues based on current time)
            var seedDate = new DateTime(2026, 1, 1, 12, 0, 0, DateTimeKind.Utc);

            // 1. DICTIONARIES: ROOM TYPES (3)
            modelBuilder.Entity<RoomType>().HasData(
                new RoomType { Id = 1, Name = "Kinesitherapy", CreatedAt = seedDate, UpdatedAt = seedDate, IsActive = true },
                new RoomType { Id = 2, Name = "Hydrotherapy", CreatedAt = seedDate, UpdatedAt = seedDate, IsActive = true },
                new RoomType { Id = 3, Name = "Massage", CreatedAt = seedDate, UpdatedAt = seedDate, IsActive = true }
            );

            // 2. DICTIONARIES: THERAPIST ROLES (3)
            modelBuilder.Entity<TherapistRole>().HasData(
                new TherapistRole { Id = 1, Name = "Physiotherapist", CreatedAt = seedDate, UpdatedAt = seedDate, IsActive = true },
                new TherapistRole { Id = 2, Name = "Massage Therapist", CreatedAt = seedDate, UpdatedAt = seedDate, IsActive = true },
                new TherapistRole { Id = 3, Name = "Occupational Therapist", CreatedAt = seedDate, UpdatedAt = seedDate, IsActive = true }
            );

            // 3. STAYS (5)
            modelBuilder.Entity<Stay>().HasData(
                new Stay { Id = 1, Name = "Spring Stay 2026", StartDate = new DateTime(2026, 3, 1), EndDate = new DateTime(2026, 3, 14), MaxCapacity = 20, CreatedAt = seedDate, UpdatedAt = seedDate, IsActive = true },
                new Stay { Id = 2, Name = "Summer Stay 2026", StartDate = new DateTime(2026, 7, 1), EndDate = new DateTime(2026, 7, 14), MaxCapacity = 20, CreatedAt = seedDate, UpdatedAt = seedDate, IsActive = true },
                new Stay { Id = 3, Name = "Autumn Stay 2026", StartDate = new DateTime(2026, 10, 1), EndDate = new DateTime(2026, 10, 14), MaxCapacity = 20, CreatedAt = seedDate, UpdatedAt = seedDate, IsActive = true },
                new Stay { Id = 4, Name = "Winter Stay 2026", StartDate = new DateTime(2026, 12, 1), EndDate = new DateTime(2026, 12, 14), MaxCapacity = 20, CreatedAt = seedDate, UpdatedAt = seedDate, IsActive = true },
                new Stay { Id = 5, Name = "New Year Stay 2027", StartDate = new DateTime(2027, 1, 2), EndDate = new DateTime(2027, 1, 15), MaxCapacity = 20, CreatedAt = seedDate, UpdatedAt = seedDate, IsActive = true }
            );

            // 4. TREATMENTS (5)
            modelBuilder.Entity<Treatment>().HasData(
                new Treatment { Id = 1, Name = "Classic Massage", DurationMinutes = 30, CreatedAt = seedDate, UpdatedAt = seedDate, IsActive = true },
                new Treatment { Id = 2, Name = "Cryotherapy", DurationMinutes = 15, CreatedAt = seedDate, UpdatedAt = seedDate, IsActive = true },
                new Treatment { Id = 3, Name = "Laser Therapy", DurationMinutes = 15, CreatedAt = seedDate, UpdatedAt = seedDate, IsActive = true },
                new Treatment { Id = 4, Name = "Pearl Bath", DurationMinutes = 20, CreatedAt = seedDate, UpdatedAt = seedDate, IsActive = true },
                new Treatment { Id = 5, Name = "Individual Exercises", DurationMinutes = 45, CreatedAt = seedDate, UpdatedAt = seedDate, IsActive = true }
            );

            // 5. REHAB ROOMS (5) - Assigned to specific RoomTypeId
            modelBuilder.Entity<RehabRoom>().HasData(
                new RehabRoom { Id = 1, RoomNumber = "101", Name = "Main Gym Hall", Capacity = 10, RoomTypeId = 1, CreatedAt = seedDate, UpdatedAt = seedDate, IsActive = true },
                new RehabRoom { Id = 2, RoomNumber = "102", Name = "Massage Parlor A", Capacity = 1, RoomTypeId = 3, CreatedAt = seedDate, UpdatedAt = seedDate, IsActive = true },
                new RehabRoom { Id = 3, RoomNumber = "103", Name = "Massage Parlor B", Capacity = 1, RoomTypeId = 3, CreatedAt = seedDate, UpdatedAt = seedDate, IsActive = true },
                new RehabRoom { Id = 4, RoomNumber = "201", Name = "Rehabilitation Pool", Capacity = 8, RoomTypeId = 2, CreatedAt = seedDate, UpdatedAt = seedDate, IsActive = true },
                new RehabRoom { Id = 5, RoomNumber = "202", Name = "Whirlpool Tubs", Capacity = 4, RoomTypeId = 2, CreatedAt = seedDate, UpdatedAt = seedDate, IsActive = true }
            );

            // 6. THERAPISTS (5) - Assigned to specific TherapistRoleId
            modelBuilder.Entity<Therapist>().HasData(
                new Therapist { Id = 1, FirstName = "Jan", LastName = "Kowalski", LicenseNumber = "1234567", PhoneNumber = "111222333", TherapistRoleId = 1, CreatedAt = seedDate, UpdatedAt = seedDate, IsActive = true },
                new Therapist { Id = 2, FirstName = "Anna", LastName = "Nowak", LicenseNumber = "2234567", PhoneNumber = "222333444", TherapistRoleId = 2, CreatedAt = seedDate, UpdatedAt = seedDate, IsActive = true },
                new Therapist { Id = 3, FirstName = "Piotr", LastName = "Wiśniewski", LicenseNumber = "3234567", PhoneNumber = "333444555", TherapistRoleId = 1, CreatedAt = seedDate, UpdatedAt = seedDate, IsActive = true },
                new Therapist { Id = 4, FirstName = "Maria", LastName = "Wójcik", LicenseNumber = "4234567", PhoneNumber = "444555666", TherapistRoleId = 3, CreatedAt = seedDate, UpdatedAt = seedDate, IsActive = true },
                new Therapist { Id = 5, FirstName = "Tomasz", LastName = "Kamiński", LicenseNumber = "5234567", PhoneNumber = "555666777", TherapistRoleId = 2, CreatedAt = seedDate, UpdatedAt = seedDate, IsActive = true }
            );

            // 7. PATIENTS (5)
            modelBuilder.Entity<Patient>().HasData(
                new Patient { Id = 1, FirstName = "Adam", LastName = "Zieliński", Pesel = "80010112345", PhoneNumber = "600100200", CreatedAt = seedDate, UpdatedAt = seedDate, IsActive = true },
                new Patient { Id = 2, FirstName = "Ewa", LastName = "Szymańska", Pesel = "92020254321", PhoneNumber = "600200300", CreatedAt = seedDate, UpdatedAt = seedDate, IsActive = true },
                new Patient { Id = 3, FirstName = "Michał", LastName = "Woźniak", Pesel = "75030398765", PhoneNumber = "600300400", CreatedAt = seedDate, UpdatedAt = seedDate, IsActive = true },
                new Patient { Id = 4, FirstName = "Karolina", LastName = "Dąbrowska", Pesel = "88040411223", PhoneNumber = "600400500", CreatedAt = seedDate, UpdatedAt = seedDate, IsActive = true },
                new Patient { Id = 5, FirstName = "Krzysztof", LastName = "Kozłowski", Pesel = "65050533445", PhoneNumber = "600500600", CreatedAt = seedDate, UpdatedAt = seedDate, IsActive = true }
            );
        }
    }
}