using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RehabiliTrack_API.Models
{
    // table linking Patient and Stay, representing the participation of a patient in a stay
    public class StayParticipation : BaseEntity
    {
        [Required(ErrorMessage = "Patient ID is required.")]
        [ForeignKey("Patient")] // pointing to the Patient navigation property below
        public int PatientId { get; set; }
        public virtual Patient? Patient { get; set; }

        [Required(ErrorMessage = "Stay ID is required.")]
        [ForeignKey("Stay")] 
        public int StayId { get; set; }
        public virtual Stay? Stay { get; set; }

        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }
}