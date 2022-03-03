namespace UplataProjekatBack.Models
{
    public class Uplata
    {
        public Uplata(int id, int iznos, string valuta, string datum)
        {
            Id = id;
            Iznos = iznos;
            Valuta = valuta;
            Datum = datum;
        }

        public int Id { get; set; }

        public int Iznos { get; set; }

        public string Valuta { get; set; } = string.Empty;

        public string Datum { get; set; } = string.Empty;
    }
}
