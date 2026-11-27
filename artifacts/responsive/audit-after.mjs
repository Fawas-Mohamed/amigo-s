import { chromium } from "file:///C:/Users/Fawas/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";
import fs from "node:fs/promises";
const base="http://127.0.0.1:5173";
const root="D:/amigos-shop (3)/amigos/artifacts/responsive";
const out=root+"/after";
const widths=[320,360,375,390,414,480,600,768,820,844,1024,1280,1440,1920,2560];
const routes=["/","/menu","/about","/#instagram","/admin","/admin/products","/admin/categories","/admin/orders","/admin/customers","/admin/settings"];
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1280,height:900},deviceScaleFactor:1});
await context.addInitScript(()=>localStorage.setItem("amigos-auth","1"));
const page=await context.newPage();
const errors=[];
page.on("pageerror",e=>errors.push({type:"pageerror",text:e.message,url:page.url()}));
page.on("console",m=>{if(m.type()==="error")errors.push({type:"console",text:m.text(),url:page.url()})});
const matrix=[];
for(const route of routes){
 for(const width of widths){
  const height=width===844?390:900;
  await page.setViewportSize({width,height});
  await page.goto(base+route,{waitUntil:"domcontentloaded",timeout:30000});
  await page.waitForTimeout(100);
  const result=await page.evaluate(()=>{
   const width=window.innerWidth;
   const nodes=[...document.querySelectorAll("body *")];
   const offenders=nodes.map(el=>{
    const rect=el.getBoundingClientRect();
    const style=getComputedStyle(el);
    let clipped=false;
    for(let parent=el.parentElement;parent&&parent!==document.body;parent=parent.parentElement){
     const overflow=getComputedStyle(parent).overflowX;
     const bounds=parent.getBoundingClientRect();
     if(["hidden","clip","auto","scroll"].includes(overflow)&&bounds.left>=-1&&bounds.right<=width+1){clipped=true;break;}
    }
    return {tag:el.tagName.toLowerCase(),className:typeof el.className==="string"?el.className:"",id:el.id,left:Math.round(rect.left),right:Math.round(rect.right),visibility:style.visibility,clipped};
   }).filter(x=>!x.clipped&&x.visibility!=="hidden"&&(x.right>width+1||x.left < -1)).slice(0,30);
   return {innerWidth:width,documentWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,bodyOverflowX:getComputedStyle(document.body).overflowX,offenders};
  });
  matrix.push({route,width,height,status:Math.max(result.documentWidth,result.bodyWidth)>width?"OVERFLOW":"OK",...result});
 }
}
const loginContext=await browser.newContext({viewport:{width:320,height:900}});
const loginPage=await loginContext.newPage();
await loginPage.goto(base+"/admin",{waitUntil:"domcontentloaded"});
await loginPage.waitForTimeout(120);
for(const size of [{width:320,height:900},{width:360,height:800},{width:844,height:390}]){
 await loginPage.setViewportSize(size);
 await loginPage.waitForTimeout(80);
 const v=await loginPage.evaluate(()=>({innerWidth:innerWidth,doc:document.documentElement.scrollWidth,body:document.body.scrollWidth}));
 matrix.push({route:"/admin (login)",width:size.width,height:size.height,status:Math.max(v.doc,v.body)>size.width?"OVERFLOW":"OK",innerWidth:v.innerWidth,documentWidth:v.doc,bodyWidth:v.body});
}
const checks=[];
const check=(ok,name,details)=>checks.push({name,status:ok?"PASS":"FAIL",details:details||""});
const mobile=await browser.newContext({viewport:{width:360,height:800},deviceScaleFactor:1,hasTouch:true,isMobile:true});
await mobile.addInitScript(()=>localStorage.setItem("amigos-auth","1"));
const mp=await mobile.newPage();
await mp.goto(base+"/",{waitUntil:"domcontentloaded"});
const toggle=mp.locator(".nav-toggle");
check((await mp.locator(".nav-toggle span").textContent()).trim()==="\u2630","mobile menu displays the hamburger icon");
await toggle.focus();
await mp.keyboard.press("Enter");
await mp.waitForTimeout(80);
check(await toggle.getAttribute("aria-expanded")==="true"&&await mp.locator("#mobile-navigation").isVisible()&&await mp.evaluate(()=>document.body.style.overflow==="hidden"),"storefront menu opens with keyboard","aria-expanded, panel visibility, body lock");
check(await mp.evaluate(()=>document.activeElement?.textContent?.trim()==="Menu"),"storefront menu moves focus into links");
await mp.keyboard.press("Escape");
await mp.waitForTimeout(80);
check(await toggle.getAttribute("aria-expanded")==="false"&&await mp.evaluate(()=>document.activeElement?.classList.contains("nav-toggle")&&document.body.style.overflow!=="hidden"),"storefront menu Escape closes and restores focus");
const toggleBox=await toggle.boundingBox();
await mp.touchscreen.tap(toggleBox.x+toggleBox.width/2,toggleBox.y+toggleBox.height/2);
await mp.waitForTimeout(80);
check(await mp.locator("#mobile-navigation").isVisible(),"storefront menu opens by touch");
const aboutBox=await mp.locator("#mobile-navigation a[href='/about']").boundingBox();
await mp.touchscreen.tap(aboutBox.x+aboutBox.width/2,aboutBox.y+aboutBox.height/2);
await mp.waitForTimeout(120);
check(new URL(mp.url()).pathname==="/about"&&await mp.locator("#mobile-navigation").count()===0&&await mp.evaluate(()=>document.body.style.overflow!=="hidden"),"storefront menu closes after touch navigation");
await mp.goto(base+"/menu",{waitUntil:"domcontentloaded"});
await mp.locator(".prod .plus:not([disabled])").first().click();
await mp.locator(".order-fab").click();
await mp.locator(".drawer").waitFor();
check(await mp.evaluate(()=>document.body.style.overflow==="hidden")&&await mp.locator(".drawer").getAttribute("aria-modal")==="true","order drawer locks page scroll and exposes dialog semantics");
await mp.keyboard.press("Escape");
await mp.waitForTimeout(80);
check(await mp.locator(".drawer").count()===0&&await mp.evaluate(()=>document.body.style.overflow!=="hidden"),"order drawer closes on Escape");
await mp.locator(".prod .plus:not([disabled])").first().click();
await mp.locator(".order-fab").click();
await mp.locator(".drawer").waitFor();
const sendRect=await mp.locator(".drawer-f .pill").boundingBox();
const screenHeight=await mp.evaluate(()=>innerHeight);
check(sendRect&&sendRect.y>=0&&sendRect.y+sendRect.height<=screenHeight,"order action stays visible at 360px height");
await mp.goto(base+"/menu",{waitUntil:"domcontentloaded"});
await mp.setViewportSize({width:844,height:390});
await mp.locator(".prod .plus:not([disabled])").first().click();
await mp.locator(".order-fab").click();
await mp.locator(".drawer").waitFor();
const landscapeSend=await mp.locator(".drawer-f .pill").boundingBox();
check(landscapeSend&&landscapeSend.y>=0&&landscapeSend.y+landscapeSend.height<=390,"order action stays visible in landscape phone");
await mp.goto(base+"/",{waitUntil:"domcontentloaded"});
await mp.locator(".insta-tabs button").first().click();
const beforeSwipe=await mp.locator(".insta-tabs button.on").textContent();
await mp.evaluate(()=>{
 const target=document.querySelector(".deck");
 const first=new Touch({identifier:7,target,clientX:250,clientY:180});
 target.dispatchEvent(new TouchEvent("touchstart",{touches:[first],changedTouches:[first],bubbles:true,cancelable:true}));
 const last=new Touch({identifier:7,target,clientX:70,clientY:180});
 target.dispatchEvent(new TouchEvent("touchend",{touches:[],changedTouches:[last],bubbles:true,cancelable:true}));
});
await mp.waitForTimeout(100);
const afterSwipe=await mp.locator(".insta-tabs button.on").textContent();
check(beforeSwipe!==afterSwipe,"gallery advances on left swipe",beforeSwipe+" -> "+afterSwipe);
const admin=await browser.newContext({viewport:{width:360,height:800}});
await admin.addInitScript(()=>localStorage.setItem("amigos-auth","1"));
const ap=await admin.newPage();
await ap.goto(base+"/admin",{waitUntil:"domcontentloaded"});
const burger=ap.locator(".ad-burger");
await burger.focus();
await ap.keyboard.press("Enter");
await ap.waitForTimeout(80);
check(await burger.getAttribute("aria-expanded")==="true"&&await ap.locator(".ad-side.open").isVisible()&&await ap.evaluate(()=>document.body.style.overflow==="hidden"),"admin sidebar opens with keyboard and locks scroll");
await ap.keyboard.press("Escape");
await ap.waitForTimeout(80);
check(await burger.getAttribute("aria-expanded")==="false"&&await ap.evaluate(()=>document.activeElement?.classList.contains("ad-burger")&&document.body.style.overflow!=="hidden"),"admin sidebar Escape closes and restores focus");
await burger.click();
check(await ap.evaluate(()=>document.activeElement?.textContent?.includes("Dashboard")),"admin sidebar moves focus to its navigation");
await ap.locator(".ad-shade").click();
await ap.waitForTimeout(80);
check(await ap.locator(".ad-side.open").count()===0&&await ap.evaluate(()=>document.body.style.overflow!=="hidden"),"admin sidebar closes from its overlay");
await ap.goto(base+"/admin/products",{waitUntil:"domcontentloaded"});
await burger.click();
await ap.getByRole("link",{name:/Dashboard/}).click();
await ap.waitForTimeout(120);
check(new URL(ap.url()).pathname==="/admin"&&await ap.locator(".ad-side.open").count()===0&&await ap.evaluate(()=>document.body.style.overflow!=="hidden"),"admin sidebar closes after navigation");
await ap.goto(base+"/admin/products",{waitUntil:"domcontentloaded"});
await ap.getByRole("button",{name:/Add item/}).click();
await ap.locator(".ad-modal").waitFor();
check(await ap.evaluate(()=>document.body.style.overflow==="hidden")&&await ap.locator(".ad-modal").getAttribute("aria-modal")==="true","admin modal locks scroll and is exposed as a dialog");
const formScroll=ap.locator(".ad-modal");
await formScroll.evaluate(el=>{el.scrollTop=el.scrollHeight});
await ap.waitForTimeout(80);
const statusRect=await ap.locator(".ad-modal .ad-form select").last().boundingBox();
const actionRect=await ap.locator(".ad-modal-f").boundingBox();
check(statusRect&&actionRect&&statusRect.y+statusRect.height<=actionRect.y+1&&actionRect.y+actionRect.height<=800,"admin modal scrolls to final fields while keeping actions visible");
await ap.keyboard.press("Escape");
await ap.waitForTimeout(80);
check(await ap.locator(".ad-modal").count()===0&&await ap.evaluate(()=>document.activeElement?.textContent?.includes("Add item")&&document.body.style.overflow!=="hidden"),"admin modal Escape closes and restores focus");

const nameContext=await browser.newContext({viewport:{width:320,height:900}});
await nameContext.addInitScript(()=>localStorage.setItem("amigos-auth","1"));
const namePage=await nameContext.newPage();
await namePage.goto(base+"/admin/settings",{waitUntil:"domcontentloaded"});
await namePage.getByLabel("Shop name").fill("Amigos Trincomalee Coffee House and Bakery Collective");
await namePage.getByRole("button",{name:/Save settings/}).click();
await namePage.waitForTimeout(120);
await namePage.goto(base+"/",{waitUntil:"domcontentloaded"});
for(const width of [320,1440]){
 await namePage.setViewportSize({width,height:900});
 await namePage.waitForTimeout(100);
 const fit=await namePage.locator(".wordmark").evaluate(el=>({text:el.textContent,fontSize:getComputedStyle(el).fontSize,scrollWidth:el.scrollWidth,clientWidth:el.clientWidth,whiteSpace:getComputedStyle(el).whiteSpace}));
 check(fit.scrollWidth<=fit.clientWidth+1,"long Settings shop name fits at "+width+"px",JSON.stringify(fit));
}
await nameContext.close();

async function go(route,width){await page.setViewportSize({width,height:900});await page.goto(base+route,{waitUntil:"domcontentloaded",timeout:30000});await page.waitForTimeout(160);await page.evaluate(()=>window.scrollTo(0,0));}
async function part(route,selector,name,width){await go(route,width);const target=page.locator(selector);await target.scrollIntoViewIfNeeded();await target.evaluate(async el=>Promise.all([...el.querySelectorAll("img")].map(img=>img.decode().catch(()=>null))));await target.screenshot({path:out+"/"+name+"-"+width+".png",animations:"disabled",timeout:15000});}
async function screen(route,name,width,action){await go(route,width);if(action)await action();await page.evaluate(()=>window.scrollTo(0,0));await page.evaluate(async()=>{const visible=[...document.images].filter(img=>{const r=img.getBoundingClientRect();return r.width>0&&r.bottom>=0&&r.top<=innerHeight});await Promise.all(visible.map(img=>img.decode().catch(()=>null)))});await page.screenshot({path:out+"/"+name+"-"+width+".png",fullPage:false,animations:"disabled"});}
for(const width of [360,768,1440]){
 await part("/",".hero","home-hero",width);
 await part("/",".ribbons","home-ribbons",width);
 await part("/",".insta","home-instagram",width);
 await screen("/menu","menu-drawer",width,async()=>{await page.locator(".prod .plus:not([disabled])").first().click();await page.locator(".order-fab").click();await page.locator(".drawer").waitFor();});
 await part("/about",".about-hero","about",width);
 await screen("/admin","admin-dashboard",width);
 await screen("/admin/products","admin-items",width);
 await screen("/admin/products","admin-modal",width,async()=>{await page.getByRole("button",{name:/Add item/}).click();await page.locator(".ad-modal").waitFor();});
}
const report={widths,routes,matrix,checks,errors};
await fs.writeFile(out+"/overflow-after.json",JSON.stringify(report,null,2));
console.log(JSON.stringify({auditRows:matrix.length,overflowRows:matrix.filter(x=>x.status==="OVERFLOW").length,checkFailures:checks.filter(x=>x.status==="FAIL"),checks,consoleErrors:errors.length,errors:errors.slice(0,10),overflowSamples:matrix.filter(x=>x.status==="OVERFLOW").map(x=>({route:x.route,width:x.width,doc:x.documentWidth,body:x.bodyWidth,offenders:x.offenders}))},null,2));
await browser.close();
if(checks.some(x=>x.status==="FAIL"))process.exitCode=1;
