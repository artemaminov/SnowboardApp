import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bindingProfileFormSchema, type InsertBindingProfile, type BindingProfile } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Save, Download } from "lucide-react";

export default function ProfileManagement() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const parentForm = useFormContext<InsertBindingProfile>();

  // Local form just for the profile name
  const nameForm = useForm<{ name: string }>({
    resolver: zodResolver(bindingProfileFormSchema.pick({ name: true })),
    defaultValues: {
      name: "",
    },
  });

  const { data: profiles } = useQuery<BindingProfile[]>({
    queryKey: ["/api/profiles"],
  });

  const createProfile = useMutation({
    mutationFn: async (data: InsertBindingProfile) => {
      await apiRequest("POST", "/api/profiles", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profiles"] });
      setDialogOpen(false);
      nameForm.reset();
      toast({
        title: "Profile Created",
        description: "Your binding profile has been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save profile",
      });
    },
  });

  const deleteProfile = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/profiles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profiles"] });
      toast({
        title: "Profile Deleted",
        description: "The binding profile has been removed.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete profile",
      });
    },
  });

  const onSubmit = (nameData: { name: string }) => {
    // Get current values from parent form
    const currentValues = parentForm.getValues();

    // Combine name with current binding settings
    const profileData: InsertBindingProfile = {
      ...currentValues,
      name: nameData.name,
    };

    createProfile.mutate(profileData);
  };

  const exportProfile = (profile: BindingProfile) => {
    const data = JSON.stringify(profile, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${profile.name}-binding-profile.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Saved Profiles</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Save Profile
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Binding Profile</DialogTitle>
            </DialogHeader>
            <Form {...nameForm}>
              <form onSubmit={nameForm.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={nameForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Park Setup" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={createProfile.isPending}
                >
                  {createProfile.isPending ? "Saving..." : "Save Profile"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles?.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell>{profile.name}</TableCell>
                <TableCell>
                  {new Date(profile.lastModified).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => exportProfile(profile)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={deleteProfile.isPending}
                      onClick={() => deleteProfile.mutate(profile.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}