namespace AiProject.Contracts;

public interface IGenericRepository<TEntity, TKey> where TEntity : class
{
    Task<TEntity?> GetByIdAsync(TKey id, CancellationToken cancellationToken);
    Task<IEnumerable<TEntity>> GetAllAsync(CancellationToken cancellationToken);
    Task AddAsync(TEntity entity, CancellationToken cancellationToken);
    void UpdateAsync(TEntity entity);
    void DeleteAsync(TEntity entity);
    Task<PagedResultDto<TEntity>> GetPagedAsync(int pageNumber, int pageSize, CancellationToken cancellationToken);
}
