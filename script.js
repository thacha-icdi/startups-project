document.querySelectorAll('.open-project').forEach(button => {
  button.addEventListener('click', () => {
    const detail = document.getElementById(button.dataset.target);
    const isOpen = detail.classList.contains('active');

    document.querySelectorAll('.project-detail').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.open-project').forEach(item => item.textContent = 'Open Project →');

    if (!isOpen) {
      detail.classList.add('active');
      button.textContent = 'Close Project ↑';
      setTimeout(() => detail.scrollIntoView({behavior:'smooth', block:'nearest'}), 50);
    }
  });
});

const conceptForm = document.getElementById('concept-form');
const saveStatus = document.getElementById('save-status');
const conceptKey = 'startups-business-888399-concept';

function loadConceptDraft() {
  const saved = localStorage.getItem(conceptKey);
  if (!saved || !conceptForm) return;
  const data = JSON.parse(saved);
  Object.entries(data).forEach(([key, value]) => {
    if (conceptForm.elements[key]) conceptForm.elements[key].value = value;
  });
  saveStatus.textContent = 'Draft loaded';
}

if (conceptForm) {
  loadConceptDraft();

  conceptForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(conceptForm).entries());
    localStorage.setItem(conceptKey, JSON.stringify(data));
    saveStatus.textContent = 'Saved on this device';
  });

  document.getElementById('clear-concept').addEventListener('click', () => {
    if (!confirm('Clear this 888399 draft from this device?')) return;
    localStorage.removeItem(conceptKey);
    conceptForm.reset();
    saveStatus.textContent = 'Draft cleared';
  });
}
function bindDraftForm(formId, storageKey, statusId, clearId) {
  const form = document.getElementById(formId);
  const status = document.getElementById(statusId);
  if (!form) return;
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    const data = JSON.parse(saved);
    Object.entries(data).forEach(([key,value]) => { if (form.elements[key]) form.elements[key].value = value; });
    status.textContent = 'Draft loaded';
  }
  form.addEventListener('submit', e => {
    e.preventDefault();
    localStorage.setItem(storageKey, JSON.stringify(Object.fromEntries(new FormData(form).entries())));
    status.textContent = 'Saved on this device';
  });
  document.getElementById(clearId).addEventListener('click', () => {
    if (!confirm('Clear this draft from this device?')) return;
    localStorage.removeItem(storageKey); form.reset(); status.textContent = 'Draft cleared';
  });
}
bindDraftForm('research-form','startups-business-888399-research','research-status','clear-research');

const surveyForm=document.getElementById('survey-form');
const questionsBox=document.getElementById('survey-questions');
const surveyKey='startups-business-888399-survey';
let surveyQuestions=[];

function renderQuestions(){
  if(!questionsBox) return;
  questionsBox.innerHTML='';
  surveyQuestions.forEach((q,i)=>{
    const row=document.createElement('div'); row.className='survey-question';
    row.innerHTML='<span class="q-number">Q'+(i+1)+'</span><input aria-label="Question '+(i+1)+'" value="'+(q.text||'').replace(/"/g,'&quot;')+'" placeholder="Write a customer question"><select aria-label="Question type"><option>Open text</option><option>Multiple choice</option><option>Yes / No</option><option>1–5 scale</option></select><button type="button" class="remove-question" aria-label="Remove question">×</button>';
    const input=row.querySelector('input'), select=row.querySelector('select');
    select.value=q.type||'Open text';
    input.addEventListener('input',()=>surveyQuestions[i].text=input.value);
    select.addEventListener('change',()=>surveyQuestions[i].type=select.value);
    row.querySelector('.remove-question').addEventListener('click',()=>{surveyQuestions.splice(i,1);renderQuestions();});
    questionsBox.appendChild(row);
  });
}
function addSurveyQuestion(text='',type='Open text'){surveyQuestions.push({text,type});renderQuestions();}
if(surveyForm){
  const saved=localStorage.getItem(surveyKey);
  if(saved){
    const data=JSON.parse(saved);
    surveyQuestions=data.questions||[];
    Object.entries(data.fields||{}).forEach(([k,v])=>{if(surveyForm.elements[k])surveyForm.elements[k].value=v;});
    document.getElementById('survey-status').textContent='Draft loaded';
  }
  if(!surveyQuestions.length){addSurveyQuestion('How do you currently deal with this problem?');addSurveyQuestion('What is the most difficult part of this problem?');addSurveyQuestion('How often does this problem occur?');}
  else renderQuestions();
  document.getElementById('add-question').addEventListener('click',()=>addSurveyQuestion());
  surveyForm.addEventListener('submit',e=>{
    e.preventDefault();
    localStorage.setItem(surveyKey,JSON.stringify({fields:Object.fromEntries(new FormData(surveyForm).entries()),questions:surveyQuestions}));
    document.getElementById('survey-status').textContent='Saved on this device';
  });
  document.getElementById('clear-survey').addEventListener('click',()=>{
    if(!confirm('Clear this survey draft from this device?'))return;
    localStorage.removeItem(surveyKey);surveyForm.reset();surveyQuestions=[];addSurveyQuestion();document.getElementById('survey-status').textContent='Draft cleared';
  });
}