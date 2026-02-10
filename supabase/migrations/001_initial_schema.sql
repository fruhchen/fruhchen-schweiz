-- Frühchen Schweiz — Initial Database Schema
-- Run with: supabase db push

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- ==========================================
-- USER PROFILES
-- ==========================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null,
  role text not null default 'parent' check (role in ('parent', 'peer', 'fachperson', 'admin', 'donor')),
  avatar_url text,
  region text,
  language text not null default 'de',
  baby_name text,
  baby_birth_date date,
  gestational_weeks integer check (gestational_weeks between 20 and 42),
  hospital text,
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Admins can view all profiles" on public.profiles
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ==========================================
-- GLOSSARY
-- ==========================================
create table public.glossary_terms (
  id uuid primary key default uuid_generate_v4(),
  term text not null,
  definition text not null,
  simple_definition text,
  category text not null,
  related_terms text[] default '{}',
  audio_url text,
  language text not null default 'de',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.glossary_terms enable row level security;
create policy "Glossary is publicly readable" on public.glossary_terms
  for select using (true);

-- ==========================================
-- JOURNAL ENTRIES
-- ==========================================
create table public.journal_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text,
  content text not null,
  mood integer not null check (mood between 1 and 5),
  photos text[] default '{}',
  milestone_type text,
  milestone_label text,
  is_private boolean not null default true,
  shared_with uuid[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.journal_entries enable row level security;
create policy "Users can CRUD own journal entries" on public.journal_entries
  for all using (auth.uid() = user_id);

-- ==========================================
-- EVENTS
-- ==========================================
create table public.events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  date timestamptz not null,
  end_date timestamptz,
  location text,
  region text,
  type text not null check (type in ('workshop', 'webinar', 'meetup', 'conference', 'other')),
  image_url text,
  registration_url text,
  max_participants integer,
  current_participants integer not null default 0,
  is_online boolean not null default false,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;
create policy "Events are publicly readable" on public.events
  for select using (true);
create policy "Admins can manage events" on public.events
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create table public.event_registrations (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  registered_at timestamptz not null default now(),
  unique (event_id, user_id)
);

alter table public.event_registrations enable row level security;
create policy "Users can manage own registrations" on public.event_registrations
  for all using (auth.uid() = user_id);

-- ==========================================
-- GRANTS CRM
-- ==========================================
create table public.grants (
  id uuid primary key default uuid_generate_v4(),
  foundation_name text not null,
  contact_person text,
  contact_email text,
  stage text not null default 'research' check (stage in ('research', 'contacted', 'submitted', 'approved', 'rejected')),
  amount_requested numeric(12,2),
  amount_approved numeric(12,2),
  deadline date,
  submission_window_start date,
  submission_window_end date,
  next_action text,
  next_action_date date,
  notes text,
  last_contact_date date,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.grants enable row level security;
create policy "Admins can manage grants" on public.grants
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create table public.grant_history (
  id uuid primary key default uuid_generate_v4(),
  grant_id uuid references public.grants(id) on delete cascade not null,
  action text not null,
  details text,
  performed_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ==========================================
-- DONATIONS
-- ==========================================
create table public.donations (
  id uuid primary key default uuid_generate_v4(),
  donor_name text,
  donor_email text,
  amount numeric(12,2) not null,
  currency text not null default 'CHF',
  method text not null check (method in ('twint', 'bank', 'online', 'other')),
  is_recurring boolean not null default false,
  receipt_sent boolean not null default false,
  date date not null,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.donations enable row level security;
create policy "Admins can manage donations" on public.donations
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ==========================================
-- PEER SUPPORT CHATS
-- ==========================================
create table public.peer_chats (
  id uuid primary key default uuid_generate_v4(),
  parent_id uuid references public.profiles(id) on delete cascade not null,
  peer_id uuid references public.profiles(id),
  topic text,
  status text not null default 'active' check (status in ('active', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.peer_messages (
  id uuid primary key default uuid_generate_v4(),
  chat_id uuid references public.peer_chats(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.peer_chats enable row level security;
alter table public.peer_messages enable row level security;

create policy "Chat participants can view chats" on public.peer_chats
  for select using (auth.uid() = parent_id or auth.uid() = peer_id);
create policy "Chat participants can view messages" on public.peer_messages
  for select using (
    exists (select 1 from public.peer_chats where id = chat_id and (parent_id = auth.uid() or peer_id = auth.uid()))
  );

-- ==========================================
-- NEWSLETTER
-- ==========================================
create table public.newsletter_items (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  stage text not null default 'idea' check (stage in ('idea', 'draft', 'review', 'scheduled', 'sent')),
  content text,
  scheduled_date timestamptz,
  sent_date timestamptz,
  author_id uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ==========================================
-- TIME TRACKING
-- ==========================================
create table public.time_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  project text,
  task text,
  duration_minutes integer not null,
  date date not null,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.time_entries enable row level security;
create policy "Users can manage own time entries" on public.time_entries
  for all using (auth.uid() = user_id);
create policy "Admins can view all time entries" on public.time_entries
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ==========================================
-- VOLUNTEERS
-- ==========================================
create table public.volunteers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  full_name text not null,
  region text not null,
  volunteer_role text not null default 'peer' check (volunteer_role in ('peer', 'senior_peer', 'trainer')),
  training_completed boolean not null default false,
  training_modules jsonb default '[]',
  refresher_due date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ==========================================
-- INDEXES
-- ==========================================
create index idx_journal_user on public.journal_entries(user_id, created_at desc);
create index idx_events_date on public.events(date);
create index idx_events_region on public.events(region);
create index idx_grants_stage on public.grants(stage);
create index idx_donations_date on public.donations(date);
create index idx_glossary_category on public.glossary_terms(category);
create index idx_glossary_term on public.glossary_terms(term);
create index idx_peer_messages_chat on public.peer_messages(chat_id, created_at);
create index idx_time_entries_user on public.time_entries(user_id, date);

-- ==========================================
-- FUNCTIONS
-- ==========================================

-- Auto-update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();
create trigger journal_entries_updated_at before update on public.journal_entries
  for each row execute function public.handle_updated_at();
create trigger grants_updated_at before update on public.grants
  for each row execute function public.handle_updated_at();
create trigger peer_chats_updated_at before update on public.peer_chats
  for each row execute function public.handle_updated_at();
create trigger newsletter_items_updated_at before update on public.newsletter_items
  for each row execute function public.handle_updated_at();
create trigger volunteers_updated_at before update on public.volunteers
  for each row execute function public.handle_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();
