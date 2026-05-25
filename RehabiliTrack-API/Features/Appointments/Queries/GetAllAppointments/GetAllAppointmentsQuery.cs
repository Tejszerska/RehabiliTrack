using MediatR;
using System.Collections.Generic;

namespace RehabiliTrack_API.Features.Appointments.Queries.GetAllAppointments
{
    public class GetAllAppointmentsQuery : IRequest<List<AppointmentListItemDto>>
    {
        public int? StayId { get; set; }
    }

    public class AppointmentListItemDto
    {
        public int Id { get; set; }

        public DateTime StartDateTime { get; set; }
        public string Status { get; set; } = string.Empty;
        public bool Outpatient { get; set; }

        public PatientInfoDto Patient { get; set; } = null!;
        public TreatmentInfoDto Treatment { get; set; } = null!;
        public TherapistInfoDto Therapist { get; set; } = null!;
        public RoomInfoDto Room { get; set; } = null!;
    }

    public class PatientInfoDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
    }

    public class TreatmentInfoDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }

    public class TherapistInfoDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
    }

    public class RoomInfoDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Number { get; set; } = string.Empty;
    }
}