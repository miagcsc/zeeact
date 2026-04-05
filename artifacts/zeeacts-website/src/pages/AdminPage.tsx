import { useState, useEffect } from "react";
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
  CheckCircle2
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
import { useQueryClient } from "@tanstack/react-query";
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

type View = "dashboard" | "services" | "portfolio" | "testimonials" | "contacts" | "settings";

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
                  <FormLabel>Hero Badge Text</FormLabel>
                  <Input name="heroBadge" value={formValues.heroBadge || ""} onChange={handleChange} placeholder="IT Solutions · SaaS · AI Consultancy" />
                </div>
                <div>
                  <FormLabel>Hero Headline</FormLabel>
                  <Textarea name="heroHeadline" value={formValues.heroHeadline || ""} onChange={handleChange} placeholder="Software That Builds. AI That Scales." rows={2} />
                  <p className="text-xs text-muted-foreground mt-1">Use HTML tags for styling if needed.</p>
                </div>
                <div>
                  <FormLabel>Hero Subheadline</FormLabel>
                  <Textarea name="heroSubheadline" value={formValues.heroSubheadline || ""} onChange={handleChange} placeholder="ZeeActs delivers custom software..." rows={3} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-lg border-b pb-2">About Section</h3>
              <div className="grid gap-4">
                <div>
                  <FormLabel>About Title</FormLabel>
                  <Input name="aboutTitle" value={formValues.aboutTitle || ""} onChange={handleChange} />
                </div>
                <div>
                  <FormLabel>About Body (HTML)</FormLabel>
                  <Textarea name="aboutBody" value={formValues.aboutBody || ""} onChange={handleChange} rows={5} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FormLabel>Founder Name</FormLabel>
                    <Input name="founderName" value={formValues.founderName || ""} onChange={handleChange} />
                  </div>
                  <div>
                    <FormLabel>Founder Bio Quote</FormLabel>
                    <Textarea name="founderBio" value={formValues.founderBio || ""} onChange={handleChange} rows={2} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-lg border-b pb-2">General</h3>
              <div>
                <FormLabel>Contact Email</FormLabel>
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
