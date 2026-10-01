import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { NavBar } from "@/components/nav-bar";
import { GithubIcon } from "@/components/icons/github";
import { Plus, Pencil, Trash2, ExternalLink, Loader2, X, Check, UserX, FolderKanban, Users as UsersIcon, Briefcase, MessageSquare, Star, BarChart3, Inbox, Mail } from "lucide-react";
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
  project_type: string;
  live_enabled: boolean;
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

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

interface SiteStats {
  id: string;
  heading: string;
  subheading: string;
  projects_count: string;
  projects_label: string;
  success_rate: string;
  success_label: string;
  hero_stat1_value: string;
  hero_stat1_label: string;
  hero_stat2_value: string;
  hero_stat2_label: string;
  hero_stat3_value: string;
  hero_stat3_label: string;
  hero_stat4_value: string;
  hero_stat4_label: string;
}

type Draft = Omit<Project, "id"> & { id?: string };

type ServiceDraft = Omit<Service, "id"> & { id?: string; featuresText?: string };
type TestimonialDraft = Omit<Testimonial, "id" | "created_at"> & { id?: string };

const empty: Draft = { name: "", description: "", live_url: "", github_url: "", thumbnail_url: "", offer_enabled: false, offer_label: "Offer ends soon", offer_discount_percent: 0, offer_ends_at: null, project_type: "Web Application", live_enabled: true };
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
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [fetching, setFetching] = useState(true);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [editingService, setEditingService] = useState<ServiceDraft | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialDraft | null>(null);
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [savingStats, setSavingStats] = useState(false);
  const [tab, setTab] = useState<"projects" | "services" | "clients" | "testimonials" | "enquiries" | "stats">("projects");


  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  const load = async () => {
    setFetching(true);
    const [proj, prof, svc, tst, st, msg] = await Promise.all([
      supabase.from("projects").select("id, name, description, live_url, github_url, thumbnail_url, offer_enabled, offer_label, offer_discount_percent, offer_ends_at, project_type, live_enabled").order("created_at", { ascending: false }),
      supabase.from("profiles").select("id, user_id, email, approved, created_at").order("created_at", { ascending: false }),
      supabase.from("services").select("*").order("sort_order", { ascending: true }),
      supabase.from("testimonials").select("*").order("created_at", { ascending: false }),
      supabase.from("site_stats").select("*").limit(1).maybeSingle(),
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
    ]);
    if (proj.error) toast.error(proj.error.message);
    if (prof.error) toast.error(prof.error.message);
    if (svc.error) toast.error(svc.error.message);
    if (tst.error) toast.error(tst.error.message);
    if (msg.error) toast.error(msg.error.message);
    setProjects((proj.data ?? []) as Project[]);
    setProfiles((prof.data ?? []) as Profile[]);
    setServices((svc.data ?? []) as Service[]);
    setTestimonials((tst.data ?? []) as Testimonial[]);
    setMessages((msg.data ?? []) as ContactMessage[]);
    setStats((st.data as SiteStats) ?? null);
    setFetching(false);

  };

  const saveStats = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stats) return;
    setSavingStats(true);
    const { error } = await supabase
      .from("site_stats")
      .update({
        heading: stats.heading,
        subheading: stats.subheading,
        projects_count: stats.projects_count,
        projects_label: stats.projects_label,
        success_rate: stats.success_rate,
        success_label: stats.success_label,
        hero_stat1_value: stats.hero_stat1_value,
        hero_stat1_label: stats.hero_stat1_label,
        hero_stat2_value: stats.hero_stat2_value,
        hero_stat2_label: stats.hero_stat2_label,
        hero_stat3_value: stats.hero_stat3_value,
        hero_stat3_label: stats.hero_stat3_label,
        hero_stat4_value: stats.hero_stat4_value,
        hero_stat4_label: stats.hero_stat4_label,
      })
      .eq("id", stats.id);
    setSavingStats(false);
    if (error) return toast.error(error.message);
    toast.success("Stats updated");
    load();
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
      project_type: editing.project_type || "Web Application",
      live_enabled: editing.live_enabled ?? true,
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
        <div className="mb-6 -mx-1 flex items-center gap-1 overflow-x-auto rounded-xl border border-border/60 bg-secondary/30 p-1 sm:w-fit sm:overflow-visible [scrollbar-width:none] [&>button]:shrink-0 [&>button]:whitespace-nowrap [&::-webkit-scrollbar]:hidden">
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
          <button
            onClick={() => setTab("enquiries")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === "enquiries" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Inbox className="h-4 w-4" /> Customer Enquiries
            {messages.length > 0 && (
              <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                {messages.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("stats")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === "stats" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 className="h-4 w-4" /> Stats
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
                          <div className="mt-1 flex flex-wrap gap-1 text-[10px]">
                            <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{p.project_type}</span>
                            {!p.live_enabled && <span className="rounded bg-secondary px-1.5 py-0.5">Private</span>}
                          </div>
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

        {tab === "enquiries" && (
          <>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Messages sent from the Contact page form. Newest first.
              </p>
            </div>
            <div className="overflow-hidden rounded-2xl glass">
              {fetching ? (
                <div className="p-12 text-center text-muted-foreground">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">No enquiries yet.</div>
              ) : (
                <ul className="divide-y divide-border/60">
                  {messages.map((m) => (
                    <li key={m.id} className="p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium">{m.name}</span>
                            <a
                              href={`mailto:${m.email}`}
                              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                            >
                              <Mail className="h-3 w-3" /> {m.email}
                            </a>
                          </div>
                          <p className="mt-2 whitespace-pre-wrap text-sm text-foreground/85">{m.message}</p>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {new Date(m.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <a
                            href={`mailto:${m.email}?subject=Re: Your enquiry to Nandish-Tech`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition hover:bg-secondary"
                          >
                            <Mail className="h-3.5 w-3.5" /> Reply
                          </a>
                          <button
                            onClick={async () => {
                              const { error } = await supabase.from("contact_messages").delete().eq("id", m.id);
                              if (error) return toast.error(error.message);
                              setMessages((prev) => prev.filter((x) => x.id !== m.id));
                              toast.success("Enquiry deleted");
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/40 px-3 py-1.5 text-xs font-medium text-destructive transition hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        {tab === "stats" && (
          <>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Edit the "Better Business" stats section shown above testimonials on the home page.
              </p>
            </div>
            <div className="rounded-2xl glass p-5 sm:p-6">
              {fetching ? (
                <div className="p-8 text-center text-muted-foreground"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></div>
              ) : !stats ? (
                <div className="p-8 text-center text-muted-foreground">No stats row found.</div>
              ) : (
                <form onSubmit={saveStats} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">Heading</label>
                    <input
                      value={stats.heading}
                      onChange={(e) => setStats({ ...stats, heading: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">Subheading</label>
                    <textarea
                      rows={3}
                      value={stats.subheading}
                      onChange={(e) => setStats({ ...stats, subheading: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">Projects completed (count)</label>
                      <input
                        value={stats.projects_count}
                        onChange={(e) => setStats({ ...stats, projects_count: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">Projects label</label>
                      <input
                        value={stats.projects_label}
                        onChange={(e) => setStats({ ...stats, projects_label: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">Success rate</label>
                      <input
                        value={stats.success_rate}
                        onChange={(e) => setStats({ ...stats, success_rate: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">Success label</label>
                      <input
                        value={stats.success_label}
                        onChange={(e) => setStats({ ...stats, success_label: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm font-medium">Home page highlight card</p>
                    <p className="text-xs text-muted-foreground">The four numbers shown near the top of the home page.</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">Stat 1 value</label>
                      <input
                        value={stats.hero_stat1_value}
                        onChange={(e) => setStats({ ...stats, hero_stat1_value: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">Stat 1 label</label>
                      <input
                        value={stats.hero_stat1_label}
                        onChange={(e) => setStats({ ...stats, hero_stat1_label: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">Stat 2 value</label>
                      <input
                        value={stats.hero_stat2_value}
                        onChange={(e) => setStats({ ...stats, hero_stat2_value: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">Stat 2 label</label>
                      <input
                        value={stats.hero_stat2_label}
                        onChange={(e) => setStats({ ...stats, hero_stat2_label: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">Stat 3 value</label>
                      <input
                        value={stats.hero_stat3_value}
                        onChange={(e) => setStats({ ...stats, hero_stat3_value: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">Stat 3 label</label>
                      <input
                        value={stats.hero_stat3_label}
                        onChange={(e) => setStats({ ...stats, hero_stat3_label: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">Stat 4 value</label>
                      <input
                        value={stats.hero_stat4_value}
                        onChange={(e) => setStats({ ...stats, hero_stat4_value: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">Stat 4 label</label>
                      <input
                        value={stats.hero_stat4_label}
                        onChange={(e) => setStats({ ...stats, hero_stat4_label: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={savingStats}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground btn-glow transition hover:opacity-90 disabled:opacity-60"
                  >
                    {savingStats ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Save stats
                  </button>
                </form>
              )}
            </div>
          </>
        )}


        {tab === "testimonials" && (
          <>
            <div className="mb-4 flex items-end justify-between gap-4">
              <p className="text-sm text-muted-foreground">Client testimonials submitted through the site. Approve to publish.</p>
            </div>
            <div className="overflow-hidden rounded-2xl glass">
              {fetching ? (
                <div className="p-12 text-center text-muted-foreground"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></div>
              ) : testimonials.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">No testimonials yet.</div>
              ) : (
                <ul className="divide-y divide-border/40">
                  {testimonials.map((t) => (
                    <li key={t.id} className="flex flex-col gap-3 p-4 sm:px-5">
                      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:flex-wrap">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold">{t.name}</span>
                            {t.email && <span className="text-xs text-muted-foreground">· {t.email}</span>}
                            {(t.role || t.company) && (
                              <span className="text-xs text-muted-foreground">· {[t.role, t.company].filter(Boolean).join(" @ ")}</span>
                            )}
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <div className="flex items-center gap-0.5 text-amber-400">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`h-3.5 w-3.5 ${i < t.rating ? "fill-current" : "opacity-30"}`} />
                              ))}
                            </div>
                            {t.approved ? (
                              <span className="inline-flex items-center gap-1 rounded-md bg-primary/15 px-2 py-0.5 text-[10px] text-primary"><Check className="h-3 w-3" /> Published</span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-2 py-0.5 text-[10px] text-amber-500">Pending</span>
                            )}
                            <span className="text-[10px] text-muted-foreground">· {new Date(t.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => toggleTestimonialApproval(t)}
                            className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition ${t.approved ? "bg-secondary text-muted-foreground hover:text-foreground" : "bg-primary/15 text-primary hover:bg-primary/25"}`}>
                            {t.approved ? <><UserX className="h-3.5 w-3.5" /> Unpublish</> : <><Check className="h-3.5 w-3.5" /> Approve</>}
                          </button>
                          <button onClick={() => setEditingTestimonial({ id: t.id, name: t.name, email: t.email, company: t.company, role: t.role, rating: t.rating, message: t.message, approved: t.approved })}
                            className="inline-flex items-center gap-1 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground">
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button onClick={() => removeTestimonial(t.id)}
                            className="inline-flex items-center gap-1 rounded-md bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive transition hover:bg-destructive/20">
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                      <p className="rounded-lg bg-secondary/30 p-3 text-sm text-foreground/90">"{t.message}"</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </main>

      {editingTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm overflow-y-auto">
          <form onSubmit={saveTestimonial} className="w-full max-w-lg rounded-2xl glass-strong p-6 my-8">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Edit testimonial</h2>
              <button type="button" onClick={() => setEditingTestimonial(null)} className="rounded-md p-1 text-muted-foreground hover:bg-secondary"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Name</label>
                  <input required value={editingTestimonial.name} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                    className="w-full rounded-lg border border-border bg-input/50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</label>
                  <input value={editingTestimonial.email ?? ""} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, email: e.target.value })}
                    className="w-full rounded-lg border border-border bg-input/50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Company</label>
                  <input value={editingTestimonial.company ?? ""} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, company: e.target.value })}
                    className="w-full rounded-lg border border-border bg-input/50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Role</label>
                  <input value={editingTestimonial.role ?? ""} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                    className="w-full rounded-lg border border-border bg-input/50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" onClick={() => setEditingTestimonial({ ...editingTestimonial, rating: n })} className="p-1">
                      <Star className={`h-6 w-6 ${n <= editingTestimonial.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Message</label>
                <textarea required rows={4} value={editingTestimonial.message} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, message: e.target.value })}
                  className="w-full rounded-lg border border-border bg-input/50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editingTestimonial.approved} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, approved: e.target.checked })} />
                Published (visible on site)
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setEditingTestimonial(null)} className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-secondary">Cancel</button>
              <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground btn-glow hover:opacity-90">Save</button>
            </div>
          </form>
        </div>
      )}


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
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Project type</label>
                <select
                  value={editing.project_type ?? "Web Application"}
                  onChange={(e) => setEditing({ ...editing, project_type: e.target.value })}
                  className="w-full rounded-lg border border-border bg-input/50 px-3 py-2 text-sm outline-none focus:border-primary"
                >
                  <option>Web Application</option>
                  <option>Mobile App</option>
                  <option>Mobile + Web Application</option>
                </select>
              </div>
              <label className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-secondary/20 p-3">
                <span className="text-sm font-medium">Show live URL (off = Private Project)</span>
                <input
                  type="checkbox"
                  className="h-5 w-9 cursor-pointer appearance-none rounded-full bg-secondary outline-none transition checked:bg-primary relative after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-background after:transition checked:after:translate-x-4"
                  checked={editing.live_enabled ?? true}
                  onChange={(e) => setEditing({ ...editing, live_enabled: e.target.checked })}
                />
              </label>
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
