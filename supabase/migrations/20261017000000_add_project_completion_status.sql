ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS is_completed boolean NOT NULL DEFAULT false;

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS project_status text NOT NULL DEFAULT 'ongoing';

ALTER TABLE public.projects
  DROP CONSTRAINT IF EXISTS projects_project_status_check;

ALTER TABLE public.projects
  ADD CONSTRAINT projects_project_status_check
  CHECK (project_status IN ('ongoing', 'completed', 'demo', 'upcoming'));

UPDATE public.projects
SET project_status = CASE
  WHEN is_completed = true THEN 'completed'
  WHEN is_completed = false THEN 'ongoing'
  ELSE 'upcoming'
END
WHERE project_status IS NULL;

CREATE INDEX IF NOT EXISTS idx_projects_project_status
ON public.projects (project_status);