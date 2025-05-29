using AiProject.Contracts;

namespace AiProject.Persistence;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private readonly Dictionary<Type, object> _repositories = new();
    private bool _disposed;

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
    }

    public IGenericRepository<TEntity, TKey> Repository<TEntity, TKey>() where TEntity : class
    {
        if (!_repositories.ContainsKey(typeof(TEntity)))
        {
            _repositories[typeof(TEntity)] = new GenericRepository<TEntity, TKey>(_context);
        }
        return (IGenericRepository<TEntity, TKey>)_repositories[typeof(TEntity)];
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (!_disposed)
        {
            if (disposing)
            {
                _context.Dispose();
                foreach (var repo in _repositories.Values)
                {
                    if (repo is IDisposable disposable)
                    {
                        disposable.Dispose();
                    }
                }
            }
            _disposed = true;
        }
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }
}
