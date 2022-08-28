using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc.Razor;
using System.Globalization;

var builder = WebApplication.CreateBuilder(args);
var Services = builder.Services;

// Add services to the container.
builder.Services.AddControllersWithViews();

Services.AddLocalization(options => { options.ResourcesPath = "Resources"; });
Services.AddMvc().AddViewLocalization(LanguageViewLocationExpanderFormat.Suffix);

Services.Configure<RequestLocalizationOptions>(options =>
{
    CultureInfo[] supportedCultures = new[] { new CultureInfo("id"), new CultureInfo("en") };

    options.DefaultRequestCulture = new RequestCulture("en");
    options.SupportedCultures = supportedCultures;
    options.SupportedUICultures = supportedCultures;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseRequestLocalization();

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
