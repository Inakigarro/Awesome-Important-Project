namespace AiProject.Contracts.Canchas;

public record ObtenerCanchasRequest
{
    public int PageNumber {get; set;} = 1;
    public int PageSize {get; set;} = 5;
}