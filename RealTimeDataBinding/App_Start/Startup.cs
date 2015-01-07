using Microsoft.Owin;
using Owin;
using RealTimeDataBinding;

[assembly: OwinStartup(typeof(Startup), "Configuration")]

namespace RealTimeDataBinding
{
    class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }

    }
}
