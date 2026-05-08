using Microsoft.AspNetCore.Identity;

namespace ReadersRealm.Api.Models;

public class AppUser : IdentityUser
{
    public string DisplayName { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public DateTime JoinedDate { get; set; } = DateTime.UtcNow;
}
