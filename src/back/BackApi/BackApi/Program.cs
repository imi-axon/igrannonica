using BackApi;
using BackApi.Entities;
using BackApi.Services;
using BackApi.Config;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Http;
using Swashbuckle.AspNetCore.Filters;
using System.Text;
using Microsoft.Extensions.FileProviders;
using System.Diagnostics;
using System.Security.Claims;
using System.Net;
using Microsoft.AspNetCore.Server.Kestrel.Core;

// -- Custom Environment Variable --

var BACK_ENV_TYPE = Environment.GetEnvironmentVariable("BACK_ENV_TYPE");

if (BACK_ENV_TYPE == null)
    BACK_ENV_TYPE = "DEVELOPMENT";

if (BACK_ENV_TYPE == "DEVELOPMENT")
{
    Urls.SetForDev();
}
else if (BACK_ENV_TYPE == "PRODUCTION")
{
    Urls.SetForProd();
}

// ---------------------------------

var myAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

/*
builder.WebHost.ConfigureKestrel((context, serverOptions) =>
{
    serverOptions.Listen(IPAddress.Any, int.Parse(Urls.backPort));
});
*/

//builder.Services.Configure<KestrelServerOptions>(builder.Configuration.GetSection("Kestrel"));

// Add services to the container.
builder.Services.AddDbContext<DataBaseContext>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options => {
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        Description = "Standard Authorization header using the Bearer scheme (\"bearer {token}\")",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });

    options.OperationFilter<SecurityRequirementsOperationFilter>();
}); //za testiranje auth preko swaggera - no effect on app

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
                .GetBytes(builder.Configuration.GetSection("AppSettings:Token").Value)),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IUserService,UserService>();
builder.Services.AddScoped<IProjectService,ProjectService>();
builder.Services.AddScoped<IDatasetService,DatasetService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IStorageService, StorageService>();
builder.Services.AddScoped<INNservice, NNservice>();
builder.Services.AddSingleton<IWSQueue, WSQueue>();
builder.Services.AddHttpContextAccessor();

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: myAllowSpecificOrigins,
        builder =>
        {
            //builder.WithOrigins("http://localhost:4200")
            builder.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
        });
});


var app = builder.Build();

// Primenjuje migracije
using (var scope = app.Services.CreateScope())
{
    var dataContext = scope.ServiceProvider.GetRequiredService<DataBaseContext>();
    dataContext.Database.Migrate();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

var webSocketOptions = new WebSocketOptions
{
    KeepAliveInterval = TimeSpan.FromMinutes(2)
};

app.UseWebSockets(webSocketOptions);

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseCors(myAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = context =>
    {
        var x = context.Context.Request.Host;
        if (x.ToString() == null  || x.ToString() != Urls.mlHost)
        {       
            context.Context.Response.ContentLength = 0;
            context.Context.Response.Body = Stream.Null;
            context.Context.Response.Headers.Add("Cache-Control", "no-store");
            context.Context.Response.StatusCode = (int)HttpStatusCode.Forbidden;
        }

    },
    FileProvider = new PhysicalFileProvider(Path.Combine(builder.Environment.ContentRootPath, "Storage")),
    RequestPath = "/Storage"
});


app.Run();


