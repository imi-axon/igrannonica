using Microsoft.AspNetCore.Routing;

namespace BackApi.Config
{
    public class Urls
    {
        public static string ml = "";
        public static string mlWs = "";
        public static string mlHost = "";

        public static string back = "";
        public static string backHost = "";

        public static string front = "";
        public static string frontHost = "";


        public static void SetForDev()
        {
            ml = "http://localhost:8000";
            mlWs = "ws://localhost:8000";
            mlHost = "localhost:8000";

            back = "http://localhost:5057";
            backHost = "localhost:5057";

            front = "http://localhost:4200";
            frontHost = "localhost:4200";
        }

        public static void SetForProd()
        {
            ml = "http://147.91.204.115:10017";
            mlWs = "ws://147.91.204.115:10017";
            mlHost = "147.91.204.115:10017";

            back = "http://147.91.204.115:10016";
            backHost = "147.91.204.115:10016";

            front = "http://147.91.204.115:10015";
            frontHost = "147.91.204.115:10015";
        }

    }
}
