"""Construit content/products.json à partir des relevés des pages catégories du site actuel (19/11/2026).
Règles : nom, prix affiché, URL et image tels que relevés ; aucune description importée
(les fiches actuelles contiennent des allégations de santé) ; taux CBD/THC = null sauf relevé explicite."""
import json, re, unicodedata, pathlib
BASE = "https://coffeeshop-lasducbd.fr"
UP = BASE + "/wp-content/uploads/"
HERE = pathlib.Path(__file__).parent
def slug(s):
    s = unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")
def price(t):
    m = re.search(r"(\d+(?:[.,]\d+)?)\s*€", t)
    if not m: return None, False, None
    v = round(float(m.group(1).replace(",", ".")) * 100)
    if v <= 0: return None, False, None
    unit = "le g" if "le g" in t else None
    return v, t.lower().startswith("à partir"), unit
# Produits retenus mais masqués : statut réglementaire à valider (infusion = ingestion / isolat)
LEGAL_REVIEW = {"Infusbar X10": "Produit d'infusion : relève potentiellement de l'interdiction Novel Food (ingestion).",
                "Infusbar X1": "Produit d'infusion : relève potentiellement de l'interdiction Novel Food (ingestion).",
                "Crystal de CBD": "Isolat : usage et statut à préciser avant publication."}
V = lambda a, b, c: [("1 g", a, True), ("10 g", b, True), ("100 g", c, True)]
KNOWN = {
 "Zoap": {"cbdPercent": 21, "thcPercent": 0.18, "variants": V(700, 5000, 40000)},
 "Amnesia indoor": {"cbdPercent": 14.9, "thcPercent": 0.24, "cultivation": "Indoor", "variants": V(700, 5000, 35000)},
 "Wedding Cake": {"cbdPercent": 17.2, "thcPercent": 0.19, "cultivation": "Indoor", "origin": "Californie (USA)", "variants": V(900, 7000, 50000)},
 "Gorilla Glue": {"cbdPercent": 13.9, "thcPercent": 0.21, "variants": V(500, 3000, 25000), "note": "Fiche actuelle contradictoire : 13,9 % CBD / 0,21 % THC en en-tête, 7,9 % / 0,17 % dans le texte — à corriger à la source."},
 "Purple Haze USA": {"cbdPercent": 12.2, "thcPercent": 0.28, "variants": V(1000, 8000, 60000)},
 "Blue Cheese": {"cbdPercent": 12.7, "thcPercent": 0.28, "variants": V(600, 4000, 35000)},
 "Lemon Haze": {"cbdPercent": 13.6, "thcPercent": 0.22, "variants": [("1 g", 500, True), ("10 g", 2500, False), ("100 g", 25000, True)],
         "note": "Fiche actuelle : taux de CBD indiqué à 13,6 % dans l'encadré et 11 % dans le texte — à corriger à la source."}}
NEW = {"Zoap", "Skunk", "Uranium", "MAUii", "Smoothix", "Résine CBD Malabar-Zoap", "Résine CBD Le Hollandais"}
out, seen = [], set()
def add(file, cat, unitDefault=None):
    for line in (HERE / file).read_text().strip().splitlines():
        parts = line.split("|")
        name, ptxt, path, img = parts[:4]
        sub = parts[4] if len(parts) > 4 else None
        if path in seen: continue
        seen.add(path)
        cents, frm, unit = price(ptxt)
        k = KNOWN.get(name, {})
        p = {"id": "lasducbd-" + slug(path.strip("/").split("/")[-1]), "slug": slug(name), "name": name, "categorySlug": cat,
             "subcategory": sub, "priceCents": cents, "priceFrom": frm, "priceUnit": unit or unitDefault,
             "images": [{"src": UP + img, "alt": name}], "attributes": {"cbdPercent": k.get("cbdPercent"), "thcPercent": k.get("thcPercent"), "origin": k.get("origin"), "cultivation": k.get("cultivation"), "formats": [v[0] for v in k.get("variants", [])]},
             "variants": [{"label": a, "priceCents": b, "inStock": c} for a, b, c in k.get("variants", [])] or None,
             "inStock": cents is not None, "isNew": name in NEW, "labReport": None, "eshopUrl": BASE + path,
             "dataNote": k.get("note"), "compliance": "legal-review" if name in LEGAL_REVIEW else "ok", "complianceNote": LEGAL_REVIEW.get(name),
             "source": {"system": "releve-pages-categories", "importedAt": "2026-11-19"}}
        out.append(p)
add("fleurs.txt", "fleurs-de-cbd"); add("solides.txt", "hash-et-extractions"); add("ecbd.txt", "e-cbd"); add("cosmetiques.txt", "cosmetiques"); add("accessoires.txt", "accessoires")
# slugs uniques par catégorie
by = {}
for p in out:
    k = (p["categorySlug"], p["slug"]); by[k] = by.get(k, 0) + 1
    if by[k] > 1: p["slug"] += f"-{by[k]}"
(HERE.parent.parent / "content" / "products.json").write_text(json.dumps(out, ensure_ascii=False, indent=1))
print(len(out), {c: sum(1 for p in out if p["categorySlug"] == c) for c in {p["categorySlug"] for p in out}}, "sans prix:", sum(1 for p in out if p["priceCents"] is None))
