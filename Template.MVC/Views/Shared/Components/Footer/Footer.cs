using Microsoft.AspNetCore.Mvc;

namespace Template.MVC.Views.Shared.Components.Footer
{
    public class Footer : ViewComponent
    {
        public IViewComponentResult Invoke() => View();   
    }
}
