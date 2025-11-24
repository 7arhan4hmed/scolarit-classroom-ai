-- Create app_role enum for role management
create type public.app_role as enum ('admin', 'teacher', 'student');

-- Create profiles table for user information
create table public.profiles (
  id uuid not null references auth.users(id) on delete cascade primary key,
  full_name text not null,
  user_type text not null check (user_type in ('teacher', 'student')),
  avatar_url text,
  bio text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Create user_roles table for role-based access control
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamp with time zone not null default now(),
  unique (user_id, role)
);

-- Enable RLS on user_roles
alter table public.user_roles enable row level security;

-- Create security definer function to check user roles
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_role app_role;
begin
  -- Extract user_type from metadata and map to role
  if new.raw_user_meta_data->>'user_type' = 'teacher' then
    user_role := 'teacher';
  else
    user_role := 'student';
  end if;

  -- Insert profile
  insert into public.profiles (id, full_name, user_type)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'user_type'
  );

  -- Insert user role
  insert into public.user_roles (user_id, role)
  values (new.id, user_role);

  return new;
end;
$$;

-- Create trigger to automatically create profile and role on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS Policies for profiles table
-- Users can view all profiles
create policy "Profiles are viewable by everyone"
  on public.profiles
  for select
  to authenticated
  using (true);

-- Users can update their own profile
create policy "Users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Users can insert their own profile (backup for trigger failure)
create policy "Users can insert their own profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

-- RLS Policies for user_roles table
-- Users can view their own roles
create policy "Users can view their own roles"
  on public.user_roles
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Admins can view all roles
create policy "Admins can view all roles"
  on public.user_roles
  for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Only admins can insert/update/delete roles
create policy "Admins can manage roles"
  on public.user_roles
  for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Create function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Add trigger to update updated_at on profiles
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.update_updated_at_column();