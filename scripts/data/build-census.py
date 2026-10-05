#!/usr/bin/env python3
"""Rejouable : relève au Census Bureau (ACS 1 an) la taxe foncière médiane payée et la valeur
médiane des logements occupés par leur propriétaire, état par état, et écrit
src/data/census-acs.json. Usage : python3 scripts/data/build-census.py 2024
Tables : B25103 (Median real estate taxes paid, owner-occupied units) et B25077 (Median value).
L'API api.census.gov exige désormais une clé ; on lit le service public de data.census.gov."""
import json, sys, urllib.request, datetime, pathlib
year = sys.argv[1] if len(sys.argv) > 1 else '2024'
def table(t):
    url = f'https://data.census.gov/api/access/data/table?id=ACSDT1Y{year}.{t}&g=010XX00US$0400000'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    d = json.load(urllib.request.urlopen(req, timeout=60))['response']['data']
    h = d[0]
    return {r[h.index('NAME')]: r for r in d[1:]}, h, url
tx, htx, utx = table('B25103')
va, hva, uva = table('B25077')
out = {}
for name, r in tx.items():
    if name == 'Puerto Rico':
        continue
    v = va[name]
    tax = int(r[htx.index('B25103_001E')]); moe = int(r[htx.index('B25103_001M')])
    val = int(v[hva.index('B25077_001E')])
    out[name] = {'medianTax': tax, 'medianTaxMoe': moe, 'medianTaxWithMortgage': int(r[htx.index('B25103_002E')]),
                 'medianTaxNoMortgage': int(r[htx.index('B25103_003E')]), 'medianValue': val,
                 'effectiveRate': round(tax / val, 5)}
res = {'source': f'U.S. Census Bureau, American Community Survey {year} 1-year estimates, tables B25103 and B25077',
       'year': int(year), 'retrieved_at': datetime.date.today().isoformat(),
       'urls': {'B25103': f'https://data.census.gov/table/ACSDT1Y{year}.B25103', 'B25077': f'https://data.census.gov/table/ACSDT1Y{year}.B25077'},
       'states': dict(sorted(out.items()))}
p = pathlib.Path(__file__).resolve().parents[2] / 'src/data/census-acs.json'
p.write_text(json.dumps(res, indent=1, ensure_ascii=False) + '\n')
print(len(out), 'états écrits dans', p)
