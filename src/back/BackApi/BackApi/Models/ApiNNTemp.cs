﻿namespace BackApi.Models
{
    public class ApiNNTempCreate
    {
        public string Name;
    }

    public class ApiNNCfg
    {
        public string conf;//json string
    }
    public class ApiNNTrain
    {
        public string dataset;
        public string nn;
        public string conf;
    }
}