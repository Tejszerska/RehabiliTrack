using Microsoft.AspNetCore.Identity;

namespace RehabiliTrack_API.Models
{
    public class ApplicationUser : IdentityUser<int>
    {
        // Id, Username, PasswordHash included from IdentityUser
        public int? PersonalId; // Optional personal ID for connecting with Patient or Therapist records
    }
}
