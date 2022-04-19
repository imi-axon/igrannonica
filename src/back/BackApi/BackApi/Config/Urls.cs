using Microsoft.AspNetCore.Routing;
using System.Diagnostics;

namespace BackApi.Config
{
    public class Urls
    {
        // Front
        public static string frontHost = "";
        public static string frontPort = "";
        public static string front = "";

        // Back
        public static string backHost = "";
        public static string backPort = "";
        public static string back = "";

        // ML
        public static string mlHost = "";
        public static string mlPort = "";
        public static string mlWs = "";
        public static string ml = "";

        public static void SetForDev()
        {
            mlPort = "8000";
            backPort = "5057";
            frontPort = "4200";

            SetWithCommonHost("localhost");
        }

        public static void SetForProd()
        {   
            mlPort = "10017";
            backPort = "10016";
            frontPort = "10015";

            SetWithCommonHost("147.91.204.115");
            //SetWithCommonHost("softeng.pfm.kg.ac.rs");
        }

        // --- IDE NA KRAJU ---
        private static void SetWithCommonHost(string host)
        {
            mlHost = host;
            backHost = host;
            frontHost = host;

            mlWs = "ws://" + mlHost + ":" + mlPort;
            ml = "http://" + mlHost + ":" + mlPort;
            back = "http://" + backHost + ":" + backPort;
            front = "http://" + frontHost + ":" + frontPort;

            Debug.WriteLine(" -- Urls -- ");
            Debug.WriteLine(mlWs);
            Debug.WriteLine(ml);
            Debug.WriteLine(back);
            Debug.WriteLine(front);
            Debug.WriteLine(" ---------- ");

            Console.WriteLine(" -- Urls -- ");
            Console.WriteLine(mlWs);
            Console.WriteLine(ml);
            Console.WriteLine(back);
            Console.WriteLine(front);
            Console.WriteLine(" ---------- ");
        }

    }
}
