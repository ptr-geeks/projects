import csv

lines = []

with open('output2.csv') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    for row in csv_reader:
        lines.append(f'new Glagol("{row[0]}", "{row[1]}", "{row[2]}", "{row[3]}", "{row[4]}")')

# glegoli. Barbi <3
glegoli = ", \n    ".join(lines)

js_code = f"""
class Glagol {{
    nedolocnik: string; // Infinitiv
    sedanjik: string; // Präsens
    preteklik: string; // Präteritum
    sestavljeni_preteklik: string; // Perfekt
    primer: string; // Beispielsatz
    
    constructor(nedolocnik: string, sedanjik: string, preteklik: string, sestavljeni_preteklik: string, primer: string) {{
        this.nedolocnik = nedolocnik;
        this.sedanjik = sedanjik;
        this.preteklik = preteklik;
        this.sestavljeni_preteklik = sestavljeni_preteklik;
        this.primer = primer;
    }}
}}

const glagoli = [
    {glegoli}
];

"""

print(js_code)