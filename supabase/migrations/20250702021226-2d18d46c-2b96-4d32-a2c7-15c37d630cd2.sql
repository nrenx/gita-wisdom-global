-- Add manual count columns to languages table for tracking translation progress
ALTER TABLE public.languages 
ADD COLUMN manual_verse_count integer DEFAULT 0,
ADD COLUMN manual_chapter_count integer DEFAULT 0;