-- Add missing fields to chapters table for full metadata editing
ALTER TABLE public.chapters 
ADD COLUMN sanskrit_title text,
ADD COLUMN english_title text,
ADD COLUMN total_verses integer DEFAULT 0,
ADD COLUMN summary text;

-- Add missing fields to verses table for comprehensive verse management
ALTER TABLE public.verses 
ADD COLUMN sanskrit_text text,
ADD COLUMN transliteration text,
ADD COLUMN english_translation text,
ADD COLUMN commentary text;