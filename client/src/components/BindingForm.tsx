import { useFormContext } from "react-hook-form";
import type { InsertBindingProfile } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function BindingForm() {
  const form = useFormContext<InsertBindingProfile>();

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField
          control={form.control}
          name="frontAngle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Front Binding Angle ({field.value}°)</FormLabel>
              <FormControl>
                <Slider
                  min={-45}
                  max={45}
                  step={1}
                  value={[field.value]}
                  onValueChange={([value]) => field.onChange(value)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="backAngle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Back Binding Angle ({field.value}°)</FormLabel>
              <FormControl>
                <Slider
                  min={-45}
                  max={45}
                  step={1}
                  value={[field.value]}
                  onValueChange={([value]) => field.onChange(value)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stanceWidth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stance Width ({field.value}cm)</FormLabel>
              <FormControl>
                <Slider
                  min={35}
                  max={65}
                  step={1}
                  value={[field.value]}
                  onValueChange={([value]) => field.onChange(value)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="setback"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Setback ({field.value}cm)</FormLabel>
              <FormControl>
                <Slider
                  min={-10}
                  max={10}
                  step={0.5}
                  value={[field.value]}
                  onValueChange={([value]) => field.onChange(value)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="bootSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Boot Size</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="boardType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Board Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="wide">Wide</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="riderWeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rider Weight (kg)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="riderHeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rider Height (cm)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}