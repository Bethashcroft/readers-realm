using System.Net;
using System.Net.Http.Json;

namespace ReadersRealm.Api.Tests;

public class BooksTests : IDisposable
{
    private readonly TestWebAppFactory _factory;
    private readonly HttpClient _client;

    public BooksTests()
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
    public async Task DeletingSomeoneElsesBook_ReturnsForbiddenAndLeavesItIntact()
    {
        var ownerClient = _factory.CreateClient();
        var owner = await ownerClient.RegisterAsync("owner");
        ownerClient.Authenticate(owner.Token);
        var book = await ownerClient.AddBookAsync("Owner's Book");

        var intruder = await _client.RegisterAsync("intruder");
        _client.Authenticate(intruder.Token);

        var deleteResponse = await _client.DeleteAsync($"/api/books/{book.Id}");
        Assert.Equal(HttpStatusCode.Forbidden, deleteResponse.StatusCode);

        var stillThere = await ownerClient.GetAsync($"/api/books/{book.Id}");
        Assert.Equal(HttpStatusCode.OK, stillThere.StatusCode);
    }

    [Fact]
    public async Task UpdatingSomeoneElsesBook_ReturnsForbidden()
    {
        var ownerClient = _factory.CreateClient();
        var owner = await ownerClient.RegisterAsync("owner");
        ownerClient.Authenticate(owner.Token);
        var book = await ownerClient.AddBookAsync("Owner's Book");

        var intruder = await _client.RegisterAsync("intruder");
        _client.Authenticate(intruder.Token);

        var response = await _client.PutAsJsonAsync(
            $"/api/books/{book.Id}",
            new
            {
                title = "Hijacked",
                author = "Intruder",
                coverUrl = "x",
                shelf = "for-sale",
                rating = (int?)null,
            }
        );

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }
}
