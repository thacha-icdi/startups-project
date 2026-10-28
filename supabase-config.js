// Public browser configuration. Never place Supabase secret/service_role keys here.
window.STARTUPS_SUPABASE_CONFIG = {
  url: 'https://husojjbhrjisulminqpk.supabase.co',
  publishableKey: 'sb_publishable_9MEjjlQ7euPH81RRL9-VeQ_GgdiPYL0'
};

// Load the course Excel roster interface after the page is ready.
document.addEventListener('DOMContentLoaded',()=>{const e=document.createElement('script');e.src='roster-excel.js?v=20261028-1';document.body.appendChild(e);});
