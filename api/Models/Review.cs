namespace ReadersRealm.Api.Models;

public class Review
{
    public int Id { get; set; }
    public int Rating { get; set; }
    public string Text { get; set; } = string.Empty;
    public DateTime Date { get; set; } = DateTime.UtcNow;

    public int BookId { get; set; }
    public Book Book { get; set; } = null!;

    public string UserId { get; set; } = string.Empty;
    public AppUser User { get; set; } = null!;
}