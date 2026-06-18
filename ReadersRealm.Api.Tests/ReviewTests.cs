using System.Net;
using System.Net.Http.Json;

namespace ReadersRealm.Api.Tests;

public class ReviewTests : IDisposable
{
    private readonly TestWebAppFactory _factory;
    private readonly HttpClient _client;

    public ReviewTests()
    {
        _factory = new TestWebAppFactory();
        _client = _factory.CreateClient();
    }

    public void Dispose()
    {
        _client.Dispose();
        _factory.Dispose();
    }

    [Fact]
    public async Task ReviewingYourOwnBook_ReturnsBadRequest()
    {
        var owner = await _client.RegisterAsync("owner");
        _client.Authenticate(owner.Token);
        var book = await _client.AddBookAsync("My Memoir");

        var response = await _client.PostAsJsonAsync(
            "/api/reviews",
            new { rating = 5, text = "I loved my own book", bookId = book.Id }
        );

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<MessageResult>();
        Assert.Equal("You cannot review your own book", body!.Message);
    }

    [Fact]
    public async Task ReviewWithRatingOutOfRange_ReturnsBadRequest()
    {
        var ownerClient = _factory.CreateClient();
        var owner = await ownerClient.RegisterAsync("owner");
        ownerClient.Authenticate(owner.Token);
        var book = await ownerClient.AddBookAsync("Good Book");

        var reader = await _client.RegisterAsync("reader");
        _client.Authenticate(reader.Token);

        var response = await _client.PostAsJsonAsync(
            "/api/reviews",
            new { rating = 99, text = "off the charts", bookId = book.Id }
        );

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<MessageResult>();
        Assert.Equal("Rating must be between 1 and 5", body!.Message);
    }

    [Fact]
    public async Task ReviewingTheSameBookTwice_ReturnsBadRequest()
    {
        var ownerClient = _factory.CreateClient();
        var owner = await ownerClient.RegisterAsync("owner");
        ownerClient.Authenticate(owner.Token);
        var book = await ownerClient.AddBookAsync("Re-readable");

        var reader = await _client.RegisterAsync("reader");
        _client.Authenticate(reader.Token);

        var first = await _client.PostAsJsonAsync(
            "/api/reviews",
            new { rating = 4, text = "Great", bookId = book.Id }
        );
        first.EnsureSuccessStatusCode();

        var second = await _client.PostAsJsonAsync(
            "/api/reviews",
            new { rating = 2, text = "Changed my mind", bookId = book.Id }
        );

        Assert.Equal(HttpStatusCode.BadRequest, second.StatusCode);
        var body = await second.Content.ReadFromJsonAsync<MessageResult>();
        Assert.Equal("You have already reviewed this book", body!.Message);
    }

    private record MessageResult(string Message);
}
