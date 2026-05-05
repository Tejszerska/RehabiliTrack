using Microsoft.AspNetCore.Mvc;

namespace RehabiliTrack_API.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
