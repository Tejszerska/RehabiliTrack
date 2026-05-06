namespace RehabiliTrack_API.Features.Stays.Queries.GetStayById
{
    public class StayDetailsDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Occupancy { get; set; }

        public List<StayPatientDto> Patients { get; set; } = new List<StayPatientDto>();
    }

    public class StayPatientDto
    {
        public int StayParticipationId { get; set; } // for button remove from stay
        public int PatientId { get; set; } // for navigating to patient details
        public string PatientFullName { get; set; } = string.Empty;
    }
}