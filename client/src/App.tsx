import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import MainLayout from "@/components/layout/MainLayout";
import Dashboard from "@/pages/dashboard";
import EmployeesList from "@/pages/employees/index";
import AddEmployee from "@/pages/employees/add";
import ViewEmployee from "@/pages/employees/view";
import OrganizationPage from "@/pages/organization/index";
import ContractsPage from "@/pages/contracts/index";
import CompensationPage from "@/pages/compensation/index";
import BenefitsPage from "@/pages/benefits/index";
import WorkflowsPage from "@/pages/workflows/index";
import SettingsPage from "@/pages/settings/index";

function Router() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/employees" component={EmployeesList} />
        <Route path="/employees/add" component={AddEmployee} />
        <Route path="/employees/:id" component={ViewEmployee} />
        <Route path="/organization" component={OrganizationPage} />
        <Route path="/contracts" component={ContractsPage} />
        <Route path="/compensation" component={CompensationPage} />
        <Route path="/benefits" component={BenefitsPage} />
        <Route path="/workflows" component={WorkflowsPage} />
        <Route path="/settings" component={SettingsPage} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
