using Microsoft.AspNetCore.Mvc;
using SmartAgri.Advisory.Models;
using SmartAgri.Advisory.Services;

namespace SmartAgri.Advisory.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdvisoryController : ControllerBase
    {
        private readonly IAdvisoryEngine _engine;
        public AdvisoryController(IAdvisoryEngine engine) { _engine = engine; }

        [HttpPost]
        public ActionResult<AdvisoryResult> Post([FromBody] AdvisoryRequest req)
        {
            var result = _engine.GenerateAdvisory(req);
            return Ok(result);
        }
    }
}
