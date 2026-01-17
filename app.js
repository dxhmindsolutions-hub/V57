const categories=[
  "Aguas y refrescos",
  "Cerveza, vinos y licores",
  "Café y té",
  "Frutas y verduras",
  "Lácteos y huevos",
  "Carne",
  "Pescado",
  "Limpieza",
  "Congelados",
  "Asiático",
  "Otros"
];

let activeCat=categories[0];
let items=JSON.parse(localStorage.items||'[]');
let cart=JSON.parse(localStorage.cart||'[]');
let deleteIndex=null, deleteType=null;

function toggleDrawer(){
  drawer.classList.toggle('open');
}

function renderDrawer(){
  drawer.innerHTML=categories.map(c=>`
    <div class="drawer-item ${c===activeCat?'active':''}"
      onclick="setCategory('${c}')">${c}</div>
  `).join('');
}

function setCategory(c){
  activeCat=c;
  drawer.classList.remove('open');
  renderDrawer();
  renderItems();
}

function showAddItem(){
  addItemModal.classList.add('show');
}

function hideAddItem(){
  addItemModal.classList.remove('show');
}

function addItem(){
  const name=itemName.value.trim();
  if(!name)return;

  items.push({
    name,
    cat:activeCat,
    unit:itemUnit.value
  });

  localStorage.items=JSON.stringify(items);
  itemName.value="";
  hideAddItem();
  renderItems();
}

function renderItems(){
  list.innerHTML=items
    .filter(i=>i.cat===activeCat)
    .map((i,idx)=>`
      <div class="item">
        <span>${i.name}</span>
        <button onclick="addToCart(${idx})">+</button>
      </div>
    `).join('');
}

function addToCart(idx){
  const item=items.filter(i=>i.cat===activeCat)[idx];
  const found=cart.find(c=>c.name===item.name);
  if(found) found.qty++;
  else cart.push({name:item.name, qty:1, unit:item.unit});
  localStorage.cart=JSON.stringify(cart);
  renderCart();
}

function renderCart(){
  cartList.innerHTML=cart.map((c,i)=>`
    <div class="cart-item">
      <span>${c.name} (${c.qty} ${c.unit})</span>
      <button onclick="removeCart(${i})">x</button>
    </div>
  `).join('');
}

function removeCart(i){
  cart.splice(i,1);
  localStorage.cart=JSON.stringify(cart);
  renderCart();
}

function clearCart(){
  cart=[];
  localStorage.cart='[]';
  renderCart();
}

function buildWhatsAppText(){
  let txt="PEDIDO\n\n";
  categories.forEach(cat=>{
    cart.forEach(c=>{
      const it=items.find(i=>i.name===c.name);
      if(it && it.cat===cat){
        txt+=`${c.name}: ${c.qty} ${c.unit}\n`;
      }
    });
  });
  return encodeURIComponent(txt);
}

function sendWhatsApp(){
  window.open("https://wa.me/?text="+buildWhatsAppText());
}

/* =======================
   IMPRESIÓN DE TICKET
   ======================= */

function printTicket(){
  var win = window.open("", "PRINT", "width=300,height=600");
  if(!win){ return; }

  var now = new Date();
  var fecha = now.toLocaleDateString("es-MX");
  var hora  = now.toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"});

  var html = "<html><head><title>Ticket</title>";
  html += "<style>";
  html += "body{width:80mm;margin:0;padding:8px;font-family:monospace;font-size:14px;}";
  html += "h2{text-align:center;font-size:18px;margin:0 0 6px 0;}";
  html += ".cat{font-weight:bold;margin-top:10px;}";
  html += "</style></head><body>";

  html += "<h2>PEDIDO</h2>";
  html += "<div style='text-align:center;font-size:12px;'>";
  html += fecha + " " + hora;
  html += "</div><hr>";

  categories.forEach(function(cat){
    cart.forEach(function(c){
      var it = items.find(function(i){ return i.name === c.name; });
      if(it && it.cat === cat){
        html += "- " + c.name + ": " + c.qty + " " + c.unit + "<br>";
      }
    });
  });

  html += "<br><br><br><br><br>";
  html += "</body></html>";

  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}

/* ======================= */

renderDrawer();
renderItems();
renderCart();
