namespace AiProject.Contracts;

public interface IUnitOfWork : IDisposable
{
    IGenericRepository<TEntity, TKey> Repository<TEntity, TKey>() where TEntity : class;
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
