const KEY='sigeh_data_v1';
const initial={patients:[],doctors:[],appointments:[]};
let db=loadDB();
function loadDB(){try{return {...initial,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch(e){return {...initial}}}
function save(){localStorage.setItem(KEY,JSON.stringify(db));refreshAll()}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
function toast(msg){const root=document.getElementById('toast-root');root.innerHTML='<div class="toast">'+esc(msg)+'</div>';setTimeout(()=>root.innerHTML='',2600)}
function showPage(page){document.querySelectorAll('.page').forEach(x=>x.classList.add('hidden'));document.getElementById('page-'+page).classList.remove('hidden');document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b.dataset.page===page));document.getElementById('crumb').textContent={dashboard:'Dashboard',pacientes:'Pacientes',medicos:'Médicos',agendamentos:'Agendamentos'}[page];refreshAll()}
document.querySelectorAll('.nav button').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.page)));
function patientName(id){return db.patients.find(x=>x.id===id)?.name||'Paciente removido'}
function doctorName(id){return db.doctors.find(x=>x.id===id)?.name||'Médico removido'}
function specName(id){return db.doctors.find(x=>x.id===id)?.specialty||'—'}
function dateBR(v){if(!v)return'—';const [y,m,d]=v.split('-');return `${d}/${m}/${y}`}
function dateTimeBR(v){if(!v)return'—';const [d,t]=v.split('T');return `${dateBR(d)} ${t||''}`}
function badge(s){return `<span class="pill ${esc(s)}">${esc(s)}</span>`}
function emptyRow(cols,msg){return `<tr><td colspan="${cols}"><div class="empty">${msg}</div></td></tr>`}
function refreshAll(){renderDashboard();renderPatients();renderDoctors();renderAppointments()}
function renderDashboard(){
 document.getElementById('stat-patients').textContent=db.patients.length;
 document.getElementById('stat-doctors').textContent=db.doctors.length;
 document.getElementById('stat-appointments').textContent=db.appointments.filter(a=>a.status!=='Cancelada').length;
 document.getElementById('stat-pending').textContent=db.appointments.filter(a=>a.status==='Pendente').length;
 const sorted=[...db.appointments].sort((a,b)=>b.datetime.localeCompare(a.datetime)).slice(0,5);
 document.getElementById('recent-table').innerHTML=sorted.length?sorted.map(a=>`<tr><td>${esc(patientName(a.patientId))}</td><td>${esc(doctorName(a.doctorId))}</td><td>${dateTimeBR(a.datetime)}</td><td>${badge(a.status)}</td></tr>`).join(''):emptyRow(4,'Nenhum agendamento cadastrado.');
 const statuses=['Confirmada','Pendente','Realizada','Cancelada'],total=db.appointments.length||1;
 document.getElementById('status-bars').innerHTML=statuses.map(s=>{const n=db.appointments.filter(a=>a.status===s).length;return `<div class="bar-item"><span>${s}</span><div class="bar"><i style="width:${n/total*100}%"></i></div><b>${n}</b></div>`}).join('');
}
function renderPatients(){const q=(document.getElementById('patient-search')?.value||'').toLowerCase();const list=db.patients.filter(p=>[p.name,p.cpf,p.phone].join(' ').toLowerCase().includes(q));document.getElementById('patients-table').innerHTML=list.length?list.map(p=>`<tr><td><b>${esc(p.name)}</b></td><td>${esc(p.cpf)}</td><td>${dateBR(p.birth)}</td><td>${esc(p.phone)}</td><td><button class="btn secondary small" onclick="openPatient('${p.id}')">Editar</button> <button class="btn danger small" onclick="deletePatient('${p.id}')">Excluir</button></td></tr>`).join(''):emptyRow(5,'Nenhum paciente encontrado.')}
function renderDoctors(){const q=(document.getElementById('doctor-search')?.value||'').toLowerCase();const list=db.doctors.filter(d=>[d.name,d.crm,d.specialty].join(' ').toLowerCase().includes(q));document.getElementById('doctors-table').innerHTML=list.length?list.map(d=>`<tr><td><b>${esc(d.name)}</b></td><td>${esc(d.crm)}</td><td>${esc(d.specialty)}</td><td>${esc(d.phone)}</td><td><button class="btn secondary small" onclick="openDoctor('${d.id}')">Editar</button> <button class="btn danger small" onclick="deleteDoctor('${d.id}')">Excluir</button></td></tr>`).join(''):emptyRow(5,'Nenhum médico encontrado.')}
function renderAppointments(){const q=(document.getElementById('appointment-search')?.value||'').toLowerCase(),s=document.getElementById('status-filter')?.value||'';const list=[...db.appointments].filter(a=>(patientName(a.patientId)+' '+doctorName(a.doctorId)).toLowerCase().includes(q)&&(!s||a.status===s)).sort((a,b)=>a.datetime.localeCompare(b.datetime));document.getElementById('appointments-table').innerHTML=list.length?list.map(a=>`<tr><td><b>${esc(patientName(a.patientId))}</b></td><td>${esc(doctorName(a.doctorId))}</td><td>${esc(specName(a.doctorId))}</td><td>${dateTimeBR(a.datetime)}</td><td>${badge(a.status)}</td><td><button class="btn secondary small" onclick="openAppointment('${a.id}')">Editar</button> <button class="btn danger small" onclick="deleteAppointment('${a.id}')">Excluir</button></td></tr>`).join(''):emptyRow(6,'Nenhum agendamento encontrado.')}
function modal(title,body){document.getElementById('modal-root').innerHTML=`<div class="modal-backdrop" onclick="if(event.target===this)closeModal()"><div class="modal"><div class="modal-head"><h2>${title}</h2><button class="close" onclick="closeModal()">✕</button></div>${body}</div></div>`}
function closeModal(){document.getElementById('modal-root').innerHTML=''}
function openPatient(id=''){const p=db.patients.find(x=>x.id===id)||{name:'',cpf:'',birth:'',phone:'',email:''};modal(id?'Editar paciente':'Novo paciente',`<form id="patient-form"><div class="form-grid">
<div class="field full"><label>Nome completo *</label><input name="name" required maxlength="100" value="${esc(p.name)}"></div>
<div class="field"><label>CPF *</label><input name="cpf" required maxlength="14" placeholder="000.000.000-00" value="${esc(p.cpf)}"></div>
<div class="field"><label>Data de nascimento</label><input name="birth" type="date" value="${esc(p.birth)}"></div>
<div class="field"><label>Telefone *</label><input name="phone" required value="${esc(p.phone)}"></div>
<div class="field"><label>E-mail</label><input name="email" type="email" value="${esc(p.email)}"></div>
</div><div class="actions"><button type="button" class="btn secondary" onclick="closeModal()">Cancelar</button><button class="btn">Salvar paciente</button></div></form>`);
document.getElementById('patient-form').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),v=Object.fromEntries(f);if(db.patients.some(x=>x.cpf===v.cpf&&x.id!==id)){toast('Já existe paciente com este CPF.');return}if(id)Object.assign(p,v);else db.patients.push({id:uid(),...v});closeModal();save();toast('Paciente salvo com sucesso!')}}
function openDoctor(id=''){const d=db.doctors.find(x=>x.id===id)||{name:'',crm:'',specialty:'',phone:''};modal(id?'Editar médico':'Novo médico',`<form id="doctor-form"><div class="form-grid">
<div class="field full"><label>Nome completo *</label><input name="name" required value="${esc(d.name)}"></div>
<div class="field"><label>CRM *</label><input name="crm" required value="${esc(d.crm)}"></div>
<div class="field"><label>Especialidade *</label><select name="specialty" required>${['','Clínica Geral','Cardiologia','Dermatologia','Ginecologia','Neurologia','Ortopedia','Pediatria','Psiquiatria','Oftalmologia','Outra'].map(s=>`<option ${d.specialty===s?'selected':''} value="${esc(s)}">${s||'Selecione'}</option>`).join('')}</select></div>
<div class="field"><label>Telefone</label><input name="phone" value="${esc(d.phone)}"></div>
</div><div class="actions"><button type="button" class="btn secondary" onclick="closeModal()">Cancelar</button><button class="btn">Salvar médico</button></div></form>`);
document.getElementById('doctor-form').onsubmit=e=>{e.preventDefault();const v=Object.fromEntries(new FormData(e.target));if(db.doctors.some(x=>x.crm===v.crm&&x.id!==id)){toast('Já existe médico com este CRM.');return}if(id)Object.assign(d,v);else db.doctors.push({id:uid(),...v});closeModal();save();toast('Médico salvo com sucesso!')}}
function openAppointment(id=''){if(!db.patients.length||!db.doctors.length){toast('Cadastre ao menos um paciente e um médico antes.');return}const a=db.appointments.find(x=>x.id===id)||{patientId:'',doctorId:'',datetime:'',status:'Confirmada',note:''};const min=new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,16);
modal(id?'Editar agendamento':'Novo agendamento',`<div class="notice">Confira a disponibilidade antes de confirmar. O sistema impede dois agendamentos ativos no mesmo horário para o mesmo médico ou paciente.</div><form id="appointment-form"><div class="form-grid">
<div class="field full"><label>Paciente *</label><select name="patientId" required><option value="">Selecione um paciente</option>${db.patients.map(p=>`<option value="${p.id}" ${a.patientId===p.id?'selected':''}>${esc(p.name)} — ${esc(p.cpf)}</option>`).join('')}</select></div>
<div class="field full"><label>Médico *</label><select name="doctorId" required><option value="">Selecione um médico</option>${db.doctors.map(d=>`<option value="${d.id}" ${a.doctorId===d.id?'selected':''}>${esc(d.name)} — ${esc(d.specialty)}</option>`).join('')}</select></div>
<div class="field"><label>Data e horário *</label><input name="datetime" type="datetime-local" required value="${esc(a.datetime)}" min="${min}"></div>
<div class="field"><label>Status</label><select name="status">${['Confirmada','Pendente','Realizada','Cancelada'].map(s=>`<option ${a.status===s?'selected':''}>${s}</option>`).join('')}</select></div>
<div class="field full"><label>Observação administrativa</label><textarea name="note" maxlength="300">${esc(a.note)}</textarea></div>
</div><div class="actions"><button type="button" class="btn secondary" onclick="closeModal()">Cancelar</button><button class="btn">Salvar agendamento</button></div></form>`);
document.getElementById('appointment-form').onsubmit=e=>{e.preventDefault();const v=Object.fromEntries(new FormData(e.target));const conflict=db.appointments.find(x=>x.id!==id&&x.datetime===v.datetime&&x.status!=='Cancelada'&&v.status!=='Cancelada'&&(x.doctorId===v.doctorId||x.patientId===v.patientId));if(conflict){toast('Conflito: médico ou paciente já possui consulta neste horário.');return}if(id)Object.assign(a,v);else db.appointments.push({id:uid(),...v});closeModal();save();toast('Agendamento salvo com sucesso!')}}
function deletePatient(id){if(db.appointments.some(a=>a.patientId===id&&a.status!=='Cancelada')){toast('Cancele os agendamentos ativos antes de excluir.');return}if(confirm('Excluir este paciente?')){db.patients=db.patients.filter(p=>p.id!==id);save();toast('Paciente excluído.')}} 
function deleteDoctor(id){if(db.appointments.some(a=>a.doctorId===id&&a.status!=='Cancelada')){toast('Cancele os agendamentos ativos antes de excluir.');return}if(confirm('Excluir este médico?')){db.doctors=db.doctors.filter(d=>d.id!==id);save();toast('Médico excluído.')}} 
function deleteAppointment(id){if(confirm('Excluir este agendamento permanentemente?')){db.appointments=db.appointments.filter(a=>a.id!==id);save();toast('Agendamento excluído.')}} 
// Dados demonstrativos: podem ser removidos pela interface.
if(!localStorage.getItem(KEY)){
 const p1={id:uid(),name:'Maria Oliveira',cpf:'123.456.789-00',birth:'1988-04-12',phone:'(11) 99999-1111',email:'maria@email.com'};
 const p2={id:uid(),name:'João Santos',cpf:'987.654.321-00',birth:'1975-09-03',phone:'(11) 98888-2222',email:'joao@email.com'};
 const d1={id:uid(),name:'Dra. Ana Costa',crm:'CRM-SP 123456',specialty:'Cardiologia',phone:'(11) 97777-3333'};
 const d2={id:uid(),name:'Dr. Paulo Mendes',crm:'CRM-SP 654321',specialty:'Clínica Geral',phone:'(11) 96666-4444'};
 db={patients:[p1,p2],doctors:[d1,d2],appointments:[
 {id:uid(),patientId:p1.id,doctorId:d1.id,datetime:new Date(Date.now()+86400000).toISOString().slice(0,16),status:'Confirmada',note:''},
 {id:uid(),patientId:p2.id,doctorId:d2.id,datetime:new Date(Date.now()+172800000).toISOString().slice(0,16),status:'Pendente',note:''}
 ]};localStorage.setItem(KEY,JSON.stringify(db));
}
refreshAll();
const DEMO_EMAIL='admin@sigeh.com', DEMO_PASSWORD='123456';
function enterApp(){document.getElementById('login-screen').style.display='none';document.getElementById('app-shell').style.display='flex'}
function logout(){sessionStorage.removeItem('sigeh_logged');document.getElementById('app-shell').style.display='none';document.getElementById('login-screen').style.display='grid';document.getElementById('login-password').value='';document.getElementById('login-error').textContent=''}
document.getElementById('login-form').addEventListener('submit',e=>{e.preventDefault();const email=document.getElementById('login-email').value.trim().toLowerCase(),password=document.getElementById('login-password').value; if(email===DEMO_EMAIL&&password===DEMO_PASSWORD){sessionStorage.setItem('sigeh_logged','1');enterApp()}else{document.getElementById('login-error').textContent='E-mail ou senha incorretos. Confira os dados de demonstração.'}});
if(sessionStorage.getItem('sigeh_logged')==='1')enterApp();
