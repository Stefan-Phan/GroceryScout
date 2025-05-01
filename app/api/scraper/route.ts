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

      // Fetch from Woolworths
      try {
        const wooliesPage = await browser.newPage();

        await wooliesPage.setUserAgent(
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
        );

        await wooliesPage.setExtraHTTPHeaders({
          "Accept-Language": "en-US,en;q=0.9",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
          "Upgrade-Insecure-Requests": "1",
        });

        await new Promise((resolve) =>
          setTimeout(resolve, 1000 + Math.random() * 2000)
        );

        await wooliesPage.goto(
          `https://www.woolworths.com.au/shop/search/products?searchTerm=${wooliesKeyword}`,
          {
            waitUntil: "networkidle2",
            timeout: 30000,
          }
        );

        console.log("Hey");

        const wooliesProducts = await wooliesPage.evaluate(() => {
          const productCards = document.querySelectorAll(".shelfProductTile");
          return Array.from(productCards).map((card) => {
            const nameElement = card.querySelector(".shelfProductTile-title");
            const priceElement = card.querySelector(".shelfProductTile-price");
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

        console.log(wooliesProducts);

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
        console.log(
          `Error scraping Woolworths for "${wooliesKeyword}":`,
          wooliesError
        );
      }

      // Fetch from Coles
      // try {
      //   const colesPage = await browser.newPage();

      //   await colesPage.goto(
      //     `https://www.coles.com.au/search/products?q=${encodeURIComponent(
      //       colesKeyword
      //     )}`,
      //     {
      //       waitUntil: "domcontentloaded",
      //       timeout: 30000,
      //     }
      //   );

      //   await new Promise((resolve) => setTimeout(resolve, 2000));

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
      //   console.log(`Error scraping Coles for "${colesKeyword}":`, colesError);
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
    console.log(sortedProducts);
    return Response.json(sortedProducts);
  } catch (error) {
    console.log("Scraping error", error);
  } finally {
    await browser.close();
  }
}
