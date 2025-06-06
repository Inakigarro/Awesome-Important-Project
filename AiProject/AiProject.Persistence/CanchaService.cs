using AiProject.Contracts;
using AiProject.Contracts.Canchas;
using AiProject.Domain;

namespace AiProject.Persistence;

public class CanchaService : ICanchaService
{
    private readonly IUnitOfWork _unitOfWork;

    public CanchaService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<PagedResultDto<CanchaDto>> GetAllAsync(ObtenerCanchasRequest request, CancellationToken cancellationToken)
    {
        var canchas = await _unitOfWork.Repository<Cancha, int>()
            .GetPagedAsync(request.PageNumber, request.PageSize, cancellationToken);

        return new()
        {
            TotalCount = canchas.TotalCount,
            Items = canchas.Items.Select(c => new CanchaDto
            {
                Id = c.Id,
                TipoSuelo = c.TipoSuelo
            })
        };
    }

    public async Task<Cancha?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        return await _unitOfWork.Repository<Cancha, int>().GetByIdAsync(id, cancellationToken);
    }

    public async Task<int> AddAsync(TipoSuelo tipoSuelo, CancellationToken cancellationToken)
    {
        var cancha = new Cancha { TipoSuelo = tipoSuelo };
        await _unitOfWork.Repository<Cancha, int>().AddAsync(cancha, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return cancha.Id;
    }

    public async Task UpdateAsync(int id, TipoSuelo tipoSuelo, CancellationToken cancellationToken)
    {
        var cancha = await _unitOfWork.Repository<Cancha, int>().GetByIdAsync(id, cancellationToken);
        if (cancha == null)
            throw new Exception("Cancha no encontrada");
        cancha.TipoSuelo = tipoSuelo;
        _unitOfWork.Repository<Cancha, int>().UpdateAsync(cancha);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken)
    {
        var cancha = await _unitOfWork.Repository<Cancha, int>().GetByIdAsync(id, cancellationToken);
        if (cancha == null)
            throw new Exception("Cancha no encontrada");
        _unitOfWork.Repository<Cancha, int>().DeleteAsync(cancha);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
