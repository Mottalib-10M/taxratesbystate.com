# Brief : la prose des pages d'état (2026-10-05)

Tu écris `src/content/states/<slug>.ts` pour une liste d'états, dans
`~/Documents/GitHub/a-publier/Mottalib-10M/us-sales-property-tax`. Travaille seul jusqu'au bout, sans poser de question.

## À lire d'abord, en entier

1. `CONTRIBUTING-PAGES.md` (règles des champs, règle des chiffres, ton, interdits).
2. Le modèle `src/content/states/new-york.ts` : copie la **structure**, jamais les phrases ni les tournures.
3. Pour chacun de tes états : `src/data/states/<slug>.json` (les faits officiels lus le 2026-10-05) et sa ligne dans
   `src/data/census-acs.json` (taxe foncière médiane, valeur médiane, ratio).
4. `src/components/StatePage.astro`, pour voir ce que la page affiche déjà seule à partir du JSON (chiffres clés,
   tableau par article, taxes locales, vacances 2026, faits, homestead, Census, sources) : **ta prose ne le répète pas**,
   elle l'explique et le met en situation.

## Ce qui fait une bonne page d'état ici

- **La vérité d'abord** : tu n'écris que ce qui est dans le JSON de l'état ou dans le fichier Census. Rien de mémoire,
  rien d'un autre site. Un nom d'organisme, de programme, de loi, un seuil, une date : seulement s'ils figurent dans le
  JSON. Si tu veux un fait absent, tu ne l'écris pas (signale-le dans ton compte rendu).
- **Les chiffres** : taux, seuils et montants présents dans un champ structuré passent par le kit (`rate(S.stateRate)`,
  `usd(S.clothing.threshold)`, `usd(s.property.homestead.amount)`, `eff(C.effectiveRate)`…). Les résultats se calculent
  (`tx`, `ptx`). Un chiffre qui n'existe que dans une note texte du JSON peut être cité tel qu'il y est écrit.
- **Le singulier** : chaque état a quelque chose que les autres n'ont pas (GET d'Hawaï, TPT de l'Arizona, villes à
  charte du Colorado, taxe d'épicerie réduite, vacances fiscales, homestead à 140 000 $, plafond de 3 %, etc.). Ouvre
  là-dessus. Le vocabulaire doit différer d'un état à l'autre : `check-unique` mesure la similarité entre pages,
  chiffres neutralisés, seuil 30 %. Interdiction de bâtir toutes tes pages sur le même plan de phrases.
- **Utile** : un exemple chiffré calculé par état (un achat courant, une maison au prix médian), ce que le lecteur doit
  faire (où trouver son taux local, à qui demander l'exemption, quelle échéance).
- **Titres** : 50 à 60 caractères, avec 2026, commencent par « <State> Sales Tax 2026 » (ou « <State> Property Tax 2026 »
  quand la property tax est clairement le sujet de l'état). Descriptions : 150 à 160 caractères, avec 2026. Compte avec
  le test, pas à l'œil.
- **FAQ** : 3 questions (jusqu'à 5), formulées comme on les tape, avec le nom de l'état ; réponses de 45 à 85 mots,
  complètes en elles-mêmes, chiffre et condition compris. Aucune question reprise d'une autre page.
- `related` : 2 à 4 états voisins (slugs existants ou qui existeront : tous les états ont une page) et 1 à 3 pages
  thématiques parmi : `home`, `reverse-sales-tax-calculator`, `property-tax-calculator`, `state-tax-comparison`,
  `sales-tax-by-state`, `states-without-sales-tax`, `sales-tax-holidays`, `grocery-sales-tax-by-state`,
  `clothing-sales-tax-by-state`, `local-sales-tax-rates`, `use-tax`, `sales-tax-deduction`, `property-tax-by-state`,
  `how-property-tax-is-calculated`, `homestead-exemption-by-state`, `property-tax-assessment-caps`.

## Contrôle de chaque fichier

```bash
cd ~/Documents/GitHub/a-publier/Mottalib-10M/us-sales-property-tax
PAGE_FILES=<slug1>,<slug2> npx vitest run tests/pages.test.ts
```

Le test des liens `related` vers des états pas encore écrits peut échouer tant que les autres agents n'ont pas fini :
c'est le seul échec admis. Tout le reste (longueurs, mots interdits, FAQ, tiret cadratin) doit passer.

Ne touche à aucun autre fichier (ni JSON, ni cœur, ni pages thématiques), pas de git. En fin de travail, réponds en
français : la liste des fichiers écrits, les faits que tu aurais voulu citer mais qui manquent au JSON, et toute
incohérence repérée dans un JSON (taux, catégorie, URL).
