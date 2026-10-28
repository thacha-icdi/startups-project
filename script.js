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
bindDraftForm('validation-form','startups-business-888399-validation','validation-status','clear-validation');
bindDraftForm('fit-form','startups-business-888399-pain-solution','fit-status','clear-fit');

bindDraftForm('bmc-form','startups-business-888399-bmc','bmc-status','clear-bmc');

bindDraftForm('digital-tools-form','startups-business-888399-digital-tools','digital-tools-status','clear-digital-tools');

bindDraftForm('prototype-plan-form','startups-business-888498-plan','prototype-plan-status','clear-prototype-plan');
bindDraftForm('prototype-build-form','startups-business-888498-build','prototype-build-status','clear-prototype-build');
bindDraftForm('prototype-test-form','startups-business-888498-test','prototype-test-status','clear-prototype-test');

bindDraftForm('test-run-plan-form','startups-business-888499-plan','test-run-plan-status','clear-test-run-plan');
bindDraftForm('customer-test-form','startups-business-888499-customer-test','customer-test-status','clear-customer-test');
bindDraftForm('business-results-form','startups-business-888499-results','business-results-status','clear-business-results');
bindDraftForm('future-plan-form','startups-business-888499-future-plan','future-plan-status','clear-future-plan');

const profileForm=document.getElementById('profile-form');
const profileStatus=document.getElementById('profile-status');
const profileCourseLabel=document.getElementById('profile-course-label');
let activeProfileCourse='888399';
const profileKeyFor=course=>'startups-business-project-profile-'+course;

function loadCourseProfile(course){
  activeProfileCourse=course;
  profileCourseLabel.textContent=course;
  document.querySelectorAll('.profile-course').forEach(btn=>btn.classList.toggle('active',btn.dataset.profileCourse===course));
  let saved={};
  try{saved=JSON.parse(localStorage.getItem(profileKeyFor(course))||'{}')}catch(e){}
  Array.from(profileForm.elements).forEach(el=>{
    if(!el.name)return;
    if(el.type==='checkbox')el.checked=Boolean(saved[el.name]);
    else el.value=saved[el.name]||'';
  });
  profileStatus.textContent=Object.keys(saved).length ? course+' profile loaded' : course+' profile not saved';
}
document.querySelectorAll('.profile-course').forEach(btn=>btn.addEventListener('click',()=>loadCourseProfile(btn.dataset.profileCourse)));
profileForm.addEventListener('submit',e=>{
  e.preventDefault();
  const data={};
  new FormData(profileForm).forEach((value,key)=>data[key]=value);
  localStorage.setItem(profileKeyFor(activeProfileCourse),JSON.stringify(data));
  profileStatus.textContent=activeProfileCourse+' profile saved';
  updateDashboard();
});
document.getElementById('clear-profile').addEventListener('click',()=>{
  localStorage.removeItem(profileKeyFor(activeProfileCourse));
  profileForm.reset();
  profileStatus.textContent=activeProfileCourse+' profile cleared';
});
loadCourseProfile('888399');

function readDraft(key){try{return JSON.parse(localStorage.getItem(key)||'{}')}catch(e){return {}}}
function shortText(value,fallback){if(!value)return fallback;return value.length>150?value.slice(0,147)+'...':value}
function updateDashboard(){
  const v399=readDraft('startups-business-888399-validation');
  const fit=readDraft('startups-business-888399-pain-solution');
  const ptest=readDraft('startups-business-888498-test');
  const btest=readDraft('startups-business-888499-customer-test');
  const results=readDraft('startups-business-888499-results');
  const future=readDraft('startups-business-888499-future-plan');
  document.getElementById('dash-399').textContent=shortText(fit.painEvidence||v399.decisionReason,'No saved evidence yet.');
  document.getElementById('dash-399-decision').textContent='Decision: '+(v399.overallDecision||'—');
  document.getElementById('dash-498').textContent=shortText(ptest.testEvidence||ptest.observedBehavior,'No saved prototype evidence yet.');
  document.getElementById('dash-498-decision').textContent='Decision: '+(ptest.prototypeDecision||'—');
  document.getElementById('dash-499').textContent=shortText(btest.commitmentEvidence||results.keyLearning,'No saved market-test evidence yet.');
  document.getElementById('dash-499-decision').textContent='Decision: '+(future.finalDecision||'—');
  document.getElementById('dashboard-next-action').textContent=future.next30Days||results.improvement||ptest.changes||v399.nextExperiment||'Save evidence in a project workspace to build your startup journey.';
}
document.querySelectorAll('[data-jump]').forEach(btn=>btn.addEventListener('click',()=>{
  const id=btn.dataset.jump, detail=document.getElementById(id);
  document.querySelectorAll('.project-detail').forEach(x=>x.classList.remove('active'));
  document.querySelectorAll('.open-project').forEach(x=>x.textContent='Open Project →');
  detail.classList.add('active');
  const opener=document.querySelector('[data-target="'+id+'"]');if(opener)opener.textContent='Close Project ↑';
  detail.scrollIntoView({behavior:'smooth',block:'start'});
}));
document.querySelectorAll('.validation-workspace form').forEach(form=>form.addEventListener('submit',()=>setTimeout(updateDashboard,0)));
updateDashboard();

function setupOfficialRequirements(course){
 const box=document.querySelector('#detail-'+course+' .official-requirements'); if(!box)return;
 const key='startups-business-'+course+'-official-requirements';
 const checks=[...box.querySelectorAll('input[type="checkbox"]')], notes=box.querySelector('textarea'), status=document.getElementById('req'+course+'-status');
 const saved=readDraft(key);
 if(Array.isArray(saved.checked)){checks.forEach((x,i)=>x.checked=!!saved.checked[i]);notes.value=saved.notes||'';status.textContent='Checklist loaded';}
 box.querySelector('.save-requirements').addEventListener('click',()=>{localStorage.setItem(key,JSON.stringify({checked:checks.map(x=>x.checked),notes:notes.value}));status.textContent='Saved on this device';});
}
['399','498','499'].forEach(setupOfficialRequirements);

const printProfileButton = document.getElementById('print-profile');
if (printProfileButton) {
  printProfileButton.addEventListener('click', () => {
    document.body.classList.add('printing-profile');
    window.print();
    setTimeout(() => document.body.classList.remove('printing-profile'), 500);
  });
}
window.addEventListener('afterprint', () => document.body.classList.remove('printing-profile'));

const emailProfileButton = document.getElementById('email-profile');
if (emailProfileButton) {
  emailProfileButton.addEventListener('click', () => {
    const form = document.getElementById('profile-form');
    const data = new FormData(form);
    const projectName = data.get('projectName') || 'Startup Project';
    const body = [
      activeProfileCourse + ' STARTUP PROJECT PROFILE',
      '',
      'Startup / Project Name: ' + (data.get('projectName') || '-'),
      'Target Customer: ' + (data.get('targetCustomer') || '-'),
      '',
      'Student Name 1: ' + (data.get('studentName1') || '-'),
      'Student ID 1: ' + (data.get('studentId1') || '-'),
      'Student Name 2: ' + (data.get('studentName2') || '-'),
      'Student ID 2: ' + (data.get('studentId2') || '-'),
      'Student Name 3: ' + (data.get('studentName3') || '-'),
      'Student ID 3: ' + (data.get('studentId3') || '-'),
      '',
      'Advisor Name: ' + (data.get('advisorName') || '-'),
      'Co-advisor Name: ' + (data.get('coAdvisorName') || '-'),
      '',
      'Startup Problem / Opportunity:',
      data.get('startupProblem') || '-'
    ].join('\n');
    const subject = activeProfileCourse + ' Startup Project Profile - ' + projectName;
    window.location.href = 'mailto:thacha.l@icdi.cmu.ac.th,somsak.c@icdi.cmu.ac.th,aniwat.ph@cmu.ac.th,Kanyanatthakarn.in@cmu.ac.th,sureeporn.t@cmu.ac.th,tanyaluck.k@cmu.ac.th?subject=' +
      encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });
}

const emailConceptButton = document.getElementById('email-concept');
if (emailConceptButton && conceptForm) {
  emailConceptButton.addEventListener('click', () => {
    const data = Object.fromEntries(new FormData(conceptForm).entries());
    const candidates = [data.groupEmails || '', data.advisorEmail || '', data.coAdvisorEmail || '']
      .join(',').split(/[;,\s]+/).map(email => email.trim()).filter(Boolean);
    const recipients = [...new Set(candidates)];
    if (!recipients.length || recipients.some(email => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
      alert('Enter valid email addresses for group members and/or advisors before emailing.');
      return;
    }
    localStorage.setItem(conceptKey, JSON.stringify(data));
    saveStatus.textContent = 'Saved on this device';
    const fields = [
      ['Startup / Project Name', data.startupName],
      ['Target Customer', data.targetCustomer],
      ['Customer Pain Point', data.painPoint],
      ['Current Alternatives', data.alternatives],
      ['Proposed Solution', data.solution],
      ['Validation Evidence', data.evidence],
      ['Key Learning / Decision', data.learning]
    ];
    const body = ['888399 — Business Concept Validation', '', ...fields.map(([label, value]) => label + ':\n' + (value || '-') + '\n')].join('\n');
    const subject = '888399 Business Concept Validation - ' + (data.startupName || 'Startup Project');
    window.location.href = 'mailto:' + recipients.join(',') + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });
}


/* Local attachments for each 888399 concept section; old evidence records remain visible. */
(() => {
  const inputs = document.querySelectorAll('#concept-form input[data-attachment-category]');
  if (!inputs.length) return;
  const dbPromise = new Promise((resolve,reject) => {
    const req = indexedDB.open('startup-evidence-images',1);
    req.onupgradeneeded = () => req.result.createObjectStore('pictures',{keyPath:'id',autoIncrement:true});
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  async function request(mode, action) {
    const db = await dbPromise;
    return new Promise((resolve,reject) => {
      const req = action(db.transaction('pictures',mode).objectStore('pictures'));
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  inputs.forEach(input => {
    const category = input.dataset.attachmentCategory;
    const gallery = document.getElementById(category === 'evidence' ? 'concept-image-gallery' : 'concept-gallery-'+category);
    const status = document.getElementById(category === 'evidence' ? 'concept-image-status' : 'concept-status-'+category);
    async function render() {
      const all = await request('readonly',store => store.getAll());
      gallery.replaceChildren();
      all.filter(item => (item.category || 'evidence') === category).forEach(item => {
        const figure = document.createElement('figure');
        if (item.file.type.startsWith('image/')) {
          const img = document.createElement('img');
          const url = URL.createObjectURL(item.file);
          img.src = url; img.alt = item.name; img.onload = () => URL.revokeObjectURL(url);
          figure.append(img);
        }
        const caption = document.createElement('figcaption');
        caption.append(document.createTextNode(item.name+' '));
        const download = document.createElement('a');
        download.textContent = 'Download';
        const url = URL.createObjectURL(item.file);
        download.href = url; download.download = item.name;
        download.addEventListener('click', () => setTimeout(() => URL.revokeObjectURL(url),60000),{once:true});
        const remove = document.createElement('button');
        remove.type='button'; remove.textContent='Remove';
        remove.addEventListener('click',async () => {
          await request('readwrite',store => store.delete(item.id));
          await render();
        });
        caption.append(download,document.createTextNode(' '),remove);
        figure.append(caption); gallery.append(figure);
      });
    }
    input.addEventListener('change',async () => {
      try {
        let skipped=0;
        for (const file of input.files) {
          if (!file.type.startsWith('image/') && !/\.(doc|docx|pdf|ppt|pptx|html|htm)$/i.test(file.name)) {skipped++;continue;}
          if (file.size > 8*1024*1024) {skipped++;continue;}
          await request('readwrite',store => store.add({category,name:file.name,file,created:Date.now()}));
        }
        input.value='';
        await render();
        status.textContent = skipped ? skipped+' file(s) skipped (unsupported or over 8 MB).' : 'Files saved in this browser.';
      } catch(e) {status.textContent='Could not save files. Check browser storage.';}
    });
    render().catch(() => {status.textContent='File storage unavailable.';});
  });
})();

/* Supporting documents attached to individual workspace text areas. */
(() => {
  const blocks = document.querySelectorAll('.field-attachments');
  if (!blocks.length) return;
  const dbReady = new Promise((resolve,reject) => {
    const req = indexedDB.open('startup-workspace-attachments',1);
    req.onupgradeneeded = () => req.result.createObjectStore('files',{keyPath:'id',autoIncrement:true});
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  async function operation(mode, action) {
    const db = await dbReady;
    return new Promise((resolve,reject) => {
      const req = action(db.transaction('files',mode).objectStore('files'));
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  blocks.forEach(block => {
    const formId = block.dataset.attachmentForm;
    const field = block.dataset.attachmentField;
    const input = block.querySelector('input[type=file]');
    const gallery = block.querySelector('.attachment-gallery');
    const status = block.querySelector('.attachment-status');
    const key = formId + ':' + field;
    async function render() {
      const files = (await operation('readonly',store => store.getAll())).filter(item => item.key === key);
      gallery.replaceChildren();
      files.forEach(item => {
        const figure = document.createElement('figure');
        if (item.file.type.startsWith('image/')) {
          const img = document.createElement('img');
          const url = URL.createObjectURL(item.file);
          img.src=url; img.alt=item.name;
          img.onload=() => URL.revokeObjectURL(url);
          figure.append(img);
        }
        const caption=document.createElement('figcaption');
        caption.append(document.createTextNode(item.name+' '));
        const link=document.createElement('a');
        link.textContent='Download';
        const url=URL.createObjectURL(item.file);
        link.href=url; link.download=item.name;
        link.addEventListener('click',() => setTimeout(() => URL.revokeObjectURL(url),60000),{once:true});
        const remove=document.createElement('button');
        remove.type='button'; remove.textContent='Remove';
        remove.addEventListener('click',async () => {
          await operation('readwrite',store => store.delete(item.id));
          await render();
        });
        caption.append(link,document.createTextNode(' '),remove);
        figure.append(caption);gallery.append(figure);
      });
    }
    input.addEventListener('change',async () => {
      try {
        let skipped=0;
        for(const file of input.files) {
          if ((!file.type.startsWith('image/') && !/\.(doc|docx|pdf|ppt|pptx|html|htm)$/i.test(file.name)) || file.size>8*1024*1024) {skipped++;continue;}
          await operation('readwrite',store => store.add({key,name:file.name,file}));
        }
        input.value='';
        await render();
        status.textContent=skipped ? skipped+' unsupported or oversized file(s) skipped (8 MB limit).' : 'Files saved in this browser.';
      } catch(e) {status.textContent='Could not save files. Check browser storage.';}
    });
    render().catch(() => {status.textContent='File storage unavailable.';});
  });
})();

/* Share any task's current fields with group members and advisors. */
document.querySelectorAll('form .email-task-button').forEach(button => {
  button.addEventListener('click', () => {
    const form = button.closest('form');
    const data = new FormData(form);
    const recipients = [...new Set(
      [data.get('groupEmails') || '',data.get('advisorEmail') || '',data.get('coAdvisorEmail') || '']
        .join(',').split(/[;,\s]+/).map(s => s.trim()).filter(Boolean)
    )];
    if (!recipients.length || recipients.some(s => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s))) {
      alert('Please enter valid group member and/or advisor email addresses.');
      return;
    }
    const taskTitle = form.closest('.validation-workspace')?.querySelector('.workspace-head h4')?.textContent?.trim() || form.id.replace(/-form$/,'').replace(/-/g,' ');
    const course = form.closest('#detail-399') ? '888399' : form.closest('#detail-498') ? '888498' : form.closest('#detail-499') ? '888499' : 'Startup';
    const lines = [course+' — '+taskTitle,''];
    form.querySelectorAll('input[name]:not([type=file]),textarea[name],select[name]').forEach(field => {
      if (['groupEmails','advisorEmail','coAdvisorEmail'].includes(field.name)) return;
      const label = field.closest('label')?.textContent?.trim() || field.name;
      lines.push(label+': '+(field.value || '-'),'');
    });
    lines.push('Supporting files must be attached manually in your email app.');
    window.location.href='mailto:'+recipients.join(',')+'?subject='+encodeURIComponent(course+' '+taskTitle)+'&body='+encodeURIComponent(lines.join('\n'));
  });
});

/* Offline BMC suggestion builder: transparent templates, not AI or verified market research. */
(() => {
  const form=document.getElementById('bmc-form');
  const generate=document.getElementById('generate-bmc');
  const clear=document.getElementById('clear-generated-bmc');
  const status=document.getElementById('bmc-generate-status');
  if(!form||!generate||!clear)return;
  const names=['keyPartners','keyActivities','keyResources','customerRelationships','channels','customerSegments','costStructure','revenueStreams'];
  let generated={};
  const clean=s=>s.replace(/\s+/g,' ').trim();
  generate.addEventListener('click',()=>{
    const description=clean(form.elements.valuePropositions.value);
    if(!description){status.textContent='Please enter a product or service description first.';status.style.color='#b42318';return;} status.style.color='#067647';
    const short=description.length>115?description.slice(0,112).replace(/\s+\S*$/,'')+'…':description;
    const drafts={
      keyPartners:[
        'Identify suppliers or service partners needed to deliver: '+short,
        'Explore distribution or referral partners who reach the target users',
        'Identify technology, payment or logistics providers if required',
        'Confirm legal, compliance or industry partners where relevant',
        'Test partnership interest before treating any partner as secured'
      ],
      keyActivities:[
        'Define the minimum deliverable version of the proposed product or service',
        'Interview intended customers to verify the problem and value',
        'Build, test and improve the core customer experience',
        'Plan customer acquisition and onboarding activities',
        'Measure customer feedback, retention and operational quality'
      ],
      keyResources:[
        'People with skills to build and deliver the proposed offering',
        'Tools, software, equipment or facilities required for delivery',
        'Customer insights and evidence validating the stated need',
        'Time and budget for a small prototype and customer test',
        'Brand, content, processes and any necessary intellectual property'
      ],
      customerRelationships:[
        'Provide a clear onboarding or first-use experience',
        'Collect structured feedback after customers try the offering',
        'Offer support through a channel customers can access',
        'Follow up to understand repeat use and unresolved problems',
        'Test trust-building and retention methods with real customers'
      ],
      channels:[
        'Test direct outreach to the intended customer segment',
        'Create a simple page or demonstration explaining the offering',
        'Evaluate relevant social media or online discovery channels',
        'Test referrals or partnerships as acquisition channels',
        'Measure which channels lead to meaningful customer actions'
      ],
      customerSegments:[
        'Identify people or organizations facing the problem described',
        'Define primary users who would interact with the offering',
        'Distinguish users from purchasers or decision makers',
        'Segment by context, urgency, frequency and ability to pay',
        'Interview early adopters and refine the segment using evidence'
      ],
      costStructure:[
        'Estimate initial development or setup expenses',
        'Calculate materials, hosting, service or delivery costs per customer',
        'Estimate marketing and customer acquisition costs',
        'Include staff time, support and ongoing operating costs',
        'Check licensing, transaction and compliance expenses if applicable'
      ],
      revenueStreams:[
        'Identify who would pay for the value described',
        'Test one-time purchase pricing if appropriate',
        'Evaluate subscription or recurring fees only if repeat value exists',
        'Explore service, transaction or usage-based fees where relevant',
        'Validate willingness to pay with actual commitments or transactions'
      ]
    };
    const populated=names.filter(name=>clean(form.elements[name].value));
    if(populated.length&&!confirm('Replace the existing content in the other eight BMC sections with new suggestions?'))return;
    names.forEach(name=>{
      const content=drafts[name].map(line=>'• '+line).join('\n');
      form.elements[name].value=content;
      generated[name]=content;
    });
    status.textContent='Generated 5 bullets in all 8 sections. Review and click Save BMC.';
  });
  clear.addEventListener('click',()=>{
    let removed=0;
    names.forEach(name=>{
      if(generated[name]&&form.elements[name].value===generated[name]){
        form.elements[name].value='';removed++;
      }
    });
    status.textContent=removed ? 'Cleared '+removed+' generated sections. Manually edited sections were kept.' : 'No unchanged generated sections to clear.';
  });
})();

/* Per-criterion evidence uploads for official presentation requirements. */
(() => {
  const sections = ['399','498','499'];
  const dbReady = new Promise((resolve,reject)=>{
    const req=indexedDB.open('startup-requirement-files',1);
    req.onupgradeneeded=()=>req.result.createObjectStore('files',{keyPath:'id',autoIncrement:true});
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
  async function action(mode,fn){
    const db=await dbReady;
    return new Promise((resolve,reject)=>{
      const req=fn(db.transaction('files',mode).objectStore('files'));
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>reject(req.error);
    });
  }
  sections.forEach(course=>{
    const section=document.querySelector('#detail-'+course+' .official-requirements');
    if(!section)return;
    section.querySelectorAll('.requirement-item').forEach(item=>{
      const input=item.querySelector('.requirement-file-input');
      const output=item.querySelector('.requirement-files');
      const criterion=Number(input.dataset.criterion);
      async function render(){
        const records=(await action('readonly',store=>store.getAll())).filter(x=>x.course===course&&x.criterion===criterion);
        output.replaceChildren();
        records.forEach(record=>{
          const row=document.createElement('div');
          const link=document.createElement('a');
          const url=URL.createObjectURL(record.file);
          link.href=url;link.download=record.name;link.textContent=record.name;
          link.addEventListener('click',()=>setTimeout(()=>URL.revokeObjectURL(url),60000),{once:true});
          const remove=document.createElement('button');
          remove.type='button';remove.textContent='Remove';
          remove.addEventListener('click',async()=>{await action('readwrite',store=>store.delete(record.id));await render();});
          row.append(link,document.createTextNode(' '),remove);output.append(row);
        });
      }
      input.addEventListener('change',async()=>{
        try{
          let skipped=0;
          for(const file of input.files){
            if((!file.type.startsWith('image/')&&!/\.(doc|docx|pdf|ppt|pptx|html|htm)$/i.test(file.name))||file.size>8*1024*1024){skipped++;continue;}
            await action('readwrite',store=>store.add({course,criterion,name:file.name,file}));
          }
          input.value='';await render();
          if(skipped)alert(skipped+' file(s) skipped: unsupported type or over 8 MB.');
        }catch(e){alert('Could not save evidence files in this browser.');}
      });
      render().catch(()=>{output.textContent='File storage unavailable.';});
    });
  });
})();

/* Live profile preview, updated without requiring a save. */
(() => {
  const form=document.getElementById('profile-form');
  const details=document.getElementById('profile-preview-details');
  const course=document.getElementById('preview-course');
  if(!form||!details)return;
  const fields=[
    ['projectName','Startup / Project Name'],['targetCustomer','Target Customer'],
    ['studentName1','Student Name 1'],['studentId1','Student ID 1'],
    ['studentName2','Student Name 2'],['studentId2','Student ID 2'],
    ['studentName3','Student Name 3'],['studentId3','Student ID 3'],
    ['advisorName','Advisor'],['coAdvisorName','Co-advisor'],
    ['startupProblem','Startup Problem / Opportunity']
  ];
  function update(){
    course.textContent=activeProfileCourse;
    details.replaceChildren();
    fields.forEach(([name,label])=>{
      const dt=document.createElement('dt');dt.textContent=label;
      const dd=document.createElement('dd');dd.textContent=form.elements[name]?.value.trim()||'—';
      details.append(dt,dd);
    });
  }
  form.addEventListener('input',update);
  form.addEventListener('reset',()=>queueMicrotask(update));
  document.querySelectorAll('.profile-course').forEach(button=>button.addEventListener('click',update));
  update();
})();

/* Live preview for every startup workspace task. */
(() => {
  document.querySelectorAll('form .task-live-preview').forEach(preview => {
    const form=preview.closest('form');
    const output=preview.querySelector('.task-preview-details');
    const heading=preview.querySelector('h4');
    const workspace=form.closest('.validation-workspace');
    const title=workspace?.querySelector('.workspace-head h4')?.textContent?.trim();
    heading.textContent=title||form.id.replace(/-form$/,'').replace(/-/g,' ');
    function render(){
      output.replaceChildren();
      form.querySelectorAll('input[name]:not([type=file]),textarea[name],select[name]').forEach(field=>{
        if(field.type==='hidden'||field.type==='button'||field.type==='submit')return;
        const label=field.closest('label')?.childNodes[0]?.textContent?.trim()||field.name;
        const value=field.type==='checkbox'?(field.checked?'Yes':'No'):field.value.trim();
        const dt=document.createElement('dt'),dd=document.createElement('dd');
        dt.textContent=label;dd.textContent=value||'—';
        output.append(dt,dd);
      });
    }
    form.addEventListener('input',render);
    form.addEventListener('change',render);
    form.addEventListener('reset',()=>setTimeout(render,0));
    render();
  });
})();

/* Private, browser-local manually managed roster for course 888399. */
(() => {
  const key='startups-business-local-roster-888399';
  const form=document.getElementById('profile-form');
  const nameInput=document.getElementById('roster-student-name');
  const idInput=document.getElementById('roster-student-id');
  const list=document.getElementById('roster-admin-list');
  const status=document.getElementById('roster-admin-status');
  const picks=[...document.querySelectorAll('[data-roster-slot]')];
  if(!form||!nameInput||!idInput||!list)return;
  let students=[];
  try{const saved=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(saved))students=saved.filter(s=>s&&typeof s.name==='string'&&typeof s.id==='string');}catch(e){}
  const save=()=>{try{localStorage.setItem(key,JSON.stringify(students));status.textContent='Saved in this browser.';}catch(e){status.textContent='Could not save on this browser.';}};
  function render(){
    list.replaceChildren();
    students.forEach((s,i)=>{
      const row=document.createElement('div');row.className='roster-item';
      const label=document.createElement('span');label.textContent=s.name+' — '+s.id;
      const remove=document.createElement('button');remove.type='button';remove.textContent='Remove';remove.addEventListener('click',()=>{students.splice(i,1);save();render();});
      row.append(label,remove);list.append(row);
    });
    picks.forEach(p=>{
      const previous=p.value;p.replaceChildren();
      const blank=document.createElement('option');blank.value='';blank.textContent='Select student';p.append(blank);
      students.forEach(s=>{const option=document.createElement('option');option.value=s.id;option.textContent=s.name+' ('+s.id+')';p.append(option);});
      if(students.some(s=>s.id===previous))p.value=previous;
    });
  }
  document.getElementById('roster-add').addEventListener('click',()=>{
    const name=nameInput.value.trim(),id=idInput.value.trim();
    if(!name||!id){status.textContent='Enter both name and student ID.';return;}
    if(students.some(s=>s.id===id)){status.textContent='Student ID already exists.';return;}
    students.push({name,id});students.sort((a,b)=>a.name.localeCompare(b.name));
    save();nameInput.value='';idInput.value='';render();
  });
  picks.forEach(p=>p.addEventListener('change',()=>{
    const s=students.find(item=>item.id===p.value);if(!s)return;
    const n=p.dataset.rosterSlot;
    const name=form.elements.namedItem('studentName'+n),id=form.elements.namedItem('studentId'+n);
    if(name&&id){name.value=s.name;id.value=s.id;name.dispatchEvent(new Event('input',{bubbles:true}));id.dispatchEvent(new Event('input',{bubbles:true}));}
  }));
  render();
})();
