using MediatR;
using System;

namespace RehabiliTrack_API.Features.Appointments.Queries.GetAppointmentById
{
    public class GetAppointmentByIdQuery : IRequest<AppointmentDetailsDto>
    {
        public int Id { get; set; }

        public GetAppointmentByIdQuery(int id)
        {
            Id = id;
        }
    }

    public class AppointmentDetailsDto
    {
        public int Id { get; set; }
        public DateTime StartDateTime { get; set; }
        public string Status { get; set; } = string.Empty;


        public PatientInfoDto Patient { get; set; } = null!;
        public TreatmentInfoDto Treatment { get; set; } = null!;
        public TherapistInfoDto Therapist { get; set; } = null!;
        public RoomInfoDto Room { get; set; } = null!;
        public StayInfoDto? Stay { get; set; }
    }

    public class PatientInfoDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public string? PhoneNumber { get; set; }
    }

    public class TreatmentInfoDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string DurationMinutes { get; set; } = string.Empty;
    }

    public class TherapistInfoDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public int RoleId { get; set; }
        public string RoleName { get; set; } = string.Empty;
    }

    public class RoomInfoDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Number { get; set; } = string.Empty;
        public int TypeId { get; set; }
        public string TypeName { get; set; } = string.Empty;
    }

    public class StayInfoDto
    {
        public int Id { get; set; }
        public int ParticipationId { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}