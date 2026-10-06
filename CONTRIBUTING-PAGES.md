# Ajouter ou étoffer une page de Tax Rates by State

Notice pour les agents qui prolongent le site. À lire en entier avant d'écrire, avec
`~/Documents/GitHub/RECETTE-SITE.md` (§0, §6, §6.5, §7, §9.3, §11, §17.4, §21, §26).

Le site : sales tax et property tax des 50 états et du District of Columbia. **Anglais américain seul**, sous `/en/`
(préfixe gardé de la trame pour la racine et les contrôleurs). Dollars, `$` devant, virgule des milliers.

**Portefeuille** : truetakehomepay.com, salaryafter.com et costoflivingusa.com sont des sites américains du même éditeur.
Aucun recouvrement (ni salaire net, ni impôt sur le revenu, ni coût de la vie) et **aucun lien** vers eux ni vers
un autre domaine de `_trame/domaines-ovh.txt`.

## Deux familles de pages, un fichier chacune

| Page | Fichiers | Route |
|---|---|---|
| Page d'état (51) | `src/data/states/<slug>.json` (faits officiels) + `src/content/states/<slug>.ts` (prose, `StateDef`) | `/en/<slug>/` |
| Page thématique | `src/content/pages/<id>.ts` (`PageDef`) | `/en/<slug>/` |

Le cœur lit ces fichiers seul : routes, menus, pied de page (tous les états dans la rangée « Every state »), sitemap,
schémas `Article`, `WebPage`, `WebApplication`, `FAQPage`, `BreadcrumbList`, tableaux des 51 états. **Aucun fichier du
cœur à toucher pour ajouter une page.** Types : `src/lib/page-types.ts`.

### Le fichier de faits d'un état (`src/data/states/<slug>.json`)

Schéma et règles de vérité : `research/BRIEF-FAITS.md` (relevé du 2026-10-05). Chaque fait porte l'URL officielle
où il a été lu (département des finances / revenue de l'état, statut, assessor). Jamais Avalara, TaxJar, Tax Foundation,
un média ou un autre calculateur comme source. Un chiffre non lu sur une source officielle reste `null` et part dans
`uncertain`. **Aucun taux local de ville ou de comté** : le visiteur le saisit (lien `local.lookupUrl`).

Champs ajoutés à la normalisation (2026-10-05) et lus par le moteur :
- `sales.clothing.thresholdMode` : `excess` (seule la part au-dessus du seuil est taxée : MA, RI) ou `item`
  (article sous le seuil exonéré, au-dessus taxé en entier : NY) ;
- `sales.clothing.localFollows: false` quand les taxes locales restent dues sous le seuil (NY, selon le comté) ;
- `sales.local.groceriesLocalRate` (+ `groceriesLocalAlways`) : taux local fixe sur l'épicerie (Illinois 1 % là où il est adopté, Virginie 1 % partout) ;
- `sales.prescriptionDrugs.rate` (taux d'état réduit, Illinois 1 %) et `localTaxed: false` ;
- `property.assessment.capped` + `capText` + `capUrl` : plafond ou gel de la valeur imposable (page des plafonds) ;
- Idaho : serveurs de l'État injoignables le 2026-10-05, faits de sales tax lus sur les pages officielles archivées par l'Internet Archive (URL web.archive.org datées).

La page d'état affiche seule, à partir du JSON : les chiffres clés, le tableau des règles par article, les taxes locales,
les vacances fiscales 2026, les faits (`facts`), l'encadré homestead, les autres allègements, les chiffres Census et
toutes les sources. **La prose (`.ts`) ne répète pas ces blocs** : elle explique ce qui est singulier dans l'état.

### La prose d'un état (`src/content/states/<slug>.ts`)

Modèle : `src/content/states/new-york.ts` (la structure, jamais les phrases).

| Champ | Règle |
|---|---|
| `slug` | = nom du fichier = slug du JSON. |
| `title` | 50 à 60 caractères, contient 2026, commence par « <State> Sales Tax 2026 » (ou « <State> Property Tax 2026 » si c'est la vraie requête de l'état). Pas de tiret cadratin. Unique. |
| `description` | 150 à 160 caractères, contient 2026 et au moins un chiffre tiré des faits. Unique. |
| `intro` | une phrase. |
| `resume` | **UN** paragraphe de 120 mots ou plus (viser 130 à 170) : la réponse à « <state> sales tax » et « <state> property tax », chiffres compris. S'affiche replié : la première phrase porte le message. |
| `sales(h)` | HTML, ≥ 180 mots de prose (viser 220 à 320) : ce qui est propre à l'état (structure des taxes locales, exemptions singulières, réformes datées, exemple chiffré calculé). |
| `property(h)` | HTML, ≥ 180 mots (viser 220 à 320) : qui lève l'impôt, évaluation, plafonds, homestead, exemple calculé avec `ptx`. |
| `faqs` | 3 à 5 vraies questions qui contiennent le nom de l'état, réponses de **45 à 85 mots** (le contrôle compte 40-90), uniques sur tout le site. |
| `related` | 3 à 6 identifiants : états voisins (slug) et pages thématiques (id). |

## La règle des chiffres (non négociable, RECETTE §17.4 point 7)

Aucun taux, seuil ou montant qui existe dans un champ structuré n'est tapé en dur : il se lit dans les faits ou se calcule.

```ts
import { st, usd, rate, eff, tx, ptx, rank } from '../../lib/kit';
const s = st('texas'); const S = s.sales, C = s.census;
title: `Texas Sales Tax 2026: ${rate(S.stateRate)} State Rate, Property Tax ${eff(C.effectiveRate)}`
`a ${usd(1000)} TV costs ${usd(tx('texas', 1000).stateTax, 2)} of state tax`   // le résultat se calcule
`at the typical rate, a ${usd(300000)} home pays about ${usd(ptx('texas', 300000))}`
```

Un prix d'exemple (« a $1,000 TV ») est une hypothèse et peut s'écrire `usd(1000)`. Un chiffre qui n'existe que dans
une note texte du JSON (ex. « 0.375% MCTD ») peut être cité tel qu'écrit dans la note. Un chiffre absent du JSON et
du fichier Census **ne s'écrit pas** (ajoutez-le d'abord au JSON, avec sa source officielle).

Dans le corps, `h` fournit : `h.a(id, texte)` (lien interne ; un id inconnu fait échouer le test), `h.usd`, `h.rate`
(taux statutaire en %), `h.eff` (ratio Census), `h.num`, `h.day(iso)`, `h.table(entêtes, lignes, légende, alignements)`,
`h.src(clé, texte)` (source générale de `params-2026.json`), `h.ext(url, texte)` (lien officiel), `h.st(slug)`,
`h.tx(slug, prix, catégorie?, tauxLocal?)`, `h.ptx(slug, valeur)`, `h.box(titre, html)`, `h.stateTable(cols, tri, filtre?)`,
`h.states`. Catégories du moteur : `general`, `groceries`, `clothing`, `prescription`.

## Pages thématiques (`src/content/pages/<id>.ts`)

Modèles : `how-property-tax-is-calculated.ts` (guide + `mini`), `property-tax-calculator.ts` (page outil, `tool`).
`group` : `calculators`, `sales`, `property`. Outils (`tool`) : `sales`, `reverse`, `property`, `compare`.
Mini-simulateurs : `src/lib/minis/<kind>.ts` ; **un mini n'importe jamais `engine/states.ts`** (les 51 fichiers partiraient
dans le navigateur) : les chiffres d'état passent par `miniArg` (JSON construit avec le kit dans la page), ou par
`<!--mini:<kind>|<slug>-->` dans le corps. Guides : ≥ 850 mots de prose hors tableaux, FAQ 3 à 8 ; pages outil ≥ 250.
`sources` : clés de `params-2026.json > sources` ou `state:<slug>`.

## Ton et langue

- **Anglais américain** : « color », « neighbor », « homeowner », « county assessor », « levy », « mill rate », « tax bill ».
- Voix humaine, phrases de longueur variable, **le chiffre d'abord**. Interdits (le test les refuse) : tiret cadratin
  « — », « it's important to note », « dive into », « delve », « whether you're… », « navigate the », « Moreover »,
  « Additionally », « Furthermore ». Pas de triplets en série, pas de conclusion qui résume, pas d'émoji.
- **Local réel** : organismes (Comptroller of Public Accounts, CDTFA, Department of Revenue…), programmes (STAR,
  Save Our Homes, Proposition 13…), villes et comtés réels, tels qu'ils figurent dans les faits.
- **Unicité** (§6) : `check-unique` compare toutes les pages, chiffres neutralisés, seuil 30 % ; la fenêtre ne lit que les
  12 000 premiers caractères. Écrire ce qui n'appartient qu'à l'état, avec un vocabulaire propre ; aucune tournure reprise
  d'un autre état ni d'un autre site du portefeuille (`check-portefeuille`).

## Contrôles (tous à 0)

```bash
cd ~/Documents/GitHub/a-publier/Mottalib-10M/us-sales-property-tax
export NODE_PATH=$(npm root -g):$PWD/node_modules
S=~/Documents/GitHub/_trame/_template/scripts
PAGE_FILES=texas npx vitest run tests/pages.test.ts   # une page
npm run build && npx vitest run
python3 $S/check-seo.py . ; python3 $S/check-trame.py . ; python3 $S/check-unique.py dist
python3 $S/check-simulateurs.py . ; python3 $S/check-regles.py . ; python3 $S/check-portefeuille.py .
node $S/check-sources.mjs . ; node scripts/check-legal.mjs ; node $S/check-contraste.mjs dist
node $S/check-saisie.mjs dist --max=60 ; node $S/check-nombres.mjs dist ; node scripts/typo-nbsp.mjs dist --check
node $S/check-layout.mjs dist > /tmp/layout.log 2>&1   # long : en arrière-plan
```

## Mise à jour annuelle

1. Relire chaque `src/data/states/<slug>.json` sur ses URL (taux, épicerie, vêtements, vacances fiscales de l'année,
   homestead) ; mettre `verified` à la date de lecture.
2. `python3 scripts/data/build-census.py <année ACS>` dès que le Census publie l'ACS 1 an suivant (septembre).
3. Mettre à jour `params-2026.json` (renommer à l'année) et `LAST_UPDATED` de `src/data/site-config.ts`.
4. Tous les contrôles, puis commit local en français, dernière ligne `Co-Authored-By: …`.

## Ce qu'on ne fait pas

- Pas de dépôt GitHub ni de push sans validation de l'éditeur, pas de DNS.
- Ne pas toucher à `_trame` ni à la RECETTE : les suggestions vont dans le compte rendu.
- Publicité : désactivée (`AdSlot` de la trame non utilisé) ; au plus 3 emplacements par page le jour où elle sera activée.
