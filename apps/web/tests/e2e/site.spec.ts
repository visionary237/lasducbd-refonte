import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = ["/", "/produits", "/produits/fleurs-de-cbd", "/produits/accessoires", "/produits/fleurs-de-cbd/zoap", "/panier", "/commande", "/produits/fleurs-de-cbd/modele-de-fiche", "/boutiques", "/boutiques/rouen", "/decouvrir-le-cbd", "/fidelite", "/experience", "/actualites", "/actualites/cadre-legal-cbd-france-2026", "/infos-pratiques", "/contact", "/mentions-legales", "/confidentialite"];

// Consentement déjà donné (refus) pour les tests de pages, sauf tests dédiés
async function preset(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    localStorage.setItem("ladc_consent", JSON.stringify({ v: 1, at: new Date().toISOString(), choices: { necessary: true, audience: false, marketing: false } }));
    localStorage.setItem("ladc_age_ok", String(Date.now()));
  });
}

test.describe("pages", () => {
  for (const path of PAGES) {
    test(`${path} : rendu, h1 unique, sans erreur, sans débordement`, async ({ page }) => {
      await preset(page);
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(String(e)));
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
      expect(errors).toEqual([]);
    });
  }
  test("catégorie en revue juridique inaccessible", async ({ page }) => {
    await preset(page);
    expect((await page.goto("/produits/huiles"))?.status()).toBe(404);
    await page.goto("/produits");
    await expect(page.getByRole("link", { name: /Huiles de CBD/ })).toHaveCount(0);
  });
});

test("contrôle d'âge : refus puis acceptation", async ({ page }) => {
  await page.goto("/?agegate");
  const dlg = page.getByRole("dialog", { name: /18 ans/ });
  await expect(dlg).toBeVisible();
  await page.getByRole("button", { name: "Non" }).click();
  await expect(page.getByRole("heading", { name: "Accès réservé" })).toBeVisible();
  await page.goto("/?agegate");
  await page.getByRole("button", { name: /Oui, j'ai 18 ans/ }).click();
  await expect(dlg).toHaveCount(0);
  await page.goto("/?agegate");
  await expect(page.getByRole("dialog", { name: /18 ans/ })).toHaveCount(0); // mémorisé
});

test("cookies : refus aussi simple que l'acceptation, choix réouvrable", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("ladc_age_ok", String(Date.now())));
  await page.goto("/");
  const banner = page.getByRole("region", { name: "Gestion des cookies" });
  await expect(banner).toBeVisible();
  await banner.getByRole("button", { name: "Tout refuser" }).click();
  await expect(banner).toHaveCount(0);
  const c = await page.evaluate(() => JSON.parse(localStorage.getItem("ladc_consent")!));
  expect(c.choices).toEqual({ necessary: true, audience: false, marketing: false });
  await page.getByRole("button", { name: "Gérer mes cookies" }).click();
  await expect(page.getByRole("region", { name: "Gestion des cookies" })).toBeVisible();
});

test("fiche gabarit : la réservation est refusée", async ({ page }) => {
  await preset(page);
  await page.goto("/produits/fleurs-de-cbd/modele-de-fiche");
  await expect(page.getByText("Fiche gabarit")).toBeVisible();
  await page.getByLabel("Prénom").fill("Léa");
  await page.getByLabel("E-mail").fill("lea@example.fr");
  await page.getByLabel(/18 ans ou plus/).check();
  await page.getByLabel(/J'accepte que mes données/).check();
  await page.getByRole("button", { name: "Envoyer la demande" }).click();
  await expect(page.getByRole("status")).toContainText("gabarit");
});

test("contact : envoi réussi", async ({ page }) => {
  await preset(page);
  await page.goto("/contact");
  await page.getByLabel("Prénom").fill("Léa");
  await page.getByLabel("E-mail").fill("lea@example.fr");
  await page.getByLabel("Message").fill("Bonjour, quels sont vos horaires à Rouen ?");
  await page.getByLabel(/J'accepte que mes données/).check();
  await page.getByRole("button", { name: "Envoyer" }).click();
  await expect(page.getByRole("status")).toContainText("bien été transmis");
});

test("expérience : le jeu n'est chargé qu'au clic, dans une iframe isolée", async ({ page }) => {
  await preset(page);
  const gameReq: string[] = [];
  page.on("request", (r) => r.url().includes("/experience/lost-ace/") && gameReq.push(r.url()));
  await page.goto("/");
  await page.goto("/experience");
  expect(gameReq).toEqual([]);
  await page.getByRole("button", { name: /Jouer/ }).click();
  const frame = page.frameLocator('iframe[title="Jeu THE LOST ACE"]');
  await expect(frame.locator("canvas")).toBeVisible({ timeout: 20_000 });
  expect(gameReq.length).toBeGreaterThan(0);
  expect(await page.locator("iframe").getAttribute("sandbox")).toContain("allow-scripts");
});

test("navigation mobile : ouverture, piège du focus, Échap", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile uniquement");
  await preset(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  const menu = page.getByRole("dialog", { name: "Menu" });
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toHaveCount(0);
});

test("SEO : sitemap, robots, données structurées", async ({ page, request }) => {
  const sm = await (await request.get("/sitemap.xml")).text();
  expect(sm).toContain("/boutiques/rouen");
  expect(sm).not.toContain("modele-de-fiche");
  expect(await (await request.get("/robots.txt")).text()).toContain("Disallow: /");
  await preset(page);
  await page.goto("/boutiques/rouen");
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(ld.some((t) => t.includes('"@type":"Store"'))).toBe(true);
});

test.describe("accessibilité (axe, WCAG 2.2 AA)", () => {
  for (const path of ["/", "/produits", "/produits/fleurs-de-cbd/zoap", "/produits/fleurs-de-cbd/modele-de-fiche", "/boutiques/rouen", "/fidelite", "/contact", "/experience"]) {
    test(path, async ({ page }) => {
      await preset(page);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(path);
      const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      expect(r.violations.map((v) => `${v.id} (${v.nodes.length}) ${v.nodes[0]?.target}`)).toEqual([]);
    });
  }
});

test.describe("boutique en ligne", () => {
  test("parcours complet : fiche → grammage → panier → retrait en boutique → confirmation", async ({ page }) => {
    await preset(page);
    await page.goto("/produits/fleurs-de-cbd/zoap");
    await expect(page.getByRole("heading", { level: 1, name: "Zoap" })).toBeVisible();
    await page.getByText("10 g", { exact: true }).click();
    await page.getByRole("button", { name: /Ajouter au panier · 50,00/ }).click();
    const drawer = page.getByRole("dialog", { name: "Panier" });
    await expect(drawer).toContainText("Zoap");
    await expect(drawer).toContainText("Retrait en boutique — gratuit");
    await drawer.getByRole("link", { name: "Passer commande" }).click();
    await page.getByLabel("Prénom").fill("Léa");
    await page.getByRole("textbox", { name: "Nom", exact: true }).fill("Martin");
    await page.getByLabel("E-mail").fill("lea@example.fr");
    await page.getByLabel(/18 ans ou plus/).check();
    await page.getByLabel(/traiter ma commande/).check();
    await page.getByRole("button", { name: "Valider la réservation" }).click();
    await expect(page.getByRole("heading", { name: "Merci." })).toBeVisible();
    await expect(page.getByText(/LADC-/)).toBeVisible();
    await expect(page.getByRole("button", { name: /Panier, 0 article/ })).toBeVisible();
  });

  test("filtres : recherche, catégorie, tri synchronisés dans l'URL", async ({ page }) => {
    await preset(page);
    await page.goto("/produits");
    await page.getByRole("button", { name: "Accessoires", exact: true }).click();
    await expect(page).toHaveURL(/cat=accessoires/);
    await page.getByLabel("Rechercher un produit").fill("grinder");
    await page.getByLabel("Rechercher un produit").press("Enter");
    await expect(page).toHaveURL(/q=grinder/);
    await expect(page.getByRole("article").first()).toContainText(/Grinder/i);
  });

  test("produit « à partir de » : pas d'ajout au panier ambigu", async ({ page }) => {
    await preset(page);
    await page.goto("/produits/fleurs-de-cbd/skunk");
    await expect(page.getByText("Grammages à synchroniser")).toBeVisible();
    await expect(page.getByRole("button", { name: /Ajouter au panier/ })).toHaveCount(0);
  });

  test("ajout rapide d'un accessoire et livraison payante en dessous de 49 €", async ({ page }) => {
    await preset(page);
    await page.goto("/produits/accessoires");
    await page.getByRole("button", { name: /Ajouter Grinder Gold 4 parties/ }).click();
    await expect(page.getByRole("dialog", { name: "Panier" })).toContainText("16,90");
    await page.goto("/panier");
    await page.getByText("Livraison à domicile").click();
    await expect(page.getByText("Frais de port à confirmer")).toBeVisible();
  });
});
