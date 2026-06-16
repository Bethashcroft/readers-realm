using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReadersRealm.Api.Data;
using ReadersRealm.Api.Models;

namespace ReadersRealm.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly UserManager<AppUser> _userManager;

    public ReviewsController(AppDbContext context, UserManager<AppUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet("book/{bookId}")]
    public async Task<IActionResult> GetReviewsForBook(int bookId)
    {
        var reviews = await _context
            .Reviews.Where(r => r.BookId == bookId)
            .Select(r => new ReviewResponse
            {
                Id = r.Id,
                Rating = r.Rating,
                Text = r.Text,
                Date = r.Date,
                BookId = r.BookId,
                UserName = r.User.DisplayName,
            })
            .ToListAsync();

        return Ok(reviews);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> AddReview([FromBody] AddReviewRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (request.Rating < 1 || request.Rating > 5)
        {
            return BadRequest(new { message = "Rating must be between 1 and 5" });
        }

        var book = await _context.Books.FindAsync(request.BookId);

        if (book == null)
        {
            return NotFound(new { message = "Book not found" });
        }

        if (book.UserId == userId)
        {
            return BadRequest(new { message = "You cannot review your own book" });
        }

        var alreadyReviewed = await _context.Reviews.AnyAsync(r =>
            r.BookId == request.BookId && r.UserId == userId
        );

        if (alreadyReviewed)
        {
            return BadRequest(new { message = "You have already reviewed this book" });
        }

        var review = new Review
        {
            Rating = request.Rating,
            Text = request.Text,
            BookId = request.BookId,
            UserId = userId!,
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        var user = await _userManager.FindByIdAsync(userId!);

        return Ok(
            new ReviewResponse
            {
                Id = review.Id,
                Rating = review.Rating,
                Text = review.Text,
                Date = review.Date,
                BookId = review.BookId,
                UserName = user?.DisplayName ?? "Unknown",
            }
        );
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteReview(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var review = await _context.Reviews.FindAsync(id);

        if (review == null || review.UserId != userId)
        {
            return NotFound(new { message = "Review not found" });
        }

        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();

        return Ok();
    }
}

public class AddReviewRequest
{
    public int Rating { get; set; }
    public string Text { get; set; } = string.Empty;
    public int BookId { get; set; }
}

public class ReviewResponse
{
    public int Id { get; set; }
    public int Rating { get; set; }
    public string Text { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public int BookId { get; set; }
    public string UserName { get; set; } = string.Empty;
}
