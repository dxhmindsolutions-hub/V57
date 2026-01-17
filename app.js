/* ========= DATOS ========= */

var categories = [
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

var activeCat = categories[0];
var items = JSON.parse(localStorage.items || "[]");
var cart  = JSON.parse(localStorage.cart  || "[]");

/* ========= UI ========= */

function toggleDrawer(){
  document.getElementById("drawer").classList.toggle("open");
}

function renderDrawer(){
  var html = "";
  for(var i=0;i<categories.length;i++){
    var c = categories[i];
    html += "<div class='drawer-item"+(c===activeCat?" active":"")+"' ";
    html += "onclick=\"setCategory("+i+")\">";
    html += c+"</div>";
  }
  document.getElementById("drawer").innerHTML = html;
}

function setCategory(index){
  activeCat = categories[index];
  document.getElementById("drawer").classList.remove("open");
  renderDrawer();
  renderItems();
}

function showAddItem(){
  document.getElementById("addItemModal").classList.add("show");
}

function hideAddItem(){
  document.getElementById("addItemModal").classList.remove("show");
}

/* ========= ITEMS ========= */

function addItem(){
  var name = document.getElementById("itemName").value.trim();
  var unit = document.getElementById("itemUnit").value;
  if(!name) return;

  items.push({ name:name, cat:activeCat, unit:unit });
  localStorage.items = JSON.stringify(items);

  document.getElementById("itemName").value="";
  hideAddItem();
  renderItems();
}

function renderItems(){
  var html="";
  var list = document.getElementById("list");

  for(var i=0;i<items.length;i++){
    if(items[i].cat===activeCat){
      html += "<div class='item'>";
      html += "<span>"+items[i].name+"</span>";
      html += "<button onclick='addToCart("+i+")'>+</button>";
      html += "</div>";
    }
  }
  list.innerHTML = html;
}

/* ========= CARRITO ========= */

function addToCart(i){
  var it = items[i];
  var found = cart.find(function(c){ return c.name===it.name; });
  if(found) found.qty++;
  else cart.push({name:it.name, qty:1, unit:it.unit});
  localStorage.cart = JSON.stringify(cart);
  renderCart();
}

function renderCart(){
  var html="";
  var list=document.getElementById("cartList");

  for(var i=0;i<cart.length;i++){
    html+="<div class='cart-item'>";
    html+=cart[i].name+" ("+cart[i].qty+" "+cart[i].unit+") ";
    html+="<button onclick='removeCart("+i+")'>x</button>";
    html+="</div>";
  }
  list.innerHTML=html;
}

function removeCart(i){
  cart.splice(i,1);
  localStorage.cart=JSON.stringify(cart);
  renderCart();
}

function clearCart(){
  cart=[];
  localStorage.cart="[]";
  renderCart();
}

/* ========= WHATSAPP ========= */

function sendWhatsApp(){
  var txt="PEDIDO\n\n";
  for(var i=0;i<cart.length;i++){
    txt+=cart[i].name+": "+cart[i].qty+" "+cart[i].unit+"\n";
  }
  window.open("https://wa.me/?text="+encodeURIComponent(txt));
}

/* ========= IMPRESIÓN ========= */

function printTicket(){
  var win=window.open("","PRINT","width=300,height=600");
  if(!win)return;

  var d=new Date();
  var html="<html><body style='width:80mm;font-family:monospace;font-size:14px'>";
  html+="<h2 style='text-align:center'>PEDIDO</h2>";
  html+="<div style='text-align:center;font-size:12px'>";
  html+=d.toLocaleDateString()+" "+d.toLocaleTimeString()+"</div><hr>";

  for(var i=0;i<cart.length;i++){
    html+=cart[i].name+": "+cart[i].qty+" "+cart[i].unit+"<br>";
  }

  html+="<br><br><br></body></html>";
  win.document.write(html);
  win.document.close();
  win.print();
}

/* ========= INIT ========= */

renderDrawer();
renderItems();
renderCart();
