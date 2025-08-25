import DashboardLayout from "@/shared/components/layout/DashboardLayout";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Badge } from "@/shared/components/ui/badge";

export default function DashboardDemo() {
  return (
    <DashboardLayout title="Demo Dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
              Quick preview of available UI components.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2 items-center">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Badge>Badge</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tabs and Input</CardTitle>
            <CardDescription>Interactive elements.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="one" className="w-full">
              <TabsList>
                <TabsTrigger value="one">One</TabsTrigger>
                <TabsTrigger value="two">Two</TabsTrigger>
              </TabsList>
              <TabsContent value="one" className="space-y-2">
                <Input placeholder="Type here" />
              </TabsContent>
              <TabsContent value="two">Second tab content</TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
