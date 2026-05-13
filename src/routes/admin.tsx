import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { NavBar } from "@/components/nav-bar";
import { GithubIcon } from "@/components/icons/github";
import { Plus, Pencil, Trash2, ExternalLink, Loader2, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

interface Project {
  id: string;
  name: string;
  description: string;
  live_url: string | null;
  github_url: string | null;
  thumbnail_url: string | null;
}

interface Profile {
  id: string;
  user_id: string;
  email: string;
  approved: boolean;
  created_at: string;
}

type Draft = Omit<Project, "id"> & { id?: string };

const empty: Draft = { name: "", description: "", live_url: "", github_url: "", thumbnail_url: "" };

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [fetching, setFetching] = useState(true);
  const [editing, setEditing] = useState<Draft | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  const load = async () => {
    setFetching(true);
    const [proj, prof] = await Promise.all([
      supabase.from("projects").select("id, name, description, live_url, github_url, thumbnail_url").order("created_at", { ascending: false }),
      supabase.from("profiles").select("id, user_id, email, approved, created_at").order("created_at", { ascending: false }),
    ]);
    if (proj.error) toast.error(proj.error.message);
    if (prof.error) toast.error(prof.error.message);
    setProjects((proj.data ?? []) as Project[]);
    setProfiles((prof.data ?? []) as Profile[]);
    setFetching(false);
  };

  useEffect(() => { if (user && isAdmin) load(); }, [user, isAdmin]);

  const setApproval = async (p: Profile, approved: boolean) => {
    const { error } = await supabase
      .from("profiles")
      .update({ approved, approved_at: approved ? new Date().toISOString() : null, approved_by: approved ? user!.id : null })
      .eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success(approved ? `Approved ${p.email}` : `Revoked ${p.email}`);
    load();
  };

  const removeUser = async (p: Profile) => {
    if (!confirm(`Delete profile for ${p.email}? (auth account will remain)`)) return;
    const { error } = await supabase.from("profiles").delete().eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success("Profile removed");
    load();
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const payload = {
      name: editing.name,
      description: editing.description,
      live_url: editing.live_url || null,
      github_url: editing.github_url || null,
      thumbnail_url: editing.thumbnail_url || null,
    };
    const res = editing.id
      ? await supabase.from("projects").update(payload).eq("id", editing.id)
      : await supabase.from("projects").insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success(editing.id ? "Project updated" : "Project added");
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <div className="mx-auto mt-20 max-w-md rounded-2xl glass p-8 text-center">
          <h2 className="text-lg font-semibold">Not authorized</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account doesn't have admin access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage your portfolio projects.</p>
          </div>
          <button
            onClick={() => setEditing({ ...empty })}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground btn-glow transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> New project
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl glass">
          {fetching ? (
            <div className="p-12 text-center text-muted-foreground">
              <Loader2 className="mx-auto h-5 w-5 animate-spin" />
            </div>
          ) : projects.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">No projects yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Project</th>
                  <th className="px-5 py-3">Links</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id} className="border-b border-border/30 last:border-0 hover:bg-secondary/30">
                    <td className="px-5 py-4">
                      <div className="font-medium">{p.name}</div>
                      <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{p.description}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        {p.live_url && (
                          <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs hover:bg-secondary/70">
                            <ExternalLink className="h-3 w-3" /> Live
                          </a>
                        )}
                        {p.github_url && (
                          <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs hover:bg-secondary/70">
                            <GithubIcon className="h-3 w-3" /> GitHub
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditing({ ...p })} className="rounded-md p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => remove(p.id)} className="rounded-md p-2 text-muted-foreground transition hover:bg-destructive/20 hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm">
          <form onSubmit={save} className="w-full max-w-lg rounded-2xl glass-strong p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{editing.id ? "Edit project" : "New project"}</h2>
              <button type="button" onClick={() => setEditing(null)} className="rounded-md p-1 text-muted-foreground hover:bg-secondary">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { k: "name", label: "Name", required: true },
                { k: "description", label: "Description", textarea: true },
                { k: "live_url", label: "Live URL" },
                { k: "github_url", label: "GitHub URL" },
                { k: "thumbnail_url", label: "Thumbnail URL" },
              ].map((f) => (
                <div key={f.k}>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{f.label}</label>
                  {f.textarea ? (
                    <textarea
                      rows={3} required={f.required}
                      value={(editing as any)[f.k] ?? ""}
                      onChange={(e) => setEditing({ ...editing, [f.k]: e.target.value } as Draft)}
                      className="w-full rounded-lg border border-border bg-input/50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                    />
                  ) : (
                    <input
                      type="text" required={f.required}
                      value={(editing as any)[f.k] ?? ""}
                      onChange={(e) => setEditing({ ...editing, [f.k]: e.target.value } as Draft)}
                      className="w-full rounded-lg border border-border bg-input/50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-secondary">Cancel</button>
              <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground btn-glow hover:opacity-90">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
