const $=id=>document.getElementById(id);
$("year").textContent=new Date().getFullYear();
let language="en";
const dict={
 E100:["Curcumin","Plant-derived colouring, usually from turmeric.","Plant source commonly reported; check product-specific processing."],
 E120:["Carmine / Cochineal","Red colouring made from cochineal insects.","Insect-derived; religious views and certification standards may differ."],
 E441:["Gelatin","Gelling agent made from collagen.","Animal source and slaughter status must be verified."],
 E470:["Fatty acid salts","Emulsifier/stabilizer group.","May be plant- or animal-derived; supplier source matters."],
 E471:["Mono- and diglycerides","Emulsifiers used in many foods.","Can be plant- or animal-derived; source declaration is needed."],
 E472:["Esters of mono- and diglycerides","Emulsifier group.","Source may be plant or animal; verify manufacturer details."],
 E473:["Sucrose esters of fatty acids","Emulsifier.","Fatty acid source and processing should be checked."],
 E476:["Polyglycerol polyricinoleate (PGPR)","Emulsifier often used in chocolate.","Usually derived from castor oil and glycerol; confirm supplier specification."],
 E481:["Sodium stearoyl lactylate","Dough conditioner/emulsifier.","Stearic acid source may need checking."],
 E482:["Calcium stearoyl lactylate","Dough conditioner/emulsifier.","Stearic acid source may need checking."],
 E542:["Bone phosphate","Anti-caking / processing additive.","Bone-derived; animal source and processing require verification."],
 E904:["Shellac","Glazing agent.","Insect-derived resin; seek guidance from the relevant halal authority."]
};
const ingredientRules=[
 {keys:["pork","porcine","lard"],label:"Pig-derived ingredient term",level:"high",detail:"The ingredient name indicates a pig-derived material. This is a strong non-halal concern; verify the exact label and applicable standard."},
 {keys:["gelatin","gelatine"],label:"Gelatin",level:"review",detail:"Gelatin is animal-derived collagen. The animal species, slaughter status and certification need confirmation."},
 {keys:["rennet"],label:"Rennet",level:"review",detail:"Rennet may be animal, microbial or fermentation-produced. The source is important."},
 {keys:["mono- and diglycerides","mono and diglycerides","e471","e472","e470"],label:"Fatty-acid emulsifier",level:"review",detail:"These additives can have plant or animal origins. Ask the manufacturer for source documentation."},
 {keys:["carmine","cochineal","e120"],label:"Carmine / E120",level:"review",detail:"This colouring is insect-derived. Halal acceptance can differ between authorities."},
 {keys:["alcohol","ethanol"],label:"Alcohol-related term",level:"review",detail:"The exact substance, source, amount, function and applicable halal standard matter. The word alone is not enough for a ruling."},
 {keys:["enzymes"],label:"Enzymes",level:"review",detail:"Enzymes can be microbial, plant or animal-derived. The production source should be checked."},
 {keys:["palm oil","sunflower oil","soybean oil","olive oil","vegetable oil","cocoa butter","sugar","salt","water","starch","corn starch"],label:"Common food ingredient",level:"info",detail:"The listed name is not by itself an indication of an animal-derived ingredient. Processing aids and cross-contamination are not established from this label."}
];
const clearTerms=["pork","porcine","lard"];
const cautionTerms=["gelatin","gelatine","rennet","carmine","cochineal","e120","e441","e470","e471","e472","e473","e481","e482","e542","e904","alcohol","ethanol","enzymes","mono- and diglycerides","mono and diglycerides"];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const ecode=s=>{let m=String(s).toUpperCase().match(/E\s?-?\s?(\d{3,4}[A-Z]?)/);return m?"E"+m[1]:null};
function renderAdditives(tags){
 let codes=[...new Set((tags||[]).map(ecode).filter(Boolean))];$("acount").textContent=codes.length;
 $("additives").innerHTML=codes.length?codes.map(c=>{let d=dict[c];return `<div class="addrow"><b>${c}${d?" · "+esc(d[0]):""}</b><span>${d?esc(d[1]):"No detailed profile in this demo. Check an authoritative additive source."}</span></div>`}).join(""):'<p class="muted">No E-number codes supplied. This does not prove no additives are present.</p>';
 return codes;
}
function renderIntelligence(ingredients,codes){
 let names=ingredients.map(x=>(x.text||x.id||"").toLowerCase());
 let combined=names.concat(codes.map(x=>x.toLowerCase()));
 let matches=[];
 ingredientRules.forEach(rule=>{if(rule.keys.some(k=>combined.some(v=>v.includes(k))))matches.push(rule)});
 codes.forEach(code=>{if(dict[code]&&!matches.some(m=>m.label===dict[code][0]))matches.push({label:code+" — "+dict[code][0],level:["E120","E441","E542","E904"].includes(code)?"review":"review",detail:dict[code][2]})});
 if(!matches.length)matches.push({label:"No known flagged term found",level:"info",detail:"The listed ingredients did not match this prototype's limited rule library. This is not proof that the product is halal; missing sources, processing aids and certification still need checking."});
 $("intelligence").innerHTML=matches.map(m=>`<div class="intel-item ${m.level}"><b>${esc(m.label)}</b><p>${esc(m.detail)}</p></div>`).join("");
 let high=matches.some(m=>m.level==="high"), review=matches.some(m=>m.level==="review");
 $("overall-explanation").textContent=high?"A potentially prohibited ingredient term appears in the ingredient data. Check the original package and contact the manufacturer or a recognized halal authority.":review?"At least one ingredient or additive needs source verification. The product cannot be confirmed halal from the available data.":"No specific concern was identified by the limited rules in this demo, but the available data is not enough to certify the product as halal.";
 return {high,review};
}
function analyze(p,code){
 $("name").textContent=p.product_name||p.product_name_en||"Product name not provided";
 $("brand").textContent=p.brands||"PRODUCT INFORMATION";
 $("meta").textContent=[p.quantity,p.countries].filter(Boolean).join(" · ")||"Barcode: "+code;
 let img=p.image_front_url||p.image_url;
 $("photo").innerHTML=img?`<img src="${esc(img)}" alt="Product image" onerror="this.parentElement.textContent='NO IMAGE'">`:"NO<br>IMAGE";
 let ingredients=Array.isArray(p.ingredients)?p.ingredients:[];
 $("icount").textContent=ingredients.length||"—";
 let codes=renderAdditives(p.additives_tags||[]);
 let text=ingredients.map(x=>x.text||x.id||"").join(" ").toLowerCase();
 let labels=(p.labels_tags||[]).filter(x=>/halal/i.test(x));
 $("cert").textContent=labels.length?"A halal label tag appears in the product record ("+labels.join(", ")+"), but this is not independent certificate verification. Confirm the certifier, certificate number, product scope and expiry date.":"No independently verified certificate record is connected to this demo. Contact the manufacturer or relevant halal authority.";
 let intelligence=renderIntelligence(ingredients,codes);
 let s=$("status");
 if(intelligence.high){s.textContent="Potential non-halal ingredient term found";s.className="pill bad"}
 else if(intelligence.review){s.textContent="Further ingredient verification needed";s.className="pill caution"}
 else{s.textContent="Insufficient evidence to confirm halal";s.className="pill"}
 $("ingredients").innerHTML=ingredients.length?ingredients.slice(0,100).map(x=>{let n=x.text||x.id||"Ingredient",l=n.toLowerCase(),bad=clearTerms.some(t=>l.includes(t)),flag=cautionTerms.some(t=>l.includes(t));return `<span class="chip ${bad?"bad":flag?"flag":""}">${esc(n)}${bad?" · check":flag?" · review":""}</span>`}).join(""):'<span class="chip">No ingredient list supplied.</span>';
 $("card").hidden=false;$("card").scrollIntoView({behavior:"smooth",block:"start"});
}
async function fetchProduct(code){
 const fields="code,product_name,product_name_en,brands,quantity,countries,image_front_url,image_url,ingredients,additives_tags,labels_tags";
 const urls=[
 `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}.json?fields=${fields}`,
 `https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(code)}.json`
 ];
 let last;
 for(const url of urls){
  try{
   const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);
   const response=await fetch(url,{signal:controller.signal,headers:{Accept:"application/json"}});
   clearTimeout(timer);
   if(!response.ok){last=new Error(`Product database returned HTTP ${response.status}.`);continue}
   const data=await response.json();
   if(data.status===1&&data.product)return data.product;
   last=new Error("No product record was found for this barcode.");
  }catch(e){last=e.name==="AbortError"?new Error("The product database took too long to respond. Please retry."):e}
 }
 throw last||new Error("Could not connect to the product database.");
}
async function run(code){
 code=code.trim().replace(/\s/g,"");
 $("results").hidden=false;$("card").hidden=true;$("error").hidden=true;$("loading").hidden=false;$("search").disabled=true;
 try{if(!/^\d{8,14}$/.test(code))throw Error("Enter a valid 8–14 digit EAN/UPC barcode. QR codes containing web links or product IDs are not supported by this lookup yet.");let p=await fetchProduct(code);analyze(p,code)}
 catch(e){$("error").textContent=e.message||"Unable to retrieve product information. Check your internet connection and retry.";$("error").hidden=false}
 finally{$("loading").hidden=true;$("search").disabled=false}
}
$("form").addEventListener("submit",e=>{e.preventDefault();run($("barcode").value)});
$("sample").onclick=()=>{$("barcode").value="3017620422003";run($("barcode").value)};
$("clear").onclick=()=>{$("results").hidden=true;$("barcode").value=""};
let stream=null,loop=null,detector=null;
async function stopCamera(){if(loop)clearInterval(loop);loop=null;if(stream)stream.getTracks().forEach(t=>t.stop());stream=null;$("video").srcObject=null;$("cameraBox").hidden=true}
$("camera").onclick=async()=>{
 try{
  if(!("BarcodeDetector"in window))throw Error("Barcode scanning is not supported in this browser. Try Chrome on Android or enter the barcode manually.");
  if(!navigator.mediaDevices?.getUserMedia)throw Error("Camera access requires HTTPS. Enter the barcode manually if unavailable.");
  let formats=await BarcodeDetector.getSupportedFormats();detector=new BarcodeDetector({formats:formats.filter(f=>["ean_13","ean_8","upc_a","upc_e","code_128","itf"].includes(f))});
  stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}},audio:false});
  $("video").srcObject=stream;await $("video").play();$("cameraBox").hidden=false;
  loop=setInterval(async()=>{try{let hits=await detector.detect($("video"));if(hits.length){$("barcode").value=hits[0].rawValue;await stopCamera();run($("barcode").value)}}catch(_){}},450);
 }catch(e){alert(e.message);stopCamera()}
};
$("stop").onclick=stopCamera;window.addEventListener("pagehide",stopCamera);
$("lang-toggle").onclick=()=>{language=language==="en"?"bn":"en";$("lang-toggle").textContent=language==="bn"?"English":"বাংলা";document.documentElement.lang=language;$("overall-explanation").textContent=language==="bn"?"বাংলা ব্যাখ্যা পরবর্তী বিশ্লেষণের সময় দেখানো হবে। বর্তমান বিশ্লেষণ সীমিত নিয়মভিত্তিক এবং ধর্মীয় ফতোয়া নয়।":"Language changed. Run a product analysis to refresh the explanation."};
