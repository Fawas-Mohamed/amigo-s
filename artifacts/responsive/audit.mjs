import { chromium } from "file:///C:/Users/Fawas/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";
import fs from "node:fs/promises";
const base = "http://127.0.0.1:5173";
const root = "D:/amigos-shop (3)/amigos/artifacts/responsive";
const out = root + "/before";
const widths = [320,360,375,390,414,480,600,768,820,844,1024,1280,1440,1920,2560];
const routes = ["/","/menu","/about","/#instagram","/admin","/admin/products","/admin/categories","/admin/orders","/admin/customers","/admin/settings"];
await fs.mkdir(out,{recursive:true});
const browser = await chromium.launch({headless:true});
const context = await browser.newContext({viewport:{width:1280,height:900},deviceScaleFactor:1});
await context.addInitScript(() => localStorage.setItem("amigos-auth","1"));
const page = await context.newPage();
const errors = [];
page.on("pageerror",e=>errors.push({type:"pageerror",text:e.message,url:page.url()}));
page.on("console",m=>{if(m.type()==="error") errors.push({type:"console",text:m.text(),url:page.url()})});
const matrix=[];
for (const route of routes) {
  for (const width of widths) {
    const height = width===844 ? 390 : 900;
    await page.setViewportSize({width,height});
    await page.goto(base+route,{waitUntil:"domcontentloaded",timeout:30000});
    await page.waitForTimeout(100);
    const result = await page.evaluate(() => {
      const width=window.innerWidth;
      const els=[...document.querySelectorAll("body *")];
      const offenders=els.map(el=>{const r=el.getBoundingClientRect();return {tag:el.tagName.toLowerCase(),className:typeof el.className==="string"?el.className:"",id:el.id,left:Math.round(r.left),right:Math.round(r.right),scrollWidth:el.scrollWidth,clientWidth:el.clientWidth}}).filter(x=>x.right>width+1||x.left < -1).slice(0,20);
      return {innerWidth:width,documentWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,overflowX:getComputedStyle(document.body).overflowX,offenders};
    });
    matrix.push({route,width,height,status:Math.max(result.documentWidth,result.bodyWidth)>width?"OVERFLOW":"OK",...result});
  }
}
async function go(route,width,height=900) {
  await page.setViewportSize({width,height});
  await page.goto(base+route,{waitUntil:"domcontentloaded",timeout:30000});
  await page.waitForTimeout(160);
}
async function capturePart(route,selector,name,width) {
  await go(route,width);
  await page.locator(selector).screenshot({path:out+"/"+name+"-"+width+".png",animations:"disabled",timeout:15000});
}
async function capturePage(route,name,width,action) {
  await go(route,width);
  if (action) await action();
  await page.screenshot({path:out+"/"+name+"-"+width+".png",fullPage:false,animations:"disabled"});
}
for (const width of [360,768,1440]) {
  await capturePart("/",".hero","home-hero",width);
  await capturePart("/",".ribbons","home-ribbons",width);
  await capturePart("/",".insta","home-instagram",width);
  await capturePage("/menu","menu-drawer",width,async()=>{
    await page.locator(".prod .plus:not([disabled])").first().click();
    await page.locator(".order-fab").click();
    await page.locator(".drawer").waitFor();
    await page.evaluate(()=>window.scrollTo(0,0));
  });
  await capturePart("/about",".about-hero","about",width);
  await capturePage("/admin","admin-dashboard",width);
  await capturePage("/admin/products","admin-items",width);
  await capturePage("/admin/products","admin-modal",width,async()=>{
    await page.getByRole("button",{name:/Add item/}).click();
    await page.locator(".ad-modal").waitFor();
  });
}
await fs.writeFile(out+"/overflow-before.json",JSON.stringify({widths,routes,matrix,errors},null,2));
console.log(JSON.stringify({auditRows:matrix.length,overflowRows:matrix.filter(x=>x.status==="OVERFLOW").length,consoleErrors:errors.length,screenshots:24,report:out+"/overflow-before.json",sample:matrix.filter(x=>x.status==="OVERFLOW").slice(0,8),errors:errors.slice(0,10)},null,2));
await browser.close();
