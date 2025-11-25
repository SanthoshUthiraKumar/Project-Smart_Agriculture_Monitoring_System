using SmartAgri.Advisory.Models;

namespace SmartAgri.Advisory.Services
{
    public interface IAdvisoryEngine
    {
        AdvisoryResult GenerateAdvisory(AdvisoryRequest req);
    }
}
