
-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('admin', 'editor', 'viewer');

-- Create enum for verse status
CREATE TYPE verse_status AS ENUM ('pending', 'uploaded', 'processing', 'published');

-- Create enum for visibility
CREATE TYPE visibility_status AS ENUM ('published', 'hidden', 'draft');

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role user_role DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create languages table
CREATE TABLE public.languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE, -- e.g., 'en', 'hi', 'te'
  native_name TEXT, -- e.g., 'English', 'हिंदी', 'తెలుగు'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chapters table
CREATE TABLE public.chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_number INTEGER NOT NULL UNIQUE CHECK (chapter_number BETWEEN 1 AND 18),
  title TEXT NOT NULL,
  description TEXT,
  visibility visibility_status DEFAULT 'published',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create verses table
CREATE TABLE public.verses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  language_id UUID NOT NULL REFERENCES public.languages(id) ON DELETE CASCADE,
  verse_number INTEGER NOT NULL,
  youtube_url TEXT,
  video_file_path TEXT,
  title TEXT,
  description TEXT,
  keywords TEXT[],
  status verse_status DEFAULT 'pending',
  visibility visibility_status DEFAULT 'draft',
  is_daily_verse BOOLEAN DEFAULT false,
  whatsapp_share_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(chapter_id, language_id, verse_number)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verses ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if user is admin or editor
CREATE OR REPLACE FUNCTION public.can_edit(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND role IN ('admin', 'editor')
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all profiles" 
  ON public.profiles FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for languages (public read, admin/editor write)
CREATE POLICY "Anyone can view published languages" 
  ON public.languages FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Editors can manage languages" 
  ON public.languages FOR ALL 
  USING (public.can_edit(auth.uid()));

-- RLS Policies for chapters (public read, admin/editor write)
CREATE POLICY "Anyone can view published chapters" 
  ON public.chapters FOR SELECT 
  USING (visibility = 'published');

CREATE POLICY "Editors can view all chapters" 
  ON public.chapters FOR SELECT 
  USING (public.can_edit(auth.uid()));

CREATE POLICY "Editors can manage chapters" 
  ON public.chapters FOR INSERT 
  WITH CHECK (public.can_edit(auth.uid()));

CREATE POLICY "Editors can update chapters" 
  ON public.chapters FOR UPDATE 
  USING (public.can_edit(auth.uid()));

CREATE POLICY "Admins can delete chapters" 
  ON public.chapters FOR DELETE 
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for verses (public read published, admin/editor write)
CREATE POLICY "Anyone can view published verses" 
  ON public.verses FOR SELECT 
  USING (visibility = 'published' AND status = 'published');

CREATE POLICY "Editors can view all verses" 
  ON public.verses FOR SELECT 
  USING (public.can_edit(auth.uid()));

CREATE POLICY "Editors can manage verses" 
  ON public.verses FOR INSERT 
  WITH CHECK (public.can_edit(auth.uid()));

CREATE POLICY "Editors can update verses" 
  ON public.verses FOR UPDATE 
  USING (public.can_edit(auth.uid()));

CREATE POLICY "Admins can delete verses" 
  ON public.verses FOR DELETE 
  USING (public.has_role(auth.uid(), 'admin'));

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    'viewer'::user_role
  );
  RETURN new;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default chapters
INSERT INTO public.chapters (chapter_number, title, description) VALUES
(1, 'Arjuna Vishada Yoga', 'The Distress of Arjuna'),
(2, 'Sankhya Yoga', 'Transcendental Knowledge'),
(3, 'Karma Yoga', 'Path of Action'),
(4, 'Jnana Karma Sanyasa Yoga', 'Transcendental Knowledge and Action'),
(5, 'Karma Sanyasa Yoga', 'Path of Renunciation'),
(6, 'Atma Samyama Yoga', 'Path of Meditation'),
(7, 'Paramahamsa Vijnana Yoga', 'Knowledge of the Absolute'),
(8, 'Akshara Brahma Yoga', 'Path to the Supreme'),
(9, 'Raja Vidya Yoga', 'Knowledge of the Royal Secret'),
(10, 'Vibhuti Vistara Yoga', 'Divine Glories'),
(11, 'Vishvarupa Darshana Yoga', 'The Universal Form'),
(12, 'Bhakti Yoga', 'Path of Devotion'),
(13, 'Ksetra Ksetrajna Vibhaga Yoga', 'Nature, the Enjoyer, and Consciousness'),
(14, 'Gunatraya Vibhaga Yoga', 'The Three Modes of Material Nature'),
(15, 'Purushottama Yoga', 'The Path to the Supreme Person'),
(16, 'Daivasura Sampad Vibhaga Yoga', 'The Divine and Demoniac Natures'),
(17, 'Shraddhatraya Vibhaga Yoga', 'The Divisions of Faith'),
(18, 'Moksha Sanyasa Yoga', 'Liberation through Renunciation');

-- Insert common languages
INSERT INTO public.languages (name, code, native_name) VALUES
('English', 'en', 'English'),
('Hindi', 'hi', 'हिंदी'),
('Telugu', 'te', 'తెలుగు'),
('Tamil', 'ta', 'தமிழ்'),
('Kannada', 'kn', 'ಕನ್ನಡ'),
('Malayalam', 'ml', 'മലയാളം'),
('Bengali', 'bn', 'বাংলা'),
('Gujarati', 'gu', 'ગુજરાતી'),
('Marathi', 'mr', 'मराठी'),
('Punjabi', 'pa', 'ਪੰਜਾਬੀ'),
('Odia', 'or', 'ଓଡ଼ିଆ'),
('Assamese', 'as', 'অসমীয়া'),
('Sanskrit', 'sa', 'संस्कृत');
