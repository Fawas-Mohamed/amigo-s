import {chromium} from "file:///C:/Users/Fawas/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";
import fs from "node:fs/promises";
const browser=await chromium.launch({headless:true});
const results=[];
for(const size of [{width:1832,height:780},{width:1848,height:807}]){
 const page=await browser.newPage({viewport:size,deviceScaleFactor:1});
 await page.goto("http://127.0.0.1:5173/",{waitUntil:"domcontentloaded"});
 await page.locator("#story").scrollIntoViewIfNeeded();
 await page.waitForTimeout(100);
 await page.evaluate(()=>document.querySelector("#story").scrollIntoView({block:"start"}));
 await page.locator("#story").evaluate(async el=>Promise.all([...el.querySelectorAll("img")].map(img=>img.decode().catch(()=>null))));
 await page.screenshot({path:"D:/amigos-shop (3)/amigos/artifacts/responsive/story-alignment-"+size.width+".png",fullPage:false,animations:"disabled"});
 results.push(await page.evaluate(()=>({viewport:innerWidth,storyHeadingTop:Math.round(document.querySelector(".story-title").getBoundingClientRect().top),storyGridTop:Math.round(document.querySelector(".story-grid").getBoundingClientRect().top),documentWidth:document.documentElement.scrollWidth})));
 await page.close();
}
await fs.writeFile("D:/amigos-shop (3)/amigos/artifacts/responsive/story-alignment.json",JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
await browser.close();
