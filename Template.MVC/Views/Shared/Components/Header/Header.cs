using Microsoft.AspNetCore.Mvc;

namespace Template.MVC.Views.Shared.Components.Header
{
    public class Header : ViewComponent
    {
        public IViewComponentResult Invoke(string title)
        {
            ViewData["Data"] = title;
            return View();
        }
    }
}
