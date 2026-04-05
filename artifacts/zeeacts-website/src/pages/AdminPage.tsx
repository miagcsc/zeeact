import { useState, useEffect } from "react";
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

type View = "dashboard" | "services" | "portfolio" | "testimonials" | "contacts" | "settings" | "blog" | "seo" | "analytics";

export default function AdminPage() {
  const [activeView, setActiveView] = useState<View>("dashboard");
  const { user } = useUser();
  const { signOut } = useClerk();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "services", label: "Services", icon: Briefcase },
    { id: "portfolio", label: "Portfolio", icon: FolderKanban },
    { id: "testimonials", label: "Testimonials", icon: MessageSquareQuote },
    { id: "contacts", label: "Contacts", icon: Mails },
    { id: "blog", label: "Blog", icon: FileText },
    { id: "seo", label: "SEO", icon: Search },
    { id: "analytics", label: "Analytics", icon: BarChart2 },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const;

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0A0A0F] border-r border-white/10 flex flex-col">
        <div className="h-[68px] flex items-center px-6 border-b border-white/10">
          <span className="font-display font-extrabold text-2xl text-white">
            Zee<span className="text-[#E63950]">Acts</span>
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeView === item.id
                  ? "bg-[#E63950] text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-bold">
              {user?.firstName?.[0] || "A"}
            </div>
            <div className="flex-1 truncate">
              <div className="text-sm font-medium text-white truncate">{user?.fullName || "Admin User"}</div>
              <div className="text-xs text-white/50 truncate">{user?.primaryEmailAddress?.emailAddress}</div>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {activeView === "dashboard" && <DashboardView />}
          {activeView === "services" && <ServicesView />}
          {activeView === "portfolio" && <PortfolioView />}
          {activeView === "testimonials" && <TestimonialsView />}
          {activeView === "contacts" && <ContactsView />}
          {activeView === "blog" && <BlogView />}
          {activeView === "seo" && <SeoView />}
          {activeView === "analytics" && <AnalyticsView />}
          {activeView === "settings" && <SettingsView />}
        </div>
      </main>
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
                    <FormLabel>Cover Image URL</FormLabel>
                    <FormControl><Input {...field} placeholder="https://..." /></FormControl>
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
                <Input name="contactEmail" value={formValues.contactEmail || ""} onChange={handleChange} />
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
