const API = 'https://todoapitest.juansegaliz.com/todos';

// ---- Helpers panel JSON
function logReqRes({op, method, url, status, req, res}){
  const reqEl = document.getElementById('req-json');
  const resEl = document.getElementById('res-json');
  if (reqEl) reqEl.textContent = JSON.stringify({op, method, url, status, body:req ?? null}, null, 2);
  try { resEl.textContent = JSON.stringify(typeof res === 'string' ? JSON.parse(res) : res, null, 2); }
  catch(e){ resEl.textContent = (typeof res === 'string') ? res : JSON.stringify(res, null, 2); }
}

async function doFetch(url, opts, op){
  const res = await fetch(url, opts);
  const text = await res.text();
  logReqRes({op, method: opts?.method || 'GET', url, status: res.status, req: opts?.body ? JSON.parse(opts.body) : undefined, res: text});
  try { return JSON.parse(text); } catch { return text; }
}

// ---- GET
async function onGetAll(){
  const data = await doFetch(API, {}, 'GET_ALL');
  renderList(Array.isArray(data) ? data : []);
}
async function onGetById(){
  const id = document.getElementById('get-id').value.trim();
  if(!id){ alert('Ingresa ID'); return; }
  await doFetch(`${API}/${id}`, {}, 'GET_BY_ID');
}

// ---- POST
async function onPost(e){
  e.preventDefault();
  const payload = readPayload('post');
  if(!payload.title){ alert('Título requerido'); return; }
  await doFetch(API, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)}, 'POST');
}

// ---- PUT
async function onPut(e){
  e.preventDefault();
  const id = document.getElementById('put-id').value.trim();
  if(!id){ alert('ID requerido'); return; }
  const payload = readPayload('put');
  if(!payload.title){ alert('Título requerido'); return; }
  await doFetch(`${API}/${id}`, {method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)}, 'PUT');
}

// ---- DELETE
async function onDelete(e){
  e.preventDefault();
  const id = document.getElementById('delete-id').value.trim();
  if(!id){ alert('ID requerido'); return; }
  await doFetch(`${API}/${id}`, {method:'DELETE'}, 'DELETE');
}

// ---- Util
function readPayload(prefix){
  const title = document.getElementById(`${prefix}-title`).value.trim();
  const description = document.getElementById(`${prefix}-description`).value.trim();
  const priority = Number(document.getElementById(`${prefix}-priority`).value);
  const dueRaw = document.getElementById(`${prefix}-due`).value;
  const completed = document.getElementById(`${prefix}-completed`).checked;
  const dueDate = dueRaw ? new Date(dueRaw).toISOString() : null;
  return { title, description, priority, dueDate, completed };
}

function renderList(items){
  const tbody = document.querySelector('#list-table tbody');
  tbody.innerHTML = '';
  items.forEach(t => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${t.id}</td><td>${t.title||''}</td><td>${t.description||''}</td><td>${t.priority??''}</td><td>${t.completed?'Sí':'No'}</td>`;
    tbody.appendChild(tr);
  });
}

// ---- Tabs
function showTab(tab){
  document.querySelectorAll('.op-tab').forEach(el=>el.classList.add('hidden'));
  document.getElementById(`tab-${tab}`).classList.remove('hidden');
}
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-tab-get').onclick=()=>showTab('get');
  document.getElementById('btn-tab-post').onclick=()=>showTab('post');
  document.getElementById('btn-tab-put').onclick=()=>showTab('put');
  document.getElementById('btn-tab-delete').onclick=()=>showTab('delete');

  document.getElementById('btn-get-all').onclick=onGetAll;
  document.getElementById('btn-get-byid').onclick=onGetById;
  document.getElementById('form-post').addEventListener('submit', onPost);
  document.getElementById('form-put').addEventListener('submit', onPut);
  document.getElementById('form-delete').addEventListener('submit', onDelete);

  // start en GET
  showTab('get');
});
