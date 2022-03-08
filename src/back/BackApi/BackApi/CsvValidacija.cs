using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Microsoft.VisualBasic.FileIO;
using System.IO;

namespace BackApi
{
    public static class CsvValidacija
    {
            public static string Validate(string csvString)
            {
                //csvString = "n1;n2;n3;out\r1; 1; 0; 1\r1; 0; 0; 1\r0; 0; 1; 1\r1; 0; 1; 1\r0; 0; 0; 0\r";
                StringReader csvStringReader = new StringReader(csvString);

                //string csv_file_path = @"..\..\..\temp.csv"; privremeno testiranje sa fajlom umesto csv stringa
                DataTable csvData = GetDataTableFromCSVFile(csvStringReader);

                //Console.WriteLine("Rows count:" + csvData.Rows.Count);

                string rez = DTtoJson(csvData);
                /*Console.WriteLine(rez);

                foreach (DataRow dataRow in csvData.Rows)
                {
                    foreach (var item in dataRow.ItemArray)
                    {
                        Console.Write(item);
                    }
                Console.WriteLine("\n---");
                }

                Console.ReadLine();*/
                return rez;
            }

            private static DataTable GetDataTableFromCSVFile(StringReader stringReader)
            {
                DataTable csvData = new DataTable();

                try
                {
                    using (TextFieldParser csvReader = new TextFieldParser(stringReader))
                    {
                        csvReader.SetDelimiters(new string[] { ";" });
                        csvReader.HasFieldsEnclosedInQuotes = false;

                        string[] colFields = csvReader.ReadFields();

                        foreach (string column in colFields)
                        {
                            DataColumn datecolumn = new DataColumn(column);
                            datecolumn.AllowDBNull = true;
                            csvData.Columns.Add(datecolumn);
                        }

                        int j = 0;
                        while (!csvReader.EndOfData)
                        {
                            j++;
                            string[] fieldData = csvReader.ReadFields();

                            //Making empty value as null
                            for (int i = 0; i < fieldData.Length; i++)
                            {
                                if (fieldData[i] == "")
                                {
                                    fieldData[i] = null;
                                }
                            }

                            if (fieldData.Length == colFields.Length)
                            {
                                csvData.Rows.Add(fieldData);
                            }
                            else
                            {
                                Console.WriteLine("greska na liniji " + j);
                            }

                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                }

                return csvData;
            }

            private static string DTtoJson(DataTable csvData)
            {
                StringBuilder JSONString = new StringBuilder();
                if (csvData.Rows.Count > 0)
                {
                    JSONString.Append("[");
                    for (int i = 0; i < csvData.Rows.Count; i++)
                    {
                        JSONString.Append("{");
                        for (int j = 0; j < csvData.Columns.Count; j++)
                        {
                            if (j < csvData.Columns.Count - 1)
                            {
                                JSONString.Append("\"" + csvData.Columns[j].ColumnName.ToString() + "\":" + "\"" + csvData.Rows[i][j].ToString() + "\",");
                            }
                            else if (j == csvData.Columns.Count - 1)
                            {
                                JSONString.Append("\"" + csvData.Columns[j].ColumnName.ToString() + "\":" + "\"" + csvData.Rows[i][j].ToString() + "\"");
                            }
                        }
                        if (i == csvData.Rows.Count - 1)
                        {
                            JSONString.Append("}");
                        }
                        else
                        {
                            JSONString.Append("},");
                        }
                    }
                    JSONString.Append("]");
                }
                return JSONString.ToString();
            }
        }
}
