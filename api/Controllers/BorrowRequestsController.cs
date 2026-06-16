using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReadersRealm.Api.Data;
using ReadersRealm.Api.Models;

namespace ReadersRealm.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BorrowRequestsController : ControllerBase
{
    private readonly AppDbContext _context;

    public BorrowRequestsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> CreateRequest([FromBody] CreateBorrowRequest request)
    {
        var fromUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var book = await _context.Books.FindAsync(request.BookId);

        if (book == null)
        {
            return NotFound(new { message = "Book not found" });
        }

        if (book.UserId == fromUserId)
        {
            return BadRequest(new { message = "You cannot request your own book" });
        }

        var alreadyRequested = await _context.BorrowRequests.AnyAsync(r =>
            r.BookId == request.BookId && r.FromUserId == fromUserId && r.Status == "pending"
        );

        if (alreadyRequested)
        {
            return BadRequest(new { message = "You already have a pending request for this book" });
        }

        var borrowRequest = new BorrowRequest
        {
            BookId = book.Id,
            FromUserId = fromUserId!,
            ToUserId = book.UserId,
            Message = request.Message,
        };

        _context.BorrowRequests.Add(borrowRequest);
        await _context.SaveChangesAsync();

        return Ok(
            new BorrowRequestResponse
            {
                Id = borrowRequest.Id,
                BookId = borrowRequest.BookId,
                BookTitle = book.Title,
                FromUserId = borrowRequest.FromUserId,
                ToUserId = borrowRequest.ToUserId,
                Status = borrowRequest.Status,
                Message = borrowRequest.Message,
                Date = borrowRequest.Date,
            }
        );
    }

    public class CreateBorrowRequest
    {
        public int BookId { get; set; }
        public string Message { get; set; } = string.Empty;
    }

    public class BorrowRequestResponse
    {
        public int Id { get; set; }
        public int BookId { get; set; }
        public string BookTitle { get; set; } = string.Empty;
        public string FromUserId { get; set; } = string.Empty;
        public string ToUserId { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime Date { get; set; }
    }

    [HttpGet]
    public async Task<IActionResult> GetMyRequests()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var requests = await _context
            .BorrowRequests.Where(r => r.FromUserId == userId || r.ToUserId == userId)
            .Include(r => r.Book)
            .Select(r => new BorrowRequestResponse
            {
                Id = r.Id,
                BookId = r.BookId,
                BookTitle = r.Book.Title,
                FromUserId = r.FromUserId,
                ToUserId = r.ToUserId,
                Status = r.Status,
                Message = r.Message,
                Date = r.Date,
            })
            .OrderByDescending(r => r.Date)
            .ToListAsync();

        return Ok(requests);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStatus(
        int id,
        [FromBody] UpdateBorrowStatusRequest request
    )
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (request.Status != "accepted" && request.Status != "declined")
        {
            return BadRequest(new { message = "Status must be 'accepted' or 'declined'" });
        }

        var borrowRequest = await _context
            .BorrowRequests.Include(r => r.Book)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (borrowRequest == null)
        {
            return NotFound(new { message = "Request not found" });
        }

        if (borrowRequest.ToUserId != userId)
        {
            return Forbid();
        }

        borrowRequest.Status = request.Status;

        if (request.Status == "accepted")
        {
            borrowRequest.Book.Shelf = "lent-out";

            var competing = await _context
                .BorrowRequests.Where(r =>
                    r.BookId == borrowRequest.BookId
                    && r.Id != borrowRequest.Id
                    && r.Status == "pending"
                )
                .ToListAsync();

            foreach (var other in competing)
            {
                other.Status = "declined";
            }
        }

        await _context.SaveChangesAsync();

        return Ok(
            new BorrowRequestResponse
            {
                Id = borrowRequest.Id,
                BookId = borrowRequest.BookId,
                BookTitle = borrowRequest.Book.Title,
                FromUserId = borrowRequest.FromUserId,
                ToUserId = borrowRequest.ToUserId,
                Status = borrowRequest.Status,
                Message = borrowRequest.Message,
                Date = borrowRequest.Date,
            }
        );
    }
}

public class UpdateBorrowStatusRequest
{
    public string Status { get; set; } = string.Empty;
}
