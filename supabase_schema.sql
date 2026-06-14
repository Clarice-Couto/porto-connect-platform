-- SQL Schema for Porto Connect Platform
-- Copy and paste this into the Supabase SQL Editor to create all necessary tables.

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Students Table
CREATE TABLE IF NOT EXISTS public.students (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    cidade TEXT,
    sobre TEXT,
    skills TEXT,
    role TEXT DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for students
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to students" ON public.students
    FOR SELECT USING (true);

CREATE POLICY "Allow users to update their own student profile" ON public.students
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own student profile" ON public.students
    FOR INSERT WITH CHECK (auth.uid() = user_id);


-- 2. Companies Table
CREATE TABLE IF NOT EXISTS public.companies (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    cidade TEXT,
    sobre TEXT,
    skills TEXT,
    role TEXT DEFAULT 'company',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for companies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to companies" ON public.companies
    FOR SELECT USING (true);

CREATE POLICY "Allow users to update their own company profile" ON public.companies
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own company profile" ON public.companies
    FOR INSERT WITH CHECK (auth.uid() = user_id);


-- 3. Vacancies Table (Vagas)
CREATE TABLE IF NOT EXISTS public.vacancies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_email TEXT NOT NULL,
    company_name TEXT NOT NULL,
    company_id UUID REFERENCES public.companies(user_id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    tipo TEXT,
    modelo TEXT,
    descricao TEXT,
    categoria TEXT,
    status TEXT DEFAULT 'Ativa',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for vacancies
ALTER TABLE public.vacancies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to vacancies" ON public.vacancies
    FOR SELECT USING (true);

CREATE POLICY "Allow companies to manage their own vacancies" ON public.vacancies
    FOR ALL USING (auth.uid() = company_id);


-- 4. Favorites Table
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_email TEXT NOT NULL,
    vacancy_title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    company_email TEXT,
    categoria TEXT,
    tipo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to see their own favorites" ON public.favorites
    FOR SELECT USING (true); -- Or check by email: student_email = auth.jwt() ->> 'email'

CREATE POLICY "Allow users to manage their favorites" ON public.favorites
    FOR ALL USING (true);


-- 5. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_email TEXT NOT NULL,
    titulo TEXT NOT NULL,
    descricao TEXT,
    tags TEXT,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to projects" ON public.projects
    FOR SELECT USING (true);

CREATE POLICY "Allow students to manage their own projects" ON public.projects
    FOR ALL USING (true); -- Authenticated users can modify theirs, logic handled by frontend filters


-- 6. Applications Table (Candidaturas)
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_email TEXT NOT NULL,
    company_email TEXT NOT NULL,
    company_name TEXT NOT NULL,
    vacancy_title TEXT NOT NULL,
    status TEXT DEFAULT 'Pendente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    extra_message TEXT
);

-- Enable RLS for applications
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to applications" ON public.applications
    FOR SELECT USING (true);

CREATE POLICY "Allow insert/update access to applications" ON public.applications
    FOR ALL USING (true);
