using System;
using System.Collections.Generic;

namespace RehabiliTrack_API.Features.Stays.Queries.GetStayById
{
    public class StayDetailsDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Occupancy { get; set; }
        public int MaxCapacity { get; set; }

        public List<StayParticipationInfoDto> Participations { get; set; } = new();
    }

    public class StayParticipationInfoDto
    {
        public int Id { get; set; }
        public StayPatientInfoDto Patient { get; set; } = null!;
    }

    public class StayPatientInfoDto
    {
        public int Id { get; set; } 
        public string FullName { get; set; } = string.Empty;
    }
}