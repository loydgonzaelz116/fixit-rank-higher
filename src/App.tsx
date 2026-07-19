import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import FreeChecklist from "@/pages/FreeChecklist";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import AdminNewPost from "@/pages/AdminNewPost";
import AdminBlogEditor from "@/pages/AdminBlogEditor";
import AdminContentMachine from "@/pages/AdminContentMachine";
import AdminPrompts from "@/pages/AdminPrompts";
import ComingSoon from "@/pages/ComingSoon";
import PermitCalculator from "@/pages/PermitCalculator";
import Calculators from "@/pages/Calculators";
import CalculatorEmbed from "@/pages/CalculatorEmbed";
import SprayFoamCalculator from "@/pages/SprayFoamCalculator";
import NotFound from "@/pages/NotFound";
import ServiceLocationPage from "@/pages/ServiceLocationPage";
import Directory from "@/pages/Directory";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/free-checklist" element={<FreeChecklist />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/new-post" element={<AdminNewPost />} />
            <Route path="/admin/blog-editor" element={<AdminBlogEditor />} />
            <Route path="/admin/content-machine" element={<AdminContentMachine />} />
            <Route path="/admin/prompts" element={<AdminPrompts />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/permit-calculator" element={<PermitCalculator />} />
            <Route path="/calculators" element={<Calculators />} />
            <Route path="/calculator/:trade" element={<CalculatorEmbed />} />
            <Route path="/spray-foam-insulation-cost-calculator" element={<SprayFoamCalculator />} />
            <Route path="/directory" element={<Directory />} />
            <Route path="/:service/:state/:county" element={<ServiceLocationPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
