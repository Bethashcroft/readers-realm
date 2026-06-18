using System.Net;
using System.Net.Http.Json;

namespace ReadersRealm.Api.Tests;

public class BorrowTests : IDisposable
{
    private readonly TestWebAppFactory _factory;
    private readonly HttpClient _client;

    public BorrowTests()
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
    public async Task RequestingYourOwnBook_ReturnsBadRequest()
    {
        var owner = await _client.RegisterAsync("owner");
        _client.Authenticate(owner.Token);

        var book = await _client.AddBookAsync("My Own Book");

        var response = await _client.PostAsJsonAsync(
            "/api/borrowrequests",
            new {bookId = book.Id, message = "lend me my own book"}
        );

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        var body = await response.Content.ReadFromJsonAsync<MessageResult>();
        Assert.Equal("You cannot request your own book", body!.Message);
    }

    private record MessageResult(string Message);

    [Fact]
    public async Task AcceptingRequest_DeclinesCompetitorsAndLendsOutTheBook()
    {
        var ownerClient = _factory.CreateClient();
        var owner = await ownerClient.RegisterAsync("owner");
        ownerClient.Authenticate(owner.Token);
        var book = await ownerClient.AddBookAsync("Shared Book");

        var aliceClient = _factory.CreateClient();
        var alice = await aliceClient.RegisterAsync("alice");
        aliceClient.Authenticate(alice.Token);
        var aliceReq = await aliceClient.RequestBookAsync(book.Id);

        var bobClient = _factory.CreateClient();
        var bob = await bobClient.RegisterAsync("bob");
        bobClient.Authenticate(bob.Token);
        var bobReq = await bobClient.RequestBookAsync(book.Id);

        var accept = await ownerClient.PutAsJsonAsync(
            $"/api/borrowrequests/{aliceReq.Id}",
            new {status = "accepted"}
        );
        accept.EnsureSuccessStatusCode();

                var allRequests = await ownerClient.GetFromJsonAsync<BorrowResult[]>(
            "/api/borrowrequests"
        );
        var aliceAfter = allRequests!.Single(r => r.Id == aliceReq.Id);
        var bobAfter = allRequests!.Single(r => r.Id == bobReq.Id);

        Assert.Equal("accepted", aliceAfter.Status);
        Assert.Equal("declined", bobAfter.Status);

        var bookAfter = await ownerClient.GetFromJsonAsync<BookResult>(
            $"/api/books/{book.Id}"
        );
        Assert.Equal("lent-out", bookAfter!.Shelf);
    }
}