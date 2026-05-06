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
public class BooksController : ControllerBase
{
    private readonly AppDbContext _context;

    public BooksController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyBooks()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var books = await _context.Books
                    .Where(b => b.UserId == userId)
                    .ToListAsync();

        return Ok(books);
    }

    [HttpGet("browse")]
    [AllowAnonymous]
    public async Task<IActionResult> Browse()
    {
        var books = await _context.Books
                    .Where(b => b.Shelf == "available-to-borrow" || b.Shelf == "for-sale")
                    .ToListAsync();

        return Ok(books);
    }

    [HttpPost]
    public async Task<IActionResult> AddBook([FromBody] AddBookRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var book = new Book
        {
            Title = request.Title,
            Author = request.Author,
            CoverUrl = request.CoverUrl,
            Shelf = request.Shelf,
            Rating = request.Rating,
            UserId = userId!
        };

        _context.Books.Add(book);
        await _context.SaveChangesAsync();

        return Ok(book);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBook(int id, [FromBody] AddBookRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var book = await _context.Books.FindAsync(id);

        if(book == null || book.UserId != userId)
        {
            return NotFound();
        }

        book.Title = request.Title;
        book.Author = request.Author;
        book.CoverUrl = request.CoverUrl;
        book.Shelf = request.Shelf;
        book.Rating = request.Rating;

        await _context.SaveChangesAsync();

        return Ok(book);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var book = await _context.Books.FindAsync(id);

        if (book == null || book.UserId != userId)
        {
            return NotFound();
        }

        _context.Books.Remove(book);

        await _context.SaveChangesAsync();

        return Ok();
    }
}


public class AddBookRequest
{
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string CoverUrl { get; set; } = string.Empty;
    public string Shelf { get; set; } = string.Empty;
    public int? Rating { get; set; }
}