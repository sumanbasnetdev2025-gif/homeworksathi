

-- ─── PROFILES ───
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  name text,
  plan text not null default 'free' check (plan in ('free', 'premium')),
  daily_usage integer not null default 0,
  last_usage_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ─── QUESTIONS ───
create table public.questions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  question_text text not null,
  subject text not null,
  image_url text,
  language text not null default 'en' check (language in ('en', 'ne')),
  created_at timestamptz not null default now()
);

alter table public.questions enable row level security;

create policy "Users can view own questions"
  on public.questions for select
  using (auth.uid() = user_id);

create policy "Users can insert own questions"
  on public.questions for insert
  with check (auth.uid() = user_id);

-- ─── SOLUTIONS ───
create table public.solutions (
  id uuid default gen_random_uuid() primary key,
  question_id uuid references public.questions(id) on delete cascade not null,
  steps jsonb not null default '[]',
  final_answer text not null,
  created_at timestamptz not null default now()
);

alter table public.solutions enable row level security;

create policy "Users can view own solutions"
  on public.solutions for select
  using (
    auth.uid() = (
      select user_id from public.questions where id = question_id
    )
  );

create policy "Users can insert solutions"
  on public.solutions for insert
  with check (
    auth.uid() = (
      select user_id from public.questions where id = question_id
    )
  );

-- ─── FOLLOW UPS ───
create table public.followups (
  id uuid default gen_random_uuid() primary key,
  question_id uuid references public.questions(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  followup_text text not null,
  response text not null,
  created_at timestamptz not null default now()
);

alter table public.followups enable row level security;

create policy "Users can view own followups"
  on public.followups for select
  using (auth.uid() = user_id);

create policy "Users can insert own followups"
  on public.followups for insert
  with check (auth.uid() = user_id);

-- ─── PRACTICE ───
create table public.practice_questions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  subject text not null,
  question_text text not null,
  answer text not null,
  difficulty text not null default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  created_at timestamptz not null default now()
);

alter table public.practice_questions enable row level security;

create policy "Users can view own practice"
  on public.practice_questions for select
  using (auth.uid() = user_id);

-- ─── AUTO CREATE PROFILE ON SIGNUP ───
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── AUTO RESET DAILY USAGE ───
create or replace function public.reset_daily_usage()
returns void as $$
begin
  update public.profiles
  set daily_usage = 0, last_usage_date = current_date
  where last_usage_date < current_date or last_usage_date is null;
end;
$$ language plpgsql security definer;