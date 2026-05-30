using Microsoft.AspNetCore.Identity;
using RehabiliTrack_API.Models;

namespace RehabiliTrack_API.Infrastructure.Data
{
    public static class IdentitySeeder
    {
        public static async Task SeedUsersAndRolesAsync(IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = serviceProvider.GetRequiredService<RoleManager<ApplicationRole>>();

            // Create roles if they do not exist
            string[] roles = { "Admin", "Receptionist" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new ApplicationRole { Name = role });
                }
            }

            // Test user - Admin
            var adminEmail = "a@a";
            var existingAdmin = await userManager.FindByEmailAsync(adminEmail);

            if (existingAdmin == null)
            {
                var newAdmin = new ApplicationUser
                {
                    UserName = "admin",
                    Email = adminEmail,
                    EmailConfirmed = true
                };
                
                var result = await userManager.CreateAsync(newAdmin, "TestoweHaslo123!");

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(newAdmin, "Admin");
                }
            }


            // Test user - Receptionist
            var receptionistEmail = "r@r";
            var existingReceptionist = await userManager.FindByEmailAsync(receptionistEmail);

            if (existingReceptionist == null)
            {
                var newReceptionist = new ApplicationUser
                {
                    UserName = "receptionist",
                    Email = receptionistEmail,
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(newReceptionist, "TestoweHaslo123!");

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(newReceptionist, "Receptionist");
                }
            }
        }
    }
}