# Brief : relevé des faits officiels par état (sales tax + property tax), 2026-10-05

Site : calculateur américain de sales tax et de property tax, état par état (50 états + DC).
Ton travail : **relever des faits vérifiés sur des sources officielles**, pas écrire du contenu.
Un fichier JSON par état dans
`~/Documents/GitHub/a-publier/Mottalib-10M/us-sales-property-tax/src/data/states/<slug>.json`
(slug = nom de l'état en minuscules avec tirets : `new-york`, `district-of-columbia`).

## Règles de vérité (non négociables)

- Date du jour : **2026-10-05**. On veut la situation **en vigueur aujourd'hui**, plus les changements
  datés de 2025, 2026 et ceux déjà votés pour 2027 (avec leur date d'effet).
- **Seules sources admises** : département des finances / revenue / taxation / comptroller de l'état,
  site législatif de l'état (statut, code), site du gouverneur ou de l'assessor de l'état, IRS / Census.
  Jamais un blog, un éditeur de logiciel fiscal (Avalara, TaxJar, Tax Foundation, SalesTaxHandbook…),
  ni un média. Ces sites peuvent te servir d'indice pour savoir quoi chercher, jamais de source.
- **Lis la page** (curl ou WebFetch) avant d'écrire un chiffre. Privilégie `curl -sL -A "Mozilla/5.0" <url>`
  sur les sites officiels ; utilise la recherche web avec parcimonie (le quota est partagé entre agents),
  seulement pour trouver l'URL officielle.
- Un chiffre que tu n'as pas pu lire sur une source officielle **ne s'écrit pas** : mets `null` et
  explique dans `uncertain`. Mieux vaut un champ vide qu'un chiffre faux.
- **Taux locaux** : n'écris PAS de taux local de ville ou de comté. Note seulement si les collectivités
  peuvent lever une sales tax locale, lesquelles (counties, cities, transit districts…), le plafond
  légal s'il est écrit dans le statut ou sur le site du DOR, et l'URL de l'outil officiel de recherche
  de taux par adresse (presque tous les DOR en ont un).
- Chaque fait porte l'URL où tu l'as lu. Toutes les URL en https, qui répondent (vérifie le code HTTP).

## Schéma JSON (respecte les clés exactement)

```json
{
  "name": "California",
  "abbr": "CA",
  "slug": "california",
  "verified": "2026-10-05",
  "sales": {
    "hasStateSalesTax": true,
    "stateRate": 7.25,
    "rateNote": "Statewide base rate; includes 1.25% allocated to cities and counties (Bradley-Burns).",
    "effectiveSince": "2017-01-01",
    "scheduledChanges": [{"date": "2027-01-01", "rate": null, "what": "texte court", "url": "..."}],
    "local": {
      "allowed": true,
      "levies": "district taxes (cities, counties, special districts)",
      "cap": null,
      "capNote": "texte court ou null",
      "groceriesTaxedLocally": false,
      "lookupUrl": "https://maps.cdtfa.ca.gov/",
      "url": "page officielle qui explique les taxes locales"
    },
    "groceries": {"treatment": "exempt", "rate": null, "note": "Food for home consumption exempt; hot prepared food taxable.", "url": "..."},
    "clothing": {"treatment": "taxed", "threshold": null, "note": "", "url": "..."},
    "prescriptionDrugs": {"treatment": "exempt", "url": "..."},
    "otherRates": [{"item": "motor vehicles", "rate": 6.25, "note": "...", "url": "..."}],
    "holidays2026": [
      {"name": "Back-to-school sales tax holiday", "start": "2026-08-07", "end": "2026-08-09",
       "items": "clothing and footwear $100 or less per item; school supplies ...", "url": "..."}
    ],
    "holidayNote": "ex. « No sales tax holiday in 2026 » ou « holiday repealed in 2025 » (avec url), sinon null",
    "useTax": {"rate": 7.25, "note": "use tax due on out-of-state purchases when no tax charged", "url": "..."},
    "facts": [
      {"text": "fait court, propre à l'état, utile au lecteur (seuil, règle singulière, réforme récente)", "url": "..."}
    ]
  },
  "property": {
    "levied": "local (counties, cities, school districts) / state levy if any",
    "assessment": {"text": "comment la valeur imposable est fixée : % de la valeur de marché, classes, plafond de hausse annuelle (ex. Prop 13 : 1% + 2%/an)", "ratio": null, "url": "..."},
    "homestead": {
      "name": "Homeowners' Exemption",
      "amountType": "value-exemption | credit | percent | freeze | none",
      "amount": 7000,
      "text": "règle principale en une ou deux phrases : montant, qui y a droit, sur quelle part de l'impôt",
      "applyBy": "date limite / auprès de qui, si officiel",
      "url": "..."
    },
    "otherRelief": [{"name": "Senior/disabled/veteran program", "text": "court", "url": "..."}],
    "dueDates": {"text": "échéances de paiement si officielles et statewide, sinon null", "url": "..."},
    "facts": [{"text": "...", "url": "..."}]
  },
  "uncertain": ["ce que tu n'as pas pu vérifier, et pourquoi"]
}
```

Valeurs admises : `groceries.treatment` = `exempt` | `reduced` | `taxed` (`rate` = taux d'état réduit
si `reduced`, ou taux plein si `taxed`). `clothing.treatment` = `taxed` | `exempt` | `exempt-under-threshold`
(`threshold` en dollars par article). `prescriptionDrugs.treatment` = `exempt` | `taxed`.
États sans sales tax d'état (AK, DE, MT, NH, OR) : `hasStateSalesTax: false`, `stateRate: 0`, et
décris ce qui existe à la place (taxes locales en Alaska, gross receipts tax au Delaware, resort taxes
au Montana, Meals & Rooms tax au New Hampshire…) dans `facts`, avec le taux officiel.
Alaska : la property tax n'est pas « state » ; idem partout, explique qui lève l'impôt.
Hawaï : c'est une General Excise Tax (GET), pas une sales tax : `stateRate` = taux d'état de la GET,
explique la surtaxe de comté et le pass-on dans `rateNote`/`local`.

`facts` : 3 à 8 faits courts et vérifiés par rubrique, **propres à l'état** (c'est ce qui rendra chaque
page unique) : réforme récente, seuil singulier, règle locale atypique, organisme qui gère, exemple
officiel chiffré, date de paiement… Pas de généralités valables pour tous les états.

## Ce que tu rends

1. Les fichiers JSON (JSON valide : vérifie avec `python3 -m json.tool <fichier>`).
2. En réponse finale, un court compte rendu : état par état, les points incertains, les changements
   de taux 2025-2026 que tu as trouvés, et toute contradiction entre sources.

Ne touche à rien d'autre dans le dépôt. Pas de git, pas de push.
