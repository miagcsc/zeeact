import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { RichTextEditor } from "@/components/RichTextEditor";
import type { Service, PortfolioItem, Testimonial, ContactSubmission, SiteSettings } from "@workspace/api-client-react";
import { useUser, useClerk } from "@clerk/react";
import {
  LayoutDashboard,
  Briefcase,
  FolderKanban,
  MessageSquareQuote,
  Mails,
  Settings,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  BarChart2,
  Search,
  FileText,
  Eye,
  EyeOff,
  Globe,
  Code,
  ArrowLeft,
  Layers,
  Copy,
  ChevronUp,
  ChevronDown,
  GripVertical,
  ExternalLink,
  Menu,
  X,
  Linkedin,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import {
  useListServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
  getListServicesQueryKey,
  useListPortfolio,
  useCreatePortfolioItem,
  useUpdatePortfolioItem,
  useDeletePortfolioItem,
  getListPortfolioQueryKey,
  useListTestimonials,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
  getListTestimonialsQueryKey,
  useListContactSubmissions,
  useMarkContactRead,
  getListContactSubmissionsQueryKey,
  useGetSettings,
  useUpdateSettings,
  getGetSettingsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type View = "dashboard" | "services" | "portfolio" | "testimonials" | "contacts" | "settings" | "blog" | "seo" | "analytics" | "solutions";

function CoverImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

  const convertToWebP = (file: File): Promise<Blob> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error("Conversion failed"))),
          "image/webp",
          0.88,
        );
      };
      img.onerror = reject;
      img.src = objectUrl;
    });

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const webp = await convertToWebP(file);
      const fd = new FormData();
      fd.append("file", webp, `cover-${Date.now()}.webp`);
      const res = await fetch(`${BASE}/api/upload`, { method: "POST", credentials: "include", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const { url: uploaded } = (await res.json()) as { url: string };
      onChange(uploaded);
    } catch {
      toast.error("Image upload failed. Try again.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {value && (
        <div className="relative w-full h-36 rounded-lg overflow-hidden border border-black/10 bg-gray-50">
          <img src={value} alt="Cover preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black/80"
          >
            ✕
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-black/20 text-sm font-medium hover:border-[#E63950] hover:text-[#E63950] transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-[#E63950] border-t-transparent animate-spin inline-block" />
              <span>Converting to WebP…</span>
            </>
          ) : (
            <>
              <span>📁</span>
              <span>{value ? "Replace image" : "Upload image"}</span>
            </>
          )}
        </button>
        {!value && (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="or paste URL…"
            className="flex-1 text-xs h-10 px-3 border border-input rounded-md bg-background text-foreground"
          />
        )}
      </div>
      <p className="text-[11px] text-black/40">Any image format — automatically converted to WebP</p>
    </div>
  );
}

export default function AdminPage() {
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "solutions", label: "Solutions", icon: Layers },
    { id: "services", label: "Services", icon: Briefcase },
    { id: "portfolio", label: "Portfolio", icon: FolderKanban },
    { id: "testimonials", label: "Testimonials", icon: MessageSquareQuote },
    { id: "contacts", label: "Contacts", icon: Mails },
    { id: "blog", label: "Blog", icon: FileText },
    { id: "seo", label: "SEO", icon: Search },
    { id: "analytics", label: "Analytics", icon: BarChart2 },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const;

  function handleNavClick(id: View) {
    setActiveView(id);
    setSidebarOpen(false);
  }

  const sidebarContent = (
    <>
      <div className="h-[60px] flex items-center px-6 border-b border-white/10 shrink-0">
        <span className="font-display font-extrabold text-xl text-white">
          Zee<span className="text-[#E63950]">Acts</span>
          <span className="text-white/30 text-sm font-normal ml-2">Admin</span>
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id as View)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeView === item.id
                ? "bg-[#E63950] text-white"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10 shrink-0">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.firstName?.[0] || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-white truncate">{user?.fullName || "Admin User"}</div>
            <div className="text-[10px] text-white/40 truncate">{user?.primaryEmailAddress?.emailAddress}</div>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50">

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — desktop: always visible; mobile: slide-in drawer */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-60 bg-[#0A0A0F] flex flex-col transition-transform duration-200
          md:relative md:translate-x-0 md:z-auto md:shrink-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Mobile close button */}
        <button
          className="absolute top-3 right-3 md:hidden w-8 h-8 flex items-center justify-center rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <X className="w-4 h-4" />
        </button>
        {sidebarContent}
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Mobile top bar */}
        <header className="md:hidden h-[56px] bg-white border-b border-black/08 flex items-center px-4 gap-3 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-black/05 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-[#0A0A0F]" />
          </button>
          <span className="font-display font-extrabold text-lg text-[#0A0A0F]">
            Zee<span className="text-[#E63950]">Acts</span>
          </span>
          <span className="text-xs text-black/30 font-normal">Admin</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8">
            {activeView === "dashboard" && <DashboardView />}
            {activeView === "services" && <ServicesView />}
            {activeView === "portfolio" && <PortfolioView />}
            {activeView === "testimonials" && <TestimonialsView />}
            {activeView === "contacts" && <ContactsView />}
            {activeView === "solutions" && <SolutionsView />}
            {activeView === "blog" && <BlogView />}
            {activeView === "seo" && <SeoView />}
            {activeView === "analytics" && <AnalyticsView />}
            {activeView === "settings" && <SettingsView />}
          </div>
        </main>
      </div>

    </div>
  );
}

// --- Views ---

function DashboardView() {
  const { data: services } = useListServices();
  const { data: portfolio } = useListPortfolio();
  const { data: testimonials } = useListTestimonials();
  const { data: contacts } = useListContactSubmissions();

  const unreadContacts = contacts?.filter(c => !c.isRead).length || 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{services?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Portfolio Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{portfolio?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Testimonials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{testimonials?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unread Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#E63950]">{unreadContacts}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- Services View ---
const serviceSchema = z.object({
  title: z.string().min(1, "Title required"),
  description: z.string().min(1, "Description required"),
  icon: z.string().min(1, "Icon required"),
  sortOrder: z.coerce.number().int().default(0),
});

function ServicesView() {
  const { data: services, isLoading } = useListServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();
  const queryClient = useQueryClient();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: { title: "", description: "", icon: "", sortOrder: 0 },
  });

  const openCreate = () => {
    setEditingId(null);
    form.reset({ title: "", description: "", icon: "", sortOrder: 0 });
    setIsDialogOpen(true);
  };

  const openEdit = (service: Service) => {
    setEditingId(service.id);
    form.reset({
      title: service.title,
      description: service.description,
      icon: service.icon,
      sortOrder: service.sortOrder,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (values: z.infer<typeof serviceSchema>) => {
    if (editingId) {
      updateService.mutate({ id: editingId, data: values }, {
        onSuccess: () => {
          toast.success("Service updated");
          queryClient.invalidateQueries({ queryKey: getListServicesQueryKey() });
          setIsDialogOpen(false);
        }
      });
    } else {
      createService.mutate({ data: values }, {
        onSuccess: () => {
          toast.success("Service created");
          queryClient.invalidateQueries({ queryKey: getListServicesQueryKey() });
          setIsDialogOpen(false);
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure?")) {
      deleteService.mutate({ id }, {
        onSuccess: () => {
          toast.success("Service deleted");
          queryClient.invalidateQueries({ queryKey: getListServicesQueryKey() });
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-bold">Services</h1>
        <Button onClick={openCreate} className="bg-[#E63950] hover:bg-[#B52C3E] text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Service
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Service" : "Add Service"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="icon" render={({ field }) => (
                  <FormItem><FormLabel>Icon (Emoji)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="sortOrder" render={({ field }) => (
                  <FormItem><FormLabel>Sort Order</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <Button type="submit" disabled={createService.isPending || updateService.isPending} className="w-full">
                Save
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Icon</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[100px]">Order</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services?.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="text-2xl">{s.icon}</TableCell>
                <TableCell className="font-medium">{s.title}</TableCell>
                <TableCell className="text-muted-foreground truncate max-w-md">{s.description}</TableCell>
                <TableCell>{s.sortOrder}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(s.id)}><Trash2 className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {services?.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No services found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// --- Portfolio View ---
const portfolioSchema = z.object({
  title: z.string().min(1, "Title required"),
  category: z.string().min(1, "Category required"),
  description: z.string().min(1, "Description required"),
  techStack: z.string().min(1, "Tech stack required"),
  resultMetric: z.string().min(1, "Metric required"),
  resultLabel: z.string().min(1, "Label required"),
  accentColor: z.string().default("#1a1a24"),
  sortOrder: z.coerce.number().int().default(0),
});

function PortfolioView() {
  const { data: items } = useListPortfolio();
  const createItem = useCreatePortfolioItem();
  const updateItem = useUpdatePortfolioItem();
  const deleteItem = useDeletePortfolioItem();
  const queryClient = useQueryClient();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof portfolioSchema>>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: { title: "", category: "SaaS", description: "", techStack: "", resultMetric: "", resultLabel: "", accentColor: "#1a1a24", sortOrder: 0 },
  });

  const openCreate = () => {
    setEditingId(null);
    form.reset({ title: "", category: "SaaS", description: "", techStack: "", resultMetric: "", resultLabel: "", accentColor: "#1a1a24", sortOrder: 0 });
    setIsDialogOpen(true);
  };

  const openEdit = (item: PortfolioItem) => {
    setEditingId(item.id);
    form.reset({
      title: item.title,
      category: item.category,
      description: item.description,
      techStack: item.techStack.join(", "),
      resultMetric: item.resultMetric,
      resultLabel: item.resultLabel,
      accentColor: item.accentColor,
      sortOrder: item.sortOrder,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (values: z.infer<typeof portfolioSchema>) => {
    const data = { ...values, techStack: values.techStack.split(",").map(s => s.trim()) };
    if (editingId) {
      updateItem.mutate({ id: editingId, data }, {
        onSuccess: () => {
          toast.success("Item updated");
          queryClient.invalidateQueries({ queryKey: getListPortfolioQueryKey() });
          setIsDialogOpen(false);
        }
      });
    } else {
      createItem.mutate({ data }, {
        onSuccess: () => {
          toast.success("Item created");
          queryClient.invalidateQueries({ queryKey: getListPortfolioQueryKey() });
          setIsDialogOpen(false);
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure?")) {
      deleteItem.mutate({ id }, {
        onSuccess: () => {
          toast.success("Item deleted");
          queryClient.invalidateQueries({ queryKey: getListPortfolioQueryKey() });
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-bold">Portfolio</h1>
        <Button onClick={openCreate} className="bg-[#E63950] hover:bg-[#B52C3E] text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Item
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Item" : "Add Item"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem><FormLabel>Category</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="techStack" render={({ field }) => (
                <FormItem><FormLabel>Tech Stack (comma separated)</FormLabel><FormControl><Input {...field} placeholder="React, Node.js, PostgreSQL" /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="resultMetric" render={({ field }) => (
                  <FormItem><FormLabel>Result Metric</FormLabel><FormControl><Input {...field} placeholder="e.g. 62%" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="resultLabel" render={({ field }) => (
                  <FormItem><FormLabel>Result Label</FormLabel><FormControl><Input {...field} placeholder="e.g. Faster Delivery" /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="accentColor" render={({ field }) => (
                  <FormItem><FormLabel>Accent Color (Hex)</FormLabel><FormControl><Input type="color" {...field} className="h-10 px-1 py-1" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="sortOrder" render={({ field }) => (
                  <FormItem><FormLabel>Sort Order</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <Button type="submit" disabled={createItem.isPending || updateItem.isPending} className="w-full">
                Save
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Metric</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.accentColor }} />
                    {s.title}
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline">{s.category}</Badge></TableCell>
                <TableCell>{s.resultMetric} <span className="text-xs text-muted-foreground uppercase">{s.resultLabel}</span></TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(s.id)}><Trash2 className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {items?.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No portfolio items found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// --- Testimonials View ---
const testimonialSchema = z.object({
  name: z.string().min(1, "Name required"),
  company: z.string().min(1, "Company required"),
  role: z.string().min(1, "Role required"),
  quote: z.string().min(1, "Quote required"),
  avatarInitials: z.string().min(1).max(2),
  avatarColor: z.string().default("#3A3A35"),
  sortOrder: z.coerce.number().int().default(0),
});

function TestimonialsView() {
  const { data: items } = useListTestimonials();
  const createItem = useCreateTestimonial();
  const updateItem = useUpdateTestimonial();
  const deleteItem = useDeleteTestimonial();
  const queryClient = useQueryClient();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof testimonialSchema>>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: { name: "", company: "", role: "", quote: "", avatarInitials: "", avatarColor: "#3A3A35", sortOrder: 0 },
  });

  const openCreate = () => {
    setEditingId(null);
    form.reset({ name: "", company: "", role: "", quote: "", avatarInitials: "", avatarColor: "#3A3A35", sortOrder: 0 });
    setIsDialogOpen(true);
  };

  const openEdit = (item: Testimonial) => {
    setEditingId(item.id);
    form.reset({
      name: item.name,
      company: item.company,
      role: item.role,
      quote: item.quote,
      avatarInitials: item.avatarInitials,
      avatarColor: item.avatarColor,
      sortOrder: item.sortOrder,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (values: z.infer<typeof testimonialSchema>) => {
    if (editingId) {
      updateItem.mutate({ id: editingId, data: values }, {
        onSuccess: () => {
          toast.success("Testimonial updated");
          queryClient.invalidateQueries({ queryKey: getListTestimonialsQueryKey() });
          setIsDialogOpen(false);
        }
      });
    } else {
      createItem.mutate({ data: values }, {
        onSuccess: () => {
          toast.success("Testimonial created");
          queryClient.invalidateQueries({ queryKey: getListTestimonialsQueryKey() });
          setIsDialogOpen(false);
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure?")) {
      deleteItem.mutate({ id }, {
        onSuccess: () => {
          toast.success("Testimonial deleted");
          queryClient.invalidateQueries({ queryKey: getListTestimonialsQueryKey() });
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-bold">Testimonials</h1>
        <Button onClick={openCreate} className="bg-[#E63950] hover:bg-[#B52C3E] text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Testimonial
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="company" render={({ field }) => (
                  <FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="role" render={({ field }) => (
                  <FormItem><FormLabel>Role</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="avatarInitials" render={({ field }) => (
                  <FormItem><FormLabel>Initials</FormLabel><FormControl><Input {...field} maxLength={2} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="quote" render={({ field }) => (
                <FormItem><FormLabel>Quote</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="avatarColor" render={({ field }) => (
                  <FormItem><FormLabel>Avatar Color</FormLabel><FormControl><Input type="color" {...field} className="h-10 px-1 py-1" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="sortOrder" render={({ field }) => (
                  <FormItem><FormLabel>Sort Order</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <Button type="submit" disabled={createItem.isPending || updateItem.isPending} className="w-full">
                Save
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Person</TableHead>
              <TableHead>Quote</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: s.avatarColor }}>
                      {s.avatarInitials}
                    </div>
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.role}, {s.company}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="truncate max-w-md italic">"{s.quote}"</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(s.id)}><Trash2 className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {items?.length === 0 && (
              <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">No testimonials found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// --- Contacts View ---
function ContactsView() {
  const { data: contacts } = useListContactSubmissions();
  const markRead = useMarkContactRead();
  const queryClient = useQueryClient();

  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);

  const handleMarkRead = (id: number) => {
    markRead.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListContactSubmissionsQueryKey() });
      }
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold">Contacts</h1>

      <Dialog open={!!selectedContact} onOpenChange={(o) => !o && setSelectedContact(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message from {selectedContact?.name}</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Email</div>
                  <div className="font-medium">{selectedContact.email}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Company</div>
                  <div className="font-medium">{selectedContact.company || "N/A"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Project Type</div>
                  <div className="font-medium">{selectedContact.projectType || "N/A"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Budget</div>
                  <div className="font-medium">{selectedContact.budget || "N/A"}</div>
                </div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm mb-1">Message</div>
                <div className="p-4 bg-muted rounded-md text-sm whitespace-pre-wrap">{selectedContact.message}</div>
              </div>
              <Button
                variant={selectedContact.isRead ? "outline" : "default"}
                onClick={() => { handleMarkRead(selectedContact.id); setSelectedContact(null); }}
                className="w-full"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {selectedContact.isRead ? "Mark as Unread" : "Mark as Read"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Sender</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Preview</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts?.map((c) => (
              <TableRow 
                key={c.id} 
                className={`cursor-pointer hover:bg-muted/50 ${!c.isRead ? "font-semibold bg-primary/5" : ""}`}
                onClick={() => setSelectedContact(c)}
              >
                <TableCell>{format(new Date(c.createdAt), "MMM d, yyyy")}</TableCell>
                <TableCell>
                  <div>{c.name}</div>
                  <div className="text-xs text-muted-foreground font-normal">{c.email}</div>
                </TableCell>
                <TableCell>{c.projectType || "-"}</TableCell>
                <TableCell className="max-w-[200px] truncate">{c.message}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleMarkRead(c.id)}
                    className="focus:outline-none"
                    title={c.isRead ? "Click to mark unread" : "Click to mark read"}
                  >
                    {!c.isRead ? <Badge className="bg-[#E63950] cursor-pointer">New</Badge> : <Badge variant="outline" className="cursor-pointer">Read</Badge>}
                  </button>
                </TableCell>
              </TableRow>
            ))}
            {contacts?.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No contacts found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// --- Blog View ---
interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  tags: string | null;
  status: string;
  metaTitle: string | null;
  metaDescription: string | null;
  publishedAt: string | null;
  createdAt: string;
}

const blogPostSchema = z.object({
  title: z.string().min(1, "Title required"),
  slug: z.string().min(1, "Slug required").regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  excerpt: z.string().default(""),
  content: z.string().default(""),
  coverImage: z.string().default(""),
  tags: z.string().default(""),
  status: z.enum(["draft", "published"]).default("draft"),
  metaTitle: z.string().default(""),
  metaDescription: z.string().default(""),
});

const BASE_API = import.meta.env.BASE_URL.replace(/\/$/, "");

async function apiFetch(path: string, options?: RequestInit) {
  const headers: Record<string, string> = { "Content-Type": "application/json", ...((options?.headers as Record<string, string>) ?? {}) };
  const res = await fetch(`${BASE_API}${path}`, { credentials: "include", ...options, headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function BlogView() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [preview, setPreview] = useState(false); // kept for rendered-HTML preview toggle
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["admin-blog-posts"],
    queryFn: () => apiFetch("/api/blog/all") as Promise<BlogPost[]>,
  });

  const form = useForm<z.infer<typeof blogPostSchema>>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: { title: "", slug: "", excerpt: "", content: "", coverImage: "", tags: "", status: "draft", metaTitle: "", metaDescription: "" },
  });

  const watchTitle = form.watch("title");
  useEffect(() => {
    if (!editingPost) {
      form.setValue("slug", slugify(watchTitle));
    }
  }, [watchTitle, editingPost, form]);

  const saveMutation = useMutation({
    mutationFn: async (values: z.infer<typeof blogPostSchema>) => {
      if (editingPost) {
        return apiFetch(`/api/blog/${editingPost.id}`, { method: "PUT", body: JSON.stringify(values) });
      }
      return apiFetch("/api/blog", { method: "POST", body: JSON.stringify(values) });
    },
    onSuccess: () => {
      toast.success(editingPost ? "Post updated" : "Post created");
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      setIsDialogOpen(false);
    },
    onError: () => toast.error("Failed to save post"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiFetch(`/api/blog/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Post deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
    },
  });

  const openCreate = () => {
    setEditingPost(null);
    setPreview(false);
    form.reset({ title: "", slug: "", excerpt: "", content: "", coverImage: "", tags: "", status: "draft", metaTitle: "", metaDescription: "" });
    setIsDialogOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditingPost(post);
    setPreview(false);
    form.reset({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? "",
      content: post.content,
      coverImage: post.coverImage ?? "",
      tags: post.tags ?? "",
      status: post.status as "draft" | "published",
      metaTitle: post.metaTitle ?? "",
      metaDescription: post.metaDescription ?? "",
    });
    setIsDialogOpen(true);
  };



  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold">Blog</h1>
          <p className="text-muted-foreground text-sm mt-1">Create and manage blog posts. Drafts are hidden from the public.</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/blog" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm"><Globe className="w-4 h-4 mr-2" />View Blog</Button>
          </a>
          <Button onClick={openCreate} className="bg-[#E63950] hover:bg-[#B52C3E] text-white">
            <Plus className="w-4 h-4 mr-2" /> New Post
          </Button>
        </div>
      </div>

      {/* Editor dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPost ? "Edit Post" : "New Blog Post"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((v) => saveMutation.mutate(v))} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Title</FormLabel>
                    <FormControl><Input {...field} placeholder="My Awesome Article" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="slug" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug (URL)</FormLabel>
                    <FormControl><Input {...field} placeholder="my-awesome-article" /></FormControl>
                    <p className="text-xs text-muted-foreground">Public URL: /blog/{field.value || "slug"}</p>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select {...field} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="excerpt" render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Excerpt (short description for listing)</FormLabel>
                    <FormControl><Textarea {...field} rows={2} placeholder="A brief summary of the article..." /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="coverImage" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image</FormLabel>
                    <CoverImageUpload value={field.value ?? ""} onChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="tags" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (comma-separated)</FormLabel>
                    <FormControl><Input {...field} placeholder="AI, SaaS, Automation" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* Content editor */}
              <FormField control={form.control} name="content" render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between mb-1">
                    <FormLabel>Content</FormLabel>
                    <button type="button" onClick={() => setPreview(!preview)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                      {preview ? <><EyeOff className="w-3.5 h-3.5" /> Editor</> : <><Eye className="w-3.5 h-3.5" /> HTML preview</>}
                    </button>
                  </div>
                  {preview ? (
                    <div
                      className="min-h-[300px] border rounded-md p-4 prose prose-sm max-w-none overflow-auto"
                      dangerouslySetInnerHTML={{ __html: field.value || "<p class='text-muted-foreground'>Nothing to preview yet...</p>" }}
                    />
                  ) : (
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Start writing your article... Use the toolbar above to add headings, bold, lists, quotes, links and images."
                      minHeight={420}
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )} />

              {/* SEO section */}
              <div className="border-t pt-4 space-y-4">
                <h4 className="font-medium flex items-center gap-2"><Search className="w-4 h-4" />SEO (optional)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="metaTitle" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Title</FormLabel>
                      <FormControl><Input {...field} placeholder="Overrides post title for search engines" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="metaDescription" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl><Input {...field} placeholder="155 chars max for best results" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saveMutation.isPending} className="bg-[#E63950] hover:bg-[#B52C3E] text-white">
                  {saveMutation.isPending ? "Saving..." : editingPost ? "Update Post" : "Create Post"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>}
            {posts?.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <div className="font-medium">{post.title}</div>
                  <div className="text-xs text-muted-foreground">/blog/{post.slug}</div>
                </TableCell>
                <TableCell>
                  {post.status === "published"
                    ? <Badge className="bg-green-500 text-white">Published</Badge>
                    : <Badge variant="outline">Draft</Badge>}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{post.tags || "—"}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {post.publishedAt ? format(new Date(post.publishedAt), "MMM d, yyyy") : "—"}
                </TableCell>
                <TableCell className="text-right space-x-1">
                  {post.status === "published" && (
                    <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon" title="View"><Globe className="w-4 h-4" /></Button>
                    </a>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => openEdit(post)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => { if (confirm("Delete this post?")) deleteMutation.mutate(post.id); }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && posts?.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No blog posts yet. Create your first one!</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// --- SEO View ---
function SeoView() {
  const { data: settings } = useGetSettings();
  const updateSettings = useUpdateSettings();
  const queryClient = useQueryClient();
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (settings) setFormValues(settings as Record<string, string>);
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate({ data: formValues as SiteSettings }, {
      onSuccess: () => {
        toast.success("SEO settings saved");
        queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
      },
    });
  };

  const siteTitle = formValues.seo_site_title || "";
  const metaDesc = formValues.seo_meta_description || "";

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-display font-bold">SEO Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Control how your site appears in Google and social media previews.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Google Preview */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg border-b pb-2 flex items-center gap-2"><Search className="w-4 h-4" />Search Engine</h3>
              <div className="bg-white border rounded-xl p-4 space-y-1 text-sm shadow-sm">
                <div className="text-blue-600 font-medium truncate">{siteTitle || "ZeeActs — Premium IT Solutions & AI Consultancy"}</div>
                <div className="text-green-700 text-xs">{formValues.seo_canonical_url || "https://zeeacts.com"}</div>
                <div className="text-zinc-500 line-clamp-2">{metaDesc || "ZeeActs solves your toughest operational hurdles with custom software, AI tools, and automation."}</div>
              </div>
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Site Title <span className="text-muted-foreground font-normal">(shown in browser tab & Google)</span></label>
                  <Input name="seo_site_title" value={formValues.seo_site_title || ""} onChange={handleChange} placeholder="ZeeActs — Premium IT Solutions & AI Consultancy" maxLength={70} />
                  <p className="text-xs text-muted-foreground mt-1">Keep under 60 characters · {(formValues.seo_site_title || "").length}/60</p>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Meta Description</label>
                  <Textarea name="seo_meta_description" value={formValues.seo_meta_description || ""} onChange={handleChange} rows={3} placeholder="ZeeActs solves your toughest operational hurdles with custom software, AI tools, and business automation." maxLength={160} />
                  <p className="text-xs text-muted-foreground mt-1">Ideal: 120–155 chars · {(formValues.seo_meta_description || "").length}/155</p>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Canonical URL</label>
                  <Input name="seo_canonical_url" value={formValues.seo_canonical_url || ""} onChange={handleChange} placeholder="https://zeeacts.com" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Robots</label>
                  <select name="seo_robots" value={formValues.seo_robots || "index, follow"} onChange={handleChange} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                    <option value="index, follow">index, follow (recommended)</option>
                    <option value="noindex, follow">noindex, follow</option>
                    <option value="noindex, nofollow">noindex, nofollow</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Open Graph */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg border-b pb-2">Open Graph (Social Sharing)</h3>
              <p className="text-sm text-muted-foreground">Controls how your site appears when shared on LinkedIn, Facebook, and other platforms.</p>
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">OG Title</label>
                  <Input name="seo_og_title" value={formValues.seo_og_title || ""} onChange={handleChange} placeholder="ZeeActs — Software That Builds. AI That Scales." />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">OG Description</label>
                  <Textarea name="seo_og_description" value={formValues.seo_og_description || ""} onChange={handleChange} rows={2} placeholder="Custom software, AI tools and automation for ambitious businesses." />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">OG Image URL <span className="text-muted-foreground font-normal">(1200×630px recommended)</span></label>
                  <Input name="seo_og_image" value={formValues.seo_og_image || ""} onChange={handleChange} placeholder="https://zeeacts.com/og-image.jpg" />
                  {formValues.seo_og_image && (
                    <img src={formValues.seo_og_image} alt="OG preview" className="mt-2 h-24 rounded-md object-cover border" />
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Twitter Card Type</label>
                  <select name="seo_twitter_card" value={formValues.seo_twitter_card || "summary_large_image"} onChange={handleChange} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                    <option value="summary_large_image">summary_large_image (recommended)</option>
                    <option value="summary">summary</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Verification */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg border-b pb-2">Google Search Console</h3>
              <div>
                <label className="text-sm font-medium block mb-1">Verification Meta Tag Content</label>
                <Input name="seo_google_verification" value={formValues.seo_google_verification || ""} onChange={handleChange} placeholder="Paste the content value from Google Search Console (not the full tag)" />
                <p className="text-xs text-muted-foreground mt-1">In Search Console → Settings → Ownership verification → HTML tag. Copy only the <code>content="..."</code> value.</p>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Bing Webmaster Verification</label>
                <Input name="seo_bing_verification" value={formValues.seo_bing_verification || ""} onChange={handleChange} placeholder="Bing verification content value" />
              </div>
            </div>

            <Button type="submit" disabled={updateSettings.isPending} className="bg-[#E63950] hover:bg-[#B52C3E] text-white">
              {updateSettings.isPending ? "Saving..." : "Save SEO Settings"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// --- Analytics View ---
function AnalyticsView() {
  const { data: settings } = useGetSettings();
  const updateSettings = useUpdateSettings();
  const queryClient = useQueryClient();
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [showCustom, setShowCustom] = useState(false);

  useEffect(() => {
    if (settings) setFormValues(settings as Record<string, string>);
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate({ data: formValues as SiteSettings }, {
      onSuccess: () => {
        toast.success("Analytics settings saved — reload the site to activate scripts");
        queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
      },
    });
  };

  const Field = ({ name, label, hint, placeholder }: { name: string; label: string; hint?: string; placeholder?: string }) => (
    <div>
      <label className="text-sm font-medium block mb-1">{label}</label>
      <Input name={name} value={formValues[name] || ""} onChange={handleChange} placeholder={placeholder} />
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-display font-bold">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Tracking scripts are automatically injected on every page. Conversion events fire when the contact form is submitted.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Google */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg border-b pb-2 flex items-center gap-2">
                <span className="text-xl">🔵</span> Google
              </h3>
              <div className="grid gap-4">
                <Field
                  name="analytics_ga4_id"
                  label="Google Analytics 4 — Measurement ID"
                  placeholder="G-XXXXXXXXXX"
                  hint="Found in GA4 → Admin → Data Streams → your stream → Measurement ID"
                />
                <Field
                  name="analytics_gtm_id"
                  label="Google Tag Manager — Container ID"
                  placeholder="GTM-XXXXXXX"
                  hint="Found in GTM → your workspace → Container ID (top right)"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    name="analytics_google_ads_id"
                    label="Google Ads — Conversion ID"
                    placeholder="AW-XXXXXXXXXX"
                    hint="Google Ads → Conversions → your conversion → Tag setup"
                  />
                  <Field
                    name="analytics_google_ads_label"
                    label="Google Ads — Conversion Label"
                    placeholder="AbCdEfGhIjK"
                    hint="The second part after AW-XXXXXXXXXX/"
                  />
                </div>
              </div>
            </div>

            {/* Meta / Facebook */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg border-b pb-2 flex items-center gap-2">
                <span className="text-xl">🔵</span> Meta (Facebook)
              </h3>
              <Field
                name="analytics_fb_pixel_id"
                label="Facebook Pixel ID"
                placeholder="123456789012345"
                hint="Facebook Ads Manager → Events Manager → your pixel → Pixel ID"
              />
              <p className="text-xs text-muted-foreground -mt-2">Tracks PageView on load and Lead event on contact form submission.</p>
            </div>

            {/* LinkedIn */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg border-b pb-2 flex items-center gap-2">
                <span className="text-xl">🔵</span> LinkedIn
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Field
                  name="analytics_linkedin_partner_id"
                  label="LinkedIn Insight Tag — Partner ID"
                  placeholder="1234567"
                  hint="LinkedIn Campaign Manager → Account Assets → Insight Tag"
                />
                <Field
                  name="analytics_linkedin_conversion_id"
                  label="LinkedIn Conversion ID"
                  placeholder="12345678"
                  hint="LinkedIn Ads → Conversion tracking → your conversion → ID"
                />
              </div>
            </div>

            {/* Custom scripts */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setShowCustom(!showCustom)}
                className="flex items-center gap-2 font-medium text-lg w-full border-b pb-2 text-left"
              >
                <Code className="w-4 h-4" /> Custom Scripts
                <span className="text-sm font-normal text-muted-foreground ml-auto">{showCustom ? "▲ Hide" : "▼ Show"}</span>
              </button>
              {showCustom && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Add any additional tracking code (HotJar, Intercom, Clarity, etc). Paste the full script tags.</p>
                  <div>
                    <label className="text-sm font-medium block mb-1">Head Scripts <span className="text-muted-foreground font-normal">(injected in &lt;head&gt;)</span></label>
                    <Textarea
                      name="analytics_custom_head"
                      value={formValues.analytics_custom_head || ""}
                      onChange={handleChange}
                      rows={5}
                      className="font-mono text-xs"
                      placeholder={'<script>\n  // your script here\n</script>'}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Body Scripts <span className="text-muted-foreground font-normal">(injected at start of &lt;body&gt;)</span></label>
                    <Textarea
                      name="analytics_custom_body"
                      value={formValues.analytics_custom_body || ""}
                      onChange={handleChange}
                      rows={5}
                      className="font-mono text-xs"
                      placeholder={'<script>\n  // your script here\n</script>'}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Conversion events info */}
            <div className="bg-[#E63950]/5 border border-[#E63950]/20 rounded-xl p-4 space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2"><span>🎯</span> Conversion Events</h4>
              <p className="text-sm text-muted-foreground">When a visitor submits the contact form, ZeeActs automatically fires:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-none">
                <li>• <strong>GA4</strong> — <code className="bg-black/5 px-1 rounded text-xs">generate_lead</code> event</li>
                <li>• <strong>Google Ads</strong> — Conversion with your ID/Label</li>
                <li>• <strong>Facebook Pixel</strong> — <code className="bg-black/5 px-1 rounded text-xs">Lead</code> standard event</li>
                <li>• <strong>LinkedIn</strong> — Conversion event with your Conversion ID</li>
              </ul>
            </div>

            <Button type="submit" disabled={updateSettings.isPending} className="bg-[#E63950] hover:bg-[#B52C3E] text-white">
              {updateSettings.isPending ? "Saving..." : "Save Analytics Settings"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// --- Settings View ---
function SettingsView() {
  const { data: settings } = useGetSettings();
  const updateSettings = useUpdateSettings();
  const queryClient = useQueryClient();

  const [formValues, setFormValues] = useState<SiteSettings>({});

  useEffect(() => {
    if (settings) {
      setFormValues(settings);
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate({ data: formValues }, {
      onSuccess: () => {
        toast.success("Settings updated");
        queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
      }
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-3xl font-display font-bold">Site Settings</h1>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium text-lg border-b pb-2">Hero Section</h3>
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium leading-none block mb-1">Hero Badge Text</label>
                  <Input name="heroBadge" value={formValues.heroBadge || ""} onChange={handleChange} placeholder="IT Solutions · SaaS · AI Consultancy" />
                </div>
                <div>
                  <label className="text-sm font-medium leading-none block mb-1">Hero Headline</label>
                  <Textarea name="heroHeadline" value={formValues.heroHeadline || ""} onChange={handleChange} placeholder="Software That Builds. AI That Scales." rows={2} />
                  <p className="text-xs text-muted-foreground mt-1">Use HTML tags for styling if needed.</p>
                </div>
                <div>
                  <label className="text-sm font-medium leading-none block mb-1">Hero Subheadline</label>
                  <Textarea name="heroSubheadline" value={formValues.heroSubheadline || ""} onChange={handleChange} placeholder="ZeeActs delivers custom software..." rows={3} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-lg border-b pb-2">About Section</h3>
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium leading-none block mb-1">About Title</label>
                  <Input name="aboutTitle" value={formValues.aboutTitle || ""} onChange={handleChange} />
                </div>
                <div>
                  <label className="text-sm font-medium leading-none block mb-1">About Body (HTML)</label>
                  <Textarea name="aboutBody" value={formValues.aboutBody || ""} onChange={handleChange} rows={5} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium leading-none block mb-1">Founder Name</label>
                    <Input name="founderName" value={formValues.founderName || ""} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="text-sm font-medium leading-none block mb-1">Founder Bio Quote</label>
                    <Textarea name="founderBio" value={formValues.founderBio || ""} onChange={handleChange} rows={2} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-lg border-b pb-2">General</h3>
              <div>
                <label className="text-sm font-medium leading-none block mb-1">Contact Email</label>
                <Input name="contactEmail" value={formValues.contactEmail || ""} onChange={handleChange} placeholder="hello@zeeacts.com" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-lg border-b pb-2">Social Links</h3>
              <p className="text-sm text-muted-foreground">Leave blank to hide an icon on the website. Add full URLs (https://...).</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium leading-none flex items-center gap-2 mb-1">
                    <Linkedin className="w-4 h-4 text-[#0A66C2]" /> LinkedIn
                  </label>
                  <Input name="socialLinkedin" value={formValues.socialLinkedin || ""} onChange={handleChange} placeholder="https://linkedin.com/company/zeeacts" />
                </div>
                <div>
                  <label className="text-sm font-medium leading-none flex items-center gap-2 mb-1">
                    <Facebook className="w-4 h-4 text-[#1877F2]" /> Facebook
                  </label>
                  <Input name="socialFacebook" value={formValues.socialFacebook || ""} onChange={handleChange} placeholder="https://facebook.com/zeeacts" />
                </div>
                <div>
                  <label className="text-sm font-medium leading-none flex items-center gap-2 mb-1">
                    <Instagram className="w-4 h-4 text-[#E1306C]" /> Instagram
                  </label>
                  <Input name="socialInstagram" value={formValues.socialInstagram || ""} onChange={handleChange} placeholder="https://instagram.com/zeeacts" />
                </div>
                <div>
                  <label className="text-sm font-medium leading-none flex items-center gap-2 mb-1">
                    <Twitter className="w-4 h-4 text-[#1DA1F2]" /> Twitter / X
                  </label>
                  <Input name="socialTwitter" value={formValues.socialTwitter || ""} onChange={handleChange} placeholder="https://twitter.com/zeeacts" />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={updateSettings.isPending} className="bg-[#E63950] hover:bg-[#B52C3E] text-white">
              {updateSettings.isPending ? "Saving..." : "Save Settings"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// =====================================================================
// Solutions View — Elementor-style editor for solution landing pages
// =====================================================================

interface SolutionAdmin {
  id: number;
  slug: string;
  status: string;
  name: string;
  tagline: string;
  badge: string;
  accentColor: string;
  logoText: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroCta: string;
  heroCtaSecondary: string;
  heroImage: string;
  painPoints: string;
  features: string;
  howItWorks: string;
  stats: string;
  ctaHeadline: string;
  ctaSubheadline: string;
  ctaButtonText: string;
  metaTitle: string;
  metaDescription: string;
  sortOrder: number;
}

interface RepeaterItem { [key: string]: string }

function RepeaterEditor({
  value,
  onChange,
  fields,
  addLabel,
}: {
  value: string;
  onChange: (val: string) => void;
  fields: { key: string; label: string; placeholder?: string; multiline?: boolean }[];
  addLabel: string;
}) {
  const items: RepeaterItem[] = (() => {
    try { return JSON.parse(value) as RepeaterItem[]; } catch { return []; }
  })();

  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [draft, setDraft] = useState<RepeaterItem>({});

  const save = (items: RepeaterItem[]) => onChange(JSON.stringify(items));

  const startAdd = () => {
    const empty: RepeaterItem = {};
    fields.forEach((f) => (empty[f.key] = ""));
    setDraft(empty);
    setEditingIdx(items.length);
  };

  const startEdit = (idx: number) => {
    setDraft({ ...items[idx] });
    setEditingIdx(idx);
  };

  const commitEdit = () => {
    if (editingIdx === null) return;
    const next = [...items];
    next[editingIdx] = draft;
    save(next);
    setEditingIdx(null);
    setDraft({});
  };

  const remove = (idx: number) => {
    save(items.filter((_, i) => i !== idx));
    if (editingIdx === idx) { setEditingIdx(null); setDraft({}); }
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const next = [...items];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    save(next);
  };

  const moveDown = (idx: number) => {
    if (idx === items.length - 1) return;
    const next = [...items];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    save(next);
  };

  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className="border border-input rounded-lg overflow-hidden">
          {/* Item header */}
          <div className="flex items-center gap-2 px-3 py-2 bg-muted/40">
            <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="flex-1 text-sm font-medium truncate text-foreground">
              {item[fields[1]?.key] || item[fields[0]?.key] || `Item ${idx + 1}`}
            </span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => moveUp(idx)} className="p-1 hover:bg-accent rounded" title="Move up"><ChevronUp className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => moveDown(idx)} className="p-1 hover:bg-accent rounded" title="Move down"><ChevronDown className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => startEdit(idx)} className="p-1.5 hover:bg-accent rounded text-xs font-medium text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => remove(idx)} className="p-1.5 hover:bg-destructive/10 rounded text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
          {/* Inline edit panel */}
          {editingIdx === idx && (
            <div className="px-4 py-3 border-t border-input bg-background space-y-3">
              {fields.map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">{f.label}</label>
                  {f.multiline ? (
                    <textarea
                      rows={3}
                      value={draft[f.key] ?? ""}
                      onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  ) : (
                    <input
                      type="text"
                      value={draft[f.key] ?? ""}
                      onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  )}
                </div>
              ))}
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={commitEdit} className="px-4 py-1.5 rounded-md bg-[#E63950] text-white text-xs font-semibold hover:bg-[#B52C3E] transition-colors">Save</button>
                <button type="button" onClick={() => { setEditingIdx(null); setDraft({}); }} className="px-4 py-1.5 rounded-md border border-input text-xs font-semibold hover:bg-accent transition-colors">Cancel</button>
              </div>
            </div>
          )}
        </div>
      ))}
      {/* Add new — inline form if adding */}
      {editingIdx === items.length && (
        <div className="border border-dashed border-input rounded-lg px-4 py-3 space-y-3 bg-muted/20">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-medium text-muted-foreground mb-1">{f.label}</label>
              {f.multiline ? (
                <textarea
                  rows={3}
                  value={draft[f.key] ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                />
              ) : (
                <input
                  type="text"
                  value={draft[f.key] ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                />
              )}
            </div>
          ))}
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={commitEdit} className="px-4 py-1.5 rounded-md bg-[#E63950] text-white text-xs font-semibold hover:bg-[#B52C3E] transition-colors">Add</button>
            <button type="button" onClick={() => { setEditingIdx(null); setDraft({}); }} className="px-4 py-1.5 rounded-md border border-input text-xs font-semibold hover:bg-accent transition-colors">Cancel</button>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={startAdd}
        disabled={editingIdx !== null}
        className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed py-1"
      >
        <Plus className="w-3.5 h-3.5" /> {addLabel}
      </button>
    </div>
  );
}

type SolutionTab = "basic" | "hero" | "painPoints" | "features" | "howItWorks" | "stats" | "cta" | "seo";

function SolutionsView() {
  const queryClient = useQueryClient();
  const [editingSolution, setEditingSolution] = useState<SolutionAdmin | null>(null);
  const [activeTab, setActiveTab] = useState<SolutionTab>("basic");
  const [form, setForm] = useState<Partial<SolutionAdmin>>({});

  const { data: solutions, isLoading } = useQuery<SolutionAdmin[]>({
    queryKey: ["admin-solutions"],
    queryFn: () => apiFetch("/api/solutions/all") as Promise<SolutionAdmin[]>,
  });

  const saveMutation = useMutation({
    mutationFn: async (values: Partial<SolutionAdmin>) => {
      const { id: _id, createdAt: _c, updatedAt: _u, ...payload } = values as SolutionAdmin;
      if (editingSolution?.id) {
        return apiFetch(`/api/solutions/${editingSolution.id}`, { method: "PUT", body: JSON.stringify(payload) });
      }
      return apiFetch("/api/solutions", { method: "POST", body: JSON.stringify(payload) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-solutions"] });
      toast.success(editingSolution?.id ? "Solution updated!" : "Solution created!");
      setEditingSolution(null);
      setForm({});
      setActiveTab("basic");
    },
    onError: () => toast.error("Failed to save solution."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiFetch(`/api/solutions/${id}`, { method: "DELETE" }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-solutions"] }); toast.success("Deleted."); },
  });

  const duplicateMutation = useMutation({
    mutationFn: (id: number) => apiFetch(`/api/solutions/${id}/duplicate`, { method: "POST" }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-solutions"] }); toast.success("Duplicated as draft!"); },
  });

  const openNew = () => {
    setEditingSolution({ id: 0 } as SolutionAdmin);
    setForm({
      status: "draft", name: "", slug: "", tagline: "", badge: "", accentColor: "#0EA5E9",
      logoText: "", heroHeadline: "", heroSubheadline: "", heroCta: "Book a Demo",
      heroCtaSecondary: "See Features", heroImage: "", painPoints: "[]", features: "[]",
      howItWorks: "[]", stats: "[]", ctaHeadline: "", ctaSubheadline: "", ctaButtonText: "Book a Demo",
      metaTitle: "", metaDescription: "", sortOrder: 0,
    });
    setActiveTab("basic");
  };

  const openEdit = (sol: SolutionAdmin) => {
    setEditingSolution(sol);
    setForm({ ...sol });
    setActiveTab("basic");
  };

  const set = (key: keyof SolutionAdmin, val: string | number) => setForm((f) => ({ ...f, [key]: val }));

  const tabs: { id: SolutionTab; label: string }[] = [
    { id: "basic", label: "Basic" },
    { id: "hero", label: "Hero" },
    { id: "painPoints", label: "Pain Points" },
    { id: "features", label: "Features" },
    { id: "howItWorks", label: "How It Works" },
    { id: "stats", label: "Stats" },
    { id: "cta", label: "CTA" },
    { id: "seo", label: "SEO" },
  ];

  // --- Editor view ---
  if (editingSolution !== null) {
    const accent = form.accentColor || "#0EA5E9";
    return (
      <div className="space-y-0 -m-8">
        {/* Editor header */}
        <div className="flex items-center justify-between px-8 py-4 border-b bg-background sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => { setEditingSolution(null); setForm({}); }} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" /> Solutions
            </button>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-semibold">{form.name || "New Solution"}</span>
            <Badge variant={form.status === "published" ? "default" : "secondary"} className={form.status === "published" ? "bg-green-500 text-white" : ""}>{form.status || "draft"}</Badge>
          </div>
          <div className="flex items-center gap-2">
            {form.slug && editingSolution.id ? (
              <a href={`/solutions/${form.slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-input rounded-md px-3 py-1.5 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" /> Preview
              </a>
            ) : null}
            <Button size="sm" variant="outline" onClick={() => set("status", form.status === "published" ? "draft" : "published")}>
              {form.status === "published" ? "Unpublish" : "Publish"}
            </Button>
            <Button size="sm" onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending} className="bg-[#E63950] hover:bg-[#B52C3E] text-white">
              {saveMutation.isPending ? "Saving..." : editingSolution.id ? "Save Changes" : "Create Solution"}
            </Button>
          </div>
        </div>

        <div className="flex min-h-[calc(100vh-130px)]">
          {/* Section tabs sidebar */}
          <div className="w-44 border-r bg-muted/30 flex flex-col py-4 px-2 gap-0.5 shrink-0">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === t.id ? "bg-[#E63950]/10 text-[#E63950]" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 p-8 overflow-y-auto space-y-6 max-w-3xl">
            {activeTab === "basic" && (
              <>
                <h3 className="font-semibold text-lg">Basic Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Solution Name *</label>
                    <Input value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} placeholder="e.g. AeroSoft OS" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Slug (URL) *</label>
                    <Input value={form.slug ?? ""} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))} placeholder="e.g. hvac" />
                    <p className="text-xs text-muted-foreground mt-1">Public URL: /solutions/{form.slug || "slug"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tagline</label>
                    <Input value={form.tagline ?? ""} onChange={(e) => set("tagline", e.target.value)} placeholder="e.g. HVAC Control Hub" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Badge Label</label>
                    <Input value={form.badge ?? ""} onChange={(e) => set("badge", e.target.value)} placeholder="e.g. HVAC Field Service" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Logo Text</label>
                    <Input value={form.logoText ?? ""} onChange={(e) => set("logoText", e.target.value)} placeholder="e.g. AeroSoft" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Accent Color</label>
                    <div className="flex gap-2 items-center">
                      <input type="color" value={form.accentColor ?? "#0EA5E9"} onChange={(e) => set("accentColor", e.target.value)} className="w-10 h-9 rounded border border-input cursor-pointer" />
                      <Input value={form.accentColor ?? ""} onChange={(e) => set("accentColor", e.target.value)} placeholder="#0EA5E9" className="flex-1" />
                    </div>
                    <div className="mt-2 h-8 rounded-md flex items-center justify-center text-xs text-white font-bold" style={{ background: accent }}>
                      Preview: {form.name || "Solution"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Sort Order</label>
                    <Input type="number" value={form.sortOrder ?? 0} onChange={(e) => set("sortOrder", parseInt(e.target.value) || 0)} placeholder="0" />
                    <p className="text-xs text-muted-foreground mt-1">Lower numbers appear first</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select value={form.status ?? "draft"} onChange={(e) => set("status", e.target.value)} className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background">
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {activeTab === "hero" && (
              <>
                <h3 className="font-semibold text-lg">Hero Section</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Headline *</label>
                    <Input value={form.heroHeadline ?? ""} onChange={(e) => set("heroHeadline", e.target.value)} placeholder="e.g. Stop Losing Jobs to WhatsApp Chaos" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Subheadline</label>
                    <Textarea rows={3} value={form.heroSubheadline ?? ""} onChange={(e) => set("heroSubheadline", e.target.value)} placeholder="Describe what the solution does in 2-3 sentences..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Primary CTA Button</label>
                      <Input value={form.heroCta ?? ""} onChange={(e) => set("heroCta", e.target.value)} placeholder="Book a Demo" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Secondary CTA Button</label>
                      <Input value={form.heroCtaSecondary ?? ""} onChange={(e) => set("heroCtaSecondary", e.target.value)} placeholder="See Features" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Hero Image URL (optional)</label>
                    <Input value={form.heroImage ?? ""} onChange={(e) => set("heroImage", e.target.value)} placeholder="https://..." />
                    {form.heroImage && <img src={form.heroImage} alt="Hero preview" className="mt-2 rounded-lg max-h-40 object-cover w-full" />}
                  </div>
                </div>
              </>
            )}

            {activeTab === "painPoints" && (
              <>
                <h3 className="font-semibold text-lg">Pain Points <span className="text-muted-foreground text-sm font-normal">("Does this sound familiar?" section)</span></h3>
                <p className="text-sm text-muted-foreground">Add the problems your target customers face. These show on the dark background section.</p>
                <RepeaterEditor
                  value={form.painPoints ?? "[]"}
                  onChange={(v) => set("painPoints", v)}
                  addLabel="Add pain point"
                  fields={[
                    { key: "icon", label: "Emoji Icon", placeholder: "💬" },
                    { key: "title", label: "Title", placeholder: "Complaints lost in WhatsApp groups" },
                    { key: "description", label: "Description", placeholder: "Describe the problem...", multiline: true },
                  ]}
                />
              </>
            )}

            {activeTab === "features" && (
              <>
                <h3 className="font-semibold text-lg">Features <span className="text-muted-foreground text-sm font-normal">("What You Get" section)</span></h3>
                <p className="text-sm text-muted-foreground">Add the key features/capabilities of the solution. Shown as a grid of cards.</p>
                <RepeaterEditor
                  value={form.features ?? "[]"}
                  onChange={(v) => set("features", v)}
                  addLabel="Add feature"
                  fields={[
                    { key: "icon", label: "Emoji Icon", placeholder: "🎫" },
                    { key: "title", label: "Feature Name", placeholder: "Smart Complaint Management" },
                    { key: "description", label: "Description", placeholder: "Describe what this feature does...", multiline: true },
                  ]}
                />
              </>
            )}

            {activeTab === "howItWorks" && (
              <>
                <h3 className="font-semibold text-lg">How It Works <span className="text-muted-foreground text-sm font-normal">("Step by step" section)</span></h3>
                <p className="text-sm text-muted-foreground">Add numbered steps showing how the solution works from start to finish.</p>
                <RepeaterEditor
                  value={form.howItWorks ?? "[]"}
                  onChange={(v) => set("howItWorks", v)}
                  addLabel="Add step"
                  fields={[
                    { key: "step", label: "Step Number", placeholder: "01" },
                    { key: "title", label: "Step Title", placeholder: "Customer logs a complaint" },
                    { key: "description", label: "Step Description", placeholder: "Explain what happens in this step...", multiline: true },
                  ]}
                />
              </>
            )}

            {activeTab === "stats" && (
              <>
                <h3 className="font-semibold text-lg">Stats Bar <span className="text-muted-foreground text-sm font-normal">(Key metrics shown below the hero)</span></h3>
                <p className="text-sm text-muted-foreground">Add 2–4 impressive numbers that will be shown in a stats bar below the hero section.</p>
                <RepeaterEditor
                  value={form.stats ?? "[]"}
                  onChange={(v) => set("stats", v)}
                  addLabel="Add stat"
                  fields={[
                    { key: "value", label: "Value", placeholder: "60%" },
                    { key: "label", label: "Label", placeholder: "Reduction in customer calls" },
                  ]}
                />
              </>
            )}

            {activeTab === "cta" && (
              <>
                <h3 className="font-semibold text-lg">Call to Action Section</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">CTA Headline</label>
                    <Input value={form.ctaHeadline ?? ""} onChange={(e) => set("ctaHeadline", e.target.value)} placeholder="Ready to get started?" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CTA Subheadline</label>
                    <Textarea rows={2} value={form.ctaSubheadline ?? ""} onChange={(e) => set("ctaSubheadline", e.target.value)} placeholder="A compelling reason to act now..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CTA Button Text</label>
                    <Input value={form.ctaButtonText ?? ""} onChange={(e) => set("ctaButtonText", e.target.value)} placeholder="Book a Demo" />
                  </div>
                </div>
              </>
            )}

            {activeTab === "seo" && (
              <>
                <h3 className="font-semibold text-lg">SEO Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Meta Title</label>
                    <Input value={form.metaTitle ?? ""} onChange={(e) => set("metaTitle", e.target.value)} placeholder="Overrides page title in search results" />
                    <p className="text-xs text-muted-foreground mt-1">{(form.metaTitle?.length ?? 0)}/60 chars recommended</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Meta Description</label>
                    <Textarea rows={3} value={form.metaDescription ?? ""} onChange={(e) => set("metaDescription", e.target.value)} placeholder="Appears in Google search results under the page title. Aim for 150-160 chars." />
                    <p className="text-xs text-muted-foreground mt-1">{(form.metaDescription?.length ?? 0)}/160 chars recommended</p>
                  </div>
                </div>
              </>
            )}

            <div className="pt-4 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setEditingSolution(null); setForm({}); }}>Cancel</Button>
              <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending} className="bg-[#E63950] hover:bg-[#B52C3E] text-white">
                {saveMutation.isPending ? "Saving..." : editingSolution.id ? "Save Changes" : "Create Solution"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- List view ---
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-2"><Layers className="w-7 h-7 text-[#E63950]" /> Solutions</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage solution landing pages. Each solution gets its own full-page site at /solutions/slug.</p>
        </div>
        <Button onClick={openNew} className="bg-[#E63950] hover:bg-[#B52C3E] text-white">
          <Plus className="w-4 h-4 mr-2" /> New Solution
        </Button>
      </div>

      {isLoading && <p className="text-muted-foreground">Loading...</p>}

      {!isLoading && solutions && solutions.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <Layers className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-medium mb-1">No solutions yet</p>
          <p className="text-sm">Create your first solution landing page.</p>
          <Button onClick={openNew} className="mt-4 bg-[#E63950] hover:bg-[#B52C3E] text-white"><Plus className="w-4 h-4 mr-2" /> Create Solution</Button>
        </div>
      )}

      <div className="grid gap-4">
        {solutions?.map((sol) => {
          const accent = sol.accentColor || "#0EA5E9";
          return (
            <div key={sol.id} className="flex items-center gap-4 p-5 rounded-xl border bg-background hover:shadow-sm transition-shadow">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center font-display font-extrabold text-base text-white shrink-0" style={{ background: accent }}>
                {sol.logoText?.[0] ?? sol.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-display font-bold text-base">{sol.name}</span>
                  <Badge variant={sol.status === "published" ? "default" : "secondary"} className={`text-[10px] ${sol.status === "published" ? "bg-green-500 text-white" : ""}`}>
                    {sol.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">{sol.tagline}</p>
                <p className="text-xs text-muted-foreground/60 mt-0.5 font-mono">/solutions/{sol.slug}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a href={`/solutions/${sol.slug}`} target="_blank" rel="noopener noreferrer" title="View page" className="p-2 hover:bg-accent rounded-md transition-colors">
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </a>
                <button type="button" title="Duplicate" onClick={() => duplicateMutation.mutate(sol.id)} className="p-2 hover:bg-accent rounded-md transition-colors">
                  <Copy className="w-4 h-4 text-muted-foreground" />
                </button>
                <Button size="sm" variant="outline" onClick={() => openEdit(sol)}>
                  <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit
                </Button>
                <button type="button" onClick={() => { if (confirm("Delete this solution?")) deleteMutation.mutate(sol.id); }} className="p-2 hover:bg-destructive/10 rounded-md text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
