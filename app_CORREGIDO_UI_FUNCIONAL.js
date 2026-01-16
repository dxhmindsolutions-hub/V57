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

function toggleDrawer(){drawer.classList.toggle('open')}

function renderDrawer(){
  drawer.innerHTML=categories.map(c=>`
    <button class="${c===activeCat?'active':''}"
      onclick="activeCat='${c}';toggleDrawer();render()">${c}</button>
  `).join('');
}

function render(){
  renderDrawer();
  const q=search.value.toLowerCase();
  list.innerHTML=items
    .filter(i=>(!q||i.name.toLowerCase().includes(q)) && i.cat===activeCat)
    .map((i,idx)=>`
      <div class="item">
        <span>${i.name}</span>
        <div>
          <button class="add" onclick="showQtyModal('${i.name}')">+</button>
          <button class="del" onclick="askDeleteItem(${idx})">✕</button>
        </div>
      </div>
    `).join('');
  renderTicket();
  localStorage.items=JSON.stringify(items);
  localStorage.cart=JSON.stringify(cart);
}

function showAddItem(){
  const m=document.createElement('div');
  m.className='modal'; m.style.display='flex';
  m.innerHTML=`<div class="box">\n  setTimeout(()=>enhanceModalButtons(m),0);
    <h3>Nuevo artículo</h3>
    <input id="iname" placeholder="Nombre" style="width:100%;padding:8px">
    <select id="icat" style="width:100%;padding:8px;margin-top:8px">
      ${categories.map(c=>`<option>${c}</option>`).join('')}
    </select>
    <button id="save" style="margin-top:10px">Guardar</button>
  </div>`;
  document.body.appendChild(m);
  m.querySelector('#save').onclick=()=>{
    const n=iname.value.trim();
    if(n){
      items.push({name:n,cat:icat.value});
      m.remove(); render();
    }
  };
}

function showQtyModal(name){
  let qty=1, unit='UNIDAD';
  const m=document.createElement('div');
  m.className='modal'; m.style.display='flex';
  m.innerHTML=`<div class="box">\n  setTimeout(()=>enhanceModalButtons(m),0);
    <h3>${name}</h3>
    <p>Cantidad</p>
    <div class="btns qty">
      ${[1,2,3,4,5,6,7,8,9,10].map(n=>`<button>${n}</button>`).join('')}
    </div>
    <p>Unidad</p>
    <div class="btns unit">
      <button class="active">UNIDAD</button>
      <button>KG</button>
      <button>CAJA</button>
    </div>
    <div style="display:flex;gap:8px;margin-top:10px">
      <button id="cancel">Cancelar</button>
      <button id="add">Añadir</button>
    </div>
  </div>`;
  document.body.appendChild(m);

  m.querySelectorAll('.qty button').forEach(b=>b.onclick=()=>{
    m.querySelectorAll('.qty button').forEach(x=>x.classList.remove('active'));
    b.classList.add('active'); qty=Number(b.textContent);
  });
  m.querySelectorAll('.unit button').forEach(b=>b.onclick=()=>{
    m.querySelectorAll('.unit button').forEach(x=>x.classList.remove('active'));
    b.classList.add('active'); unit=b.textContent;
  });

  m.querySelector('#cancel').onclick=()=>m.remove();
  m.querySelector('#add').onclick=()=>{
    const f=cart.find(c=>c.name===name && c.unit===unit);
    if(f)f.qty+=qty; else cart.push({name,qty,unit});
    m.remove(); render();
  };
}

function renderTicket(){
  ticketList.innerHTML=cart.map((c,i)=>`
    <li>${c.name} - ${c.qty} ${c.unit}
      <button class="del" onclick="askDeleteTicket(${i})">✕</button>
    </li>`).join('');
}

function askDeleteItem(i){
  deleteType='item'; deleteIndex=i;
  confirmText.textContent=`¿Eliminar ${items[i].name}?`;
  confirmModal.style.display='flex';
}
function askDeleteTicket(i){
  deleteType='ticket'; deleteIndex=i;
  confirmText.textContent=`¿Eliminar ${cart[i].name} del ticket?`;
  confirmModal.style.display='flex';
}
function confirmDelete(){
  if(deleteType==='item')items.splice(deleteIndex,1);
  if(deleteType==='ticket')cart.splice(deleteIndex,1);
  closeConfirm(); render();
}
function closeConfirm(){confirmModal.style.display='none'}

function resetTicket(){cart=[]; render()}
function printTicket(){
  var ticketText = buildPrintTicket();

  var win = window.open("", "PRINT", "width=300,height=600");

  var html = "";
  html += "<html><head><title>Ticket</title>";
  html += "<style>";
  html += "body{width:80mm;margin:0;padding:8px;font-family:monospace;font-size:14px;}";
  html += "h2{text-align:center;font-size:18px;margin:0 0 6px 0;}";
  html += ".cat{font-weight:bold;margin-top:10px;}";
  html += "</style></head><body>";
  html += ticketText;
  html += "<br><br><br><br><br>";
  html += "</body></html>";

  win.document.open();
  win.document.write(html);
  win.document.close();

  win.focus();
  win.print();
}
function previewWhatsApp(){
  const t=encodeURIComponent(cart.map(c=>`${c.name} - ${c.qty} ${c.unit}`).join('\n'));
  window.open('https://wa.me/?text='+t)
}

if(items.length===0){
  items=[
    {name:'Coca Cola',cat:'Aguas y refrescos'},
    {name:'Manzana',cat:'Frutas y verduras'}
  ];
}

render();


function buildWhatsAppText(){
  let txt="🧾 *PEDIDO*\n\n";
  categories.forEach(cat=>{
    const lines=cart.filter(c=>{
      const it=items.find(i=>i.name===c.name);
      return it && it.cat===cat;
    }

function buildPrintTicket(){
  var now = new Date();
  var fecha = now.toLocaleDateString("es-MX");
  var hora  = now.toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"});

  var html = "";
  html += "<h2>PEDIDO</h2>";
  html += "<div style='text-align:center;font-size:12px;'>";
  html += fecha + " " + hora;
  html += "</div><hr>";

  categories.forEach(function(cat){
    var lines = cart.filter(function(c){
      var it = items.find(function(i){ return i.name === c.name; });
      return it && it.cat === cat;
    });

    if(lines.length){
      html += "<div class='cat'>" + cat.toUpperCase() + "</div>";
      lines.forEach(function(l){
        html += "- " + l.name + ": " + l.qty + " " + l.unit + "<br>";
      });
    }
  });

  return html;
}
);
    if(lines.length){
      txt+=cat.toUpperCase()+"\n";
      lines.forEach(l=>{
        txt+=`- ${l.name}: ${l.qty} ${l.unit}\n`;
      });
      txt+="\n";
    }
  });
  return txt.trim();
}

function previewWhatsApp(){
  const text=buildWhatsAppText();
  const m=document.createElement('div');
  m.className='modal'; m.style.display='flex';
  m.innerHTML=`<div class="box">\n  setTimeout(()=>enhanceModalButtons(m),0);
    <h3>Vista previa WhatsApp</h3>
    <textarea style="width:100%;height:200px">${text}</textarea>
    <div style="display:flex;gap:8px;margin-top:10px">
      <button id="cancel">Cancelar</button>
      <button id="send">Enviar</button>
    </div>
  </div>`;
  document.body.appendChild(m);

  m.querySelector('#cancel').onclick=()=>m.remove();
  m.querySelector('#send').onclick=()=>{
    const t=encodeURIComponent(m.querySelector('textarea').value);
    window.open('https://wa.me/?text='+t);
    m.remove();
  };
}

function sendWhatsApp(){ previewWhatsApp(); }


function enhanceModalButtons(modal){
  if(!modal) return;
  modal.querySelectorAll("button").forEach(b=>{
    b.style.borderRadius="16px";
    b.style.padding="14px";
    b.style.fontSize="16px";
    b.style.fontWeight="600";
    b.style.minHeight="48px";
  });
}
