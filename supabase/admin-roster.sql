-- Run in the Supabase SQL Editor as the project owner.
create table if not exists public.site_settings (
  setting_key text primary key,
  setting_value text not null,
  updated_at timestamptz not null default now(),
  updated_by uuid
);
insert into public.site_settings(setting_key,setting_value)
values ('student_roster_888399','https://www1.reg.cmu.ac.th/registrationoffice/student_list_enrollment.php?semester=2&year=2569&course=888399&sec=000&lab=701&type=enroll&typee=')
on conflict (setting_key) do nothing;
alter table public.site_settings enable row level security;
revoke all on public.site_settings from anon,authenticated;
grant select on public.site_settings to anon,authenticated;
grant update on public.site_settings to authenticated;

create or replace function public.is_roster_admin()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from auth.users u
    where u.id = (select auth.uid())
      and u.email_confirmed_at is not null
      and lower(u.email) = any (array[
        'thacha.l@icdi.cmu.ac.th',
        'somsak.c@icdi.cmu.ac.th',
        'aniwat.ph@cmu.ac.th',
        'kanyanatthakarn.in@cmu.ac.th',
        'sureeporn.t@cmu.ac.th'
      ])
  );
$$;
revoke all on function public.is_roster_admin() from public,anon;
grant execute on function public.is_roster_admin() to authenticated;
drop policy if exists "Public can read published settings" on public.site_settings;
create policy "Public can read published settings" on public.site_settings
for select to anon,authenticated using (setting_key = 'student_roster_888399');
drop policy if exists "Only confirmed roster admins update settings" on public.site_settings;
create policy "Only confirmed roster admins update settings" on public.site_settings
for update to authenticated
using (setting_key = 'student_roster_888399' and (select public.is_roster_admin()))
with check (setting_key = 'student_roster_888399' and (select public.is_roster_admin()));
-- Configure Supabase Auth: disable public signups; invite the five admin emails.
-- Enable a trusted email sign-in flow; for university SSO, configure CMU's supported OIDC/SAML provider.

-- Add the other two courses without inventing enrollment URLs.
insert into public.site_settings(setting_key,setting_value)
values ('student_roster_888498',''),('student_roster_888499','')
on conflict (setting_key) do nothing;
drop policy if exists "Public can read published settings" on public.site_settings;
create policy "Public can read published settings" on public.site_settings
for select to anon,authenticated
using (setting_key in ('student_roster_888399','student_roster_888498','student_roster_888499'));
drop policy if exists "Only confirmed roster admins update settings" on public.site_settings;
create policy "Only confirmed roster admins update settings" on public.site_settings
for update to authenticated
using (setting_key in ('student_roster_888399','student_roster_888498','student_roster_888499') and (select public.is_roster_admin()))
with check (setting_key in ('student_roster_888399','student_roster_888498','student_roster_888499') and (select public.is_roster_admin()));

-- PRIVATE roster document uploads. Run this block in Supabase SQL Editor before use.
-- The bucket is not public: student personal data must not be exposed on GitHub Pages.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('private-student-rosters','private-student-rosters',false,10485760,
 array['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'])
on conflict (id) do update set public=false,file_size_limit=10485760,allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists "Roster documents readable by signed in users" on storage.objects;
create policy "Roster documents readable by signed in users" on storage.objects
for select to authenticated using (bucket_id='private-student-rosters');
drop policy if exists "Only roster admins upload documents" on storage.objects;
create policy "Only roster admins upload documents" on storage.objects
for insert to authenticated with check (bucket_id='private-student-rosters' and (select public.is_roster_admin()) and (storage.foldername(name))[1] in ('888399','888498','888499'));
drop policy if exists "Only roster admins replace documents" on storage.objects;
create policy "Only roster admins replace documents" on storage.objects
for update to authenticated using (bucket_id='private-student-rosters' and (select public.is_roster_admin()))
with check (bucket_id='private-student-rosters' and (select public.is_roster_admin()));

insert into public.site_settings(setting_key,setting_value)
values ('student_roster_file_888399',''),('student_roster_file_888498',''),('student_roster_file_888499','')
on conflict (setting_key) do nothing;
drop policy if exists "Read private roster file references" on public.site_settings;
create policy "Read private roster file references" on public.site_settings
for select to authenticated using (setting_key in ('student_roster_file_888399','student_roster_file_888498','student_roster_file_888499'));
drop policy if exists "Admins publish private roster file references" on public.site_settings;
create policy "Admins publish private roster file references" on public.site_settings
for insert to authenticated with check (setting_key in ('student_roster_file_888399','student_roster_file_888498','student_roster_file_888499') and (select public.is_roster_admin()));
drop policy if exists "Admins update private roster file references" on public.site_settings;
create policy "Admins update private roster file references" on public.site_settings
for update to authenticated using (setting_key in ('student_roster_file_888399','student_roster_file_888498','student_roster_file_888499') and (select public.is_roster_admin()))
with check (setting_key in ('student_roster_file_888399','student_roster_file_888498','student_roster_file_888499') and (select public.is_roster_admin()));
