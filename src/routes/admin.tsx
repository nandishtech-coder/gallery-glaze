import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { NavBar } from "@/components/nav-bar";
import { GithubIcon } from "@/components/icons/github";
import { Plus, Pencil, Trash2, ExternalLink, Loader2, X, Check, UserX, FolderKanban, Users as UsersIcon, Briefcase, MessageSquare, Star } from "lucide-react";
import { toast } from "sonner";
import { computeDiscounted } from "@/lib/price";

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
  offer_enabled: boolean;
  offer_label: string;
  offer_discount_percent: number;
  offer_ends_at: string | null;
}

interface Profile {
  id: string;
  user_id: string;
  email: string;
  approved: boolean;
  created_at: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  price_suffix: string;
  features: string[];
  popular: boolean;
  cta_label: string;
  sort_order: number;
  discount_percent: number;
}

interface Testimonial {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  role: string | null;
  rating: number;
  message: string;
  approved: boolean;
  created_at: string;
}

type Draft = Omit<Project, "id"> & { id?: string };
type ServiceDraft = Omit<Service, "id"> & { id?: string; featuresText?: string };
type TestimonialDraft = Omit<Testimonial, "id" | "created_at"> & { id?: string };

const empty: Draft = { name: "", description: "", live_url: "", github_url: "", thumbnail_url: "", offer_enabled: false, offer_label: "Offer ends soon", offer_discount_percent: 0, offer_ends_at: null };
const emptyService: ServiceDraft = {
  title: "", description: "", price: "", price_suffix: "onwards",
  features: [], popular: true, cta_label: "Get Started", sort_order: 0, discount_percent: 0, featuresText: "",
};

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [fetching, setFetching] = useState(true);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [editingService, setEditingService] = useState<ServiceDraft | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialDraft | null>(null);
  const [tab, setTab] = useState<"projects" | "services" | "clients" | "testimonials">("projects");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  const load = async () => {
    setFetching(true);
    const [proj, prof, svc, tst] = await Promise.all([
      supabase.from("projects").select("id, name, description, live_url, github_url, thumbnail_url, offer_enabled, offer_label, offer_discount_percent, offer_ends_at").order("created_at", { ascending: false }),
      supabase.from("profiles").select("id, user_id, email, approved, created_at").order("created_at", { ascending: false }),
      supabase.from("services").select("*").order("sort_order", { ascending: true }),
      supabase.from("testimonials").select("*").order("created_at", { ascending: false }),
    ]);
    if (proj.error) toast.error(proj.error.message);
    if (prof.error) toast.error(prof.error.message);
    if (svc.error) toast.error(svc.error.message);
    if (tst.error) toast.error(tst.error.message);
    setProjects((proj.data ?? []) as Project[]);
    setProfiles((prof.data ?? []) as Profile[]);
    setServices((svc.data ?? []) as Service[]);
    setTestimonials((tst.data ?? []) as Testimonial[]);
    setFetching(false);
  };

  const saveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;
    const payload = {
      name: editingTestimonial.name,
      email: editingTestimonial.email || null,
      company: editingTestimonial.company || null,
      role: editingTestimonial.role || null,
      rating: Math.max(1, Math.min(5, Number(editingTestimonial.rating) || 5)),
      message: editingTestimonial.message,
      approved: !!editingTestimonial.approved,
    };
    if (!editingTestimonial.id) return;
    const { error } = await supabase.from("testimonials").update(payload).eq("id", editingTestimonial.id);
    if (error) return toast.error(error.message);
    toast.success("Testimonial updated");
    setEditingTestimonial(null);
    load();
  };

  const toggleTestimonialApproval = async (t: Testimonial) => {
    const { error } = await supabase.from("testimonials").update({ approved: !t.approved }).eq("id", t.id);
    if (error) return toast.error(error.message);
    toast.success(!t.approved ? "Approved & published" : "Unpublished");
    load();
  };

  const removeTestimonial = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };


  const saveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    const features = (editingService.featuresText ?? "")
      .split("\n").map((s) => s.trim()).filter(Boolean);
    const payload = {
      title: editingService.title,
      description: editingService.description,
      price: editingService.price,
      price_suffix: editingService.price_suffix || "onwards",
      features,
      popular: !!editingService.popular,
      cta_label: editingService.cta_label || "Get Started",
      sort_order: Number(editingService.sort_order) || 0,
      discount_percent: Math.max(0, Math.min(100, Number(editingService.discount_percent) || 0)),
    };
    const res = editingService.id
      ? await supabase.from("services").update(payload).eq("id", editingService.id)
      : await supabase.from("services").insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success(editingService.id ? "Service updated" : "Service added");
    setEditingService(null);
    load();
  };

  const removeService = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
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
      offer_enabled: !!editing.offer_enabled,
      offer_label: editing.offer_label || "Offer ends soon",
      offer_discount_percent: Math.max(0, Math.min(100, Number(editing.offer_discount_percent) || 0)),
      offer_ends_at: editing.offer_ends_at ? new Date(editing.offer_ends_at).toISOString() : null,
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
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage projects and approve client signups.</p>
        </div>

        {/* Tab menu */}
        <div className="mb-6 flex items-center gap-1 rounded-xl border border-border/60 bg-secondary/30 p-1 w-fit">
          <button
            onClick={() => setTab("projects")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === "projects" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FolderKanban className="h-4 w-4" /> Projects
          </button>
          <button
            onClick={() => setTab("services")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === "services" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Briefcase className="h-4 w-4" /> Services I Offer
          </button>
          <button
            onClick={() => setTab("clients")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === "clients" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UsersIcon className="h-4 w-4" /> Clients
            {profiles.filter((p) => !p.approved).length > 0 && (
              <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                {profiles.filter((p) => !p.approved).length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("testimonials")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === "testimonials" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageSquare className="h-4 w-4" /> Testimonials
            {testimonials.filter((t) => !t.approved).length > 0 && (
              <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                {testimonials.filter((t) => !t.approved).length}
              </span>
            )}
          </button>
        </div>


        {tab === "projects" && (
          <>
            <div className="mb-4 flex items-end justify-between gap-4">
              <p className="text-sm text-muted-foreground">All portfolio projects.</p>
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
          </>
        )}

        {tab === "services" && (
          <>
            <div className="mb-4 flex items-end justify-between gap-4">
              <p className="text-sm text-muted-foreground">Manage the "Services I Offer" section shown on the public site.</p>
              <button
                onClick={() => setEditingService({ ...emptyService })}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground btn-glow transition hover:opacity-90"
              >
                <Plus className="h-4 w-4" /> New service
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl glass">
              {fetching ? (
                <div className="p-12 text-center text-muted-foreground"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></div>
              ) : services.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">No services yet.</div>
              ) : (
                <ul className="divide-y divide-border/40">
                  {services.map((s) => (
                    <li key={s.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{s.title}</span>
                          {s.popular && <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">Popular</span>}
                          <span className="text-xs text-muted-foreground">#{s.sort_order}</span>
                        </div>
                        <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{s.description}</div>
                        <div className="mt-1 text-xs">
                          {(() => {
                            const d = computeDiscounted(s.price, s.discount_percent);
                            return (
                              <>
                                <span className="text-gradient font-semibold">{d ?? s.price}</span>{" "}
                                {d && <span className="line-through text-muted-foreground">{s.price}</span>}{" "}
                                <span className="text-muted-foreground">{s.price_suffix}</span>
                                {s.discount_percent > 0 && (
                                  <span className="ml-2 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
                                    {s.discount_percent}% OFF
                                  </span>
                                )}
                                <span className="text-muted-foreground"> · {s.features.length} features</span>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                      <div className="flex gap-2 sm:justify-end">
                        <button onClick={() => setEditingService({ ...s, featuresText: s.features.join("\n") })} className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => removeService(s.id)} className="rounded-md p-2 text-muted-foreground hover:bg-destructive/20 hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}


        {tab === "clients" && (
          <>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Approve or reject people who signed up. Only approved clients can sign in.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl glass">
              {fetching ? (
                <div className="p-12 text-center text-muted-foreground">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </div>
              ) : profiles.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">No client signups yet.</div>
              ) : (
                <ul className="divide-y divide-border/40">
                  {profiles.map((p) => {
                    const isOwner = p.email.toLowerCase() === "contactnandishtech@gmail.com";
                    return (
                      <li key={p.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5">
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium">{p.email}</div>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            {p.approved ? (
                              <span className="inline-flex items-center gap-1 rounded-md bg-primary/15 px-2 py-0.5 text-primary">
                                <Check className="h-3 w-3" /> Approved
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-2 py-0.5 text-amber-500">
                                Pending
                              </span>
                            )}
                            {isOwner && (
                              <span className="text-[10px] uppercase tracking-wider text-primary">Owner</span>
                            )}
                            <span>· {new Date(p.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        {isOwner ? (
                          <span className="text-xs text-muted-foreground">—</span>
                        ) : (
                          <div className="flex flex-wrap gap-2 sm:justify-end">
                            {!p.approved ? (
                              <button
                                onClick={() => setApproval(p, true)}
                                className="inline-flex items-center gap-1 rounded-md bg-primary/15 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/25"
                              >
                                <Check className="h-3.5 w-3.5" /> Approve
                              </button>
                            ) : (
                              <button
                                onClick={() => setApproval(p, false)}
                                className="inline-flex items-center gap-1 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-secondary/70 hover:text-foreground"
                              >
                                <UserX className="h-3.5 w-3.5" /> Revoke
                              </button>
                            )}
                            <button
                              onClick={() => removeUser(p)}
                              className="inline-flex items-center gap-1 rounded-md bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive transition hover:bg-destructive/20"
                            >
                              <X className="h-3.5 w-3.5" /> Reject
                            </button>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </>
        )}
      </main>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm overflow-y-auto">
          <form onSubmit={save} className="w-full max-w-lg rounded-2xl glass-strong p-6 my-8">
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

            <div className="mt-6 rounded-xl border border-border/60 bg-secondary/20 p-4">
              <label className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium">Enable limited-time offer</span>
                <input
                  type="checkbox"
                  className="h-5 w-9 cursor-pointer appearance-none rounded-full bg-secondary outline-none transition checked:bg-primary relative after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-background after:transition checked:after:translate-x-4"
                  checked={!!editing.offer_enabled}
                  onChange={(e) => setEditing({ ...editing, offer_enabled: e.target.checked })}
                />
              </label>
              {editing.offer_enabled && (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Offer label</label>
                    <input
                      type="text"
                      value={editing.offer_label ?? ""}
                      placeholder="Offer ends soon"
                      onChange={(e) => setEditing({ ...editing, offer_label: e.target.value })}
                      className="w-full rounded-lg border border-border bg-input/50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Discount %</label>
                      <input
                        type="number" min={0} max={100}
                        value={editing.offer_discount_percent ?? 0}
                        onChange={(e) => setEditing({ ...editing, offer_discount_percent: Number(e.target.value) })}
                        className="w-full rounded-lg border border-border bg-input/50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Ends at</label>
                      <input
                        type="datetime-local"
                        value={editing.offer_ends_at ? new Date(editing.offer_ends_at).toISOString().slice(0, 16) : ""}
                        onChange={(e) => setEditing({ ...editing, offer_ends_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
                        className="w-full rounded-lg border border-border bg-input/50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-secondary">Cancel</button>
              <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground btn-glow hover:opacity-90">Save</button>
            </div>
          </form>
        </div>
      )}

      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm overflow-y-auto">
          <form onSubmit={saveService} className="w-full max-w-lg rounded-2xl glass-strong p-6 my-8">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{editingService.id ? "Edit service" : "New service"}</h2>
              <button type="button" onClick={() => setEditingService(null)} className="rounded-md p-1 text-muted-foreground hover:bg-secondary">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Title</label>
                <input required value={editingService.title} onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full rounded-lg border border-border bg-input/50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Description</label>
                <textarea rows={2} value={editingService.description} onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full rounded-lg border border-border bg-input/50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Price (e.g. ₹499)</label>
                  <input value={editingService.price} onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                    className="w-full rounded-lg border border-border bg-input/50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Price suffix</label>
                  <input value={editingService.price_suffix} onChange={(e) => setEditingService({ ...editingService, price_suffix: e.target.value })}
                    className="w-full rounded-lg border border-border bg-input/50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Features (one per line)</label>
                <textarea rows={6} value={editingService.featuresText ?? ""} onChange={(e) => setEditingService({ ...editingService, featuresText: e.target.value })}
                  placeholder={"Deploy website on hosting\nSSL setup (HTTPS)\nLive URL delivery"}
                  className="w-full rounded-lg border border-border bg-input/50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">CTA label</label>
                  <input value={editingService.cta_label} onChange={(e) => setEditingService({ ...editingService, cta_label: e.target.value })}
                    className="w-full rounded-lg border border-border bg-input/50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Sort order</label>
                  <input type="number" value={editingService.sort_order} onChange={(e) => setEditingService({ ...editingService, sort_order: Number(e.target.value) })}
                    className="w-full rounded-lg border border-border bg-input/50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Discount % (0–100, applied automatically to the price)</label>
                <input type="number" min={0} max={100} value={editingService.discount_percent}
                  onChange={(e) => setEditingService({ ...editingService, discount_percent: Number(e.target.value) })}
                  className="w-full rounded-lg border border-border bg-input/50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" />
                {editingService.price && editingService.discount_percent > 0 && (
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Preview: <span className="text-gradient font-semibold">{computeDiscounted(editingService.price, editingService.discount_percent) ?? editingService.price}</span>{" "}
                    <span className="line-through">{editingService.price}</span> ({editingService.discount_percent}% off)
                  </p>
                )}
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editingService.popular} onChange={(e) => setEditingService({ ...editingService, popular: e.target.checked })} />
                Show "Popular" badge
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setEditingService(null)} className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-secondary">Cancel</button>
              <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground btn-glow hover:opacity-90">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
