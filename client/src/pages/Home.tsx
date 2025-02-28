import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BindingCanvas from "@/components/BindingCanvas";
import BindingForm from "@/components/BindingForm";
import ProfileManagement from "@/components/ProfileManagement";
import { Snowflake } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bindingProfileFormSchema, type InsertBindingProfile } from "@shared/schema";

const defaultValues: InsertBindingProfile = {
  name: "",
  frontAngle: 15,
  backAngle: -15,
  stanceWidth: 50,
  setback: 0,
  bootSize: 9,
  riderWeight: 70,
  riderHeight: 175,
  boardType: "standard",
  highbackHeight: 5,
  bindingStiffness: 5,
};

export default function Home() {
  const form = useForm<InsertBindingProfile>({
    resolver: zodResolver(bindingProfileFormSchema),
    defaultValues,
  });

  return (
    <FormProvider {...form}>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Snowflake className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Snowboard Binding Setup</h1>
          </div>

          <div className="grid md:grid-cols-[1fr,400px] gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Board Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <BindingCanvas />
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Tabs defaultValue="settings" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
                  <TabsTrigger value="profiles" className="flex-1">Profiles</TabsTrigger>
                </TabsList>
                <TabsContent value="settings">
                  <Card>
                    <CardContent className="pt-6">
                      <BindingForm />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="profiles">
                  <Card>
                    <CardContent className="pt-6">
                      <ProfileManagement />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}