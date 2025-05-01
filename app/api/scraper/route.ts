import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";
import { Product } from "@/types/Product";

chromium.setHeadlessMode = true;
chromium.setGraphicsMode = false;

export async function POST(request: Request) {
  const { keywords } = await request.json();

  console.log(keywords);

  await chromium.font(
    "https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf"
  );

  const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;

  const browser = await puppeteer.launch({
    args: isLocal
      ? puppeteer.defaultArgs()
      : [...chromium.args, "--hide-scrollbars", "--incognito", "--no-sandbox"],
    defaultViewport: chromium.defaultViewport,
    executablePath:
      process.env.CHROME_EXECUTABLE_PATH ||
      (await chromium.executablePath(
        "https://ap-southeast-2.console.aws.amazon.com/s3/buckets/stefan-media-assets?region=ap-southeast-2&bucketType=general&prefix=chromium-v126.0.0-pack/&showversions=false"
      )),
    headless: chromium.headless,
  });

  const allProducts: Product[] = [];

  try {
    for (const item of keywords) {
      const { id, wooliesKeyword, colesKeyword } = item;

      // --- Woolworths Scraping ---
      try {
        const wooliesPage = await browser.newPage();

        // Configure user agent and headers for a more realistic request
        await wooliesPage.setUserAgent(
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
        );
        await wooliesPage.setExtraHTTPHeaders({
          "Accept-Language": "en-US,en;q=0.9",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
          "Upgrade-Insecure-Requests": "1",
        });

        // Introduce a small random delay before navigating
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 + Math.random() * 1500)
        );

        const wooliesSearchUrl = `https://www.woolworths.com.au/shop/search/products?searchTerm=${encodeURIComponent(
          wooliesKeyword
        )}`;
        console.log(`Fetching Woolworths: ${wooliesSearchUrl}`);
        await wooliesPage.goto(wooliesSearchUrl, {
          waitUntil: "networkidle2",
          timeout: 30000,
        });

        // Wait for product tiles to load (adjust selector and timeout if needed)
        await wooliesPage.waitForSelector("shared-product-tile", {
          timeout: 10000,
        });

        const wooliesProducts = await wooliesPage.evaluate(() => {
          const productCards = document.querySelectorAll("ng-tns-c865356747-4");
          console.log(productCards.length);
          return Array.from(productCards).map((card) => {
            const nameElement = card.querySelector(".shelfProductTile-title");
            const priceElement = card.querySelector(
              ".product-tile-price > .primary"
            );
            const imageElement = card.querySelector("img");
            const linkElement = card.querySelector("a");

            return {
              name:
                nameElement?.textContent?.trim() || "Product Name Unavailable",
              price: priceElement?.textContent?.trim() || "Price Unavailable",
              image: imageElement?.getAttribute("src") || "",
              link: (linkElement as HTMLAnchorElement)?.href || "#",
            };
          });
        });

        // console.log("Woolworths Products:", wooliesProducts);

        allProducts.push(
          ...wooliesProducts.map((p) => ({
            ...p,
            keyword: wooliesKeyword,
            id,
            store: "Woolies",
          }))
        );

        await wooliesPage.close();
      } catch (wooliesError) {
        console.error(
          `Error scraping Woolworths for "${wooliesKeyword}":`,
          wooliesError
        );
      }

      // --- Coles Scraping ---
      // try {
      //   const colesPage = await browser.newPage();

      //   // Configure user agent and headers
      //   await colesPage.setUserAgent(
      //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
      //   );
      //   await colesPage.setExtraHTTPHeaders({
      //     "Accept-Language": "en-US,en;q=0.9",
      //     Accept:
      //       "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      //     "Accept-Encoding": "gzip, deflate, br",
      //     Connection: "keep-alive",
      //     "Upgrade-Insecure-Requests": "1",
      //   });

      //   await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1500));

      //   const colesSearchUrl = `https://www.coles.com.au/search/products?q=${encodeURIComponent(
      //     colesKeyword
      //   )}`;
      //   console.log(`Fetching Coles: ${colesSearchUrl}`);
      //   await colesPage.goto(colesSearchUrl, {
      //     waitUntil: "domcontentloaded",
      //     timeout: 30000,
      //   });

      //   // Wait for product tiles to load (adjust selector and timeout if needed)
      //   await colesPage.waitForSelector(".product-tile", { timeout: 10000 });

      //   const colesProducts = await colesPage.evaluate(() => {
      //     const productCards = document.querySelectorAll(".product-tile");
      //     return Array.from(productCards).map((card) => {
      //       const nameElement = card.querySelector(".product-name");
      //       const priceElement = card.querySelector(".price-container");
      //       const imageElement = card.querySelector("img");
      //       const linkElement = card.querySelector("a");

      //       return {
      //         name:
      //           nameElement?.textContent?.trim() || "Product Name Unavailable",
      //         price: priceElement?.textContent?.trim() || "Price Unavailable",
      //         image: imageElement?.getAttribute("src") || "",
      //         link: (linkElement as HTMLAnchorElement)?.href || "#",
      //       };
      //     });
      //   });

      //   console.log("Coles Products:", colesProducts);

      //   allProducts.push(
      //     ...colesProducts.map((p) => ({
      //       ...p,
      //       keyword: colesKeyword,
      //       id,
      //       store: "Coles",
      //     }))
      //   );

      //   await colesPage.close();
      // } catch (colesError) {
      //   console.error(`Error scraping Coles for "${colesKeyword}":`, colesError);
      // }
    }

    // Sort all products by price (smallest to largest)
    const productsWithNumericPrice = allProducts.map((product) => ({
      ...product,
      numericPrice: parseFloat(product.price.replace(/[^\d.]/g, "")),
    }));

    const sortedProducts = productsWithNumericPrice.sort((a, b) => {
      const priceA = a.numericPrice === undefined ? Infinity : a.numericPrice;
      const priceB = b.numericPrice === undefined ? Infinity : b.numericPrice;
      return priceA - priceB;
    });

    return Response.json(sortedProducts);
  } catch (error) {
    console.error("Scraping error:", error);
    return new Response(JSON.stringify({ error: "Scraping failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await browser.close();
  }
}
