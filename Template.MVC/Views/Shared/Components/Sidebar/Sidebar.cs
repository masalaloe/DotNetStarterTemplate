using Microsoft.AspNetCore.Mvc;

namespace Template.MVC.Views.Shared.Components.Sidebar
{
    public class Sidebar : ViewComponent
    {
        public IViewComponentResult Invoke() => View();
    }
}
