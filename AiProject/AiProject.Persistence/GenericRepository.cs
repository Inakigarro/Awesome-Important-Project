using AiProject.Contracts;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace AiProject.Persistence;

public class GenericRepository<TEntity, TKey> : IGenericRepository<TEntity, TKey>, IDisposable where TEntity : class
{
    private readonly ApplicationDbContext _context;
    private readonly DbSet<TEntity> _dbSet;
    private bool _disposed;

    public GenericRepository(ApplicationDbContext context)
    {
        _context = context;
        _dbSet = _context.Set<TEntity>();
    }

    public async Task<TEntity?> GetByIdAsync(TKey id, CancellationToken cancellationToken)
    {
        return await _dbSet.FindAsync(id, cancellationToken);
    }

    public async Task<IEnumerable<TEntity>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await _dbSet.ToListAsync(cancellationToken);
    }

    public async Task AddAsync(TEntity entity, CancellationToken cancellationToken)
    {
        await _dbSet.AddAsync(entity, cancellationToken);
    }

    public void UpdateAsync(TEntity entity)
    {
        _dbSet.Update(entity);
    }

    public void DeleteAsync(TEntity entity)
    {
        _dbSet.Remove(entity);
    }

    public async Task<PagedResultDto<TEntity>> GetPagedAsync(int pageNumber, int pageSize, CancellationToken cancellationToken)
    {
        var totalCount = await _dbSet.CountAsync(cancellationToken);
        var items = await _dbSet
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
        return new PagedResultDto<TEntity>
        {
            Items = items,
            TotalCount = totalCount
        };
    }

    public IQueryable<TEntity> Query()
    {
        return _dbSet.AsQueryable();
    }

    protected virtual void Dispose(bool disposing)
    {
        if (!_disposed)
        {
            if (disposing)
            {
                _context.Dispose();
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
