
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/components/ui/sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { schemes } from "@/lib/mock-data";
import { Save, X } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  age: z.coerce.number().min(0, { message: "Age must be a positive number." }),
  gender: z.enum(["male", "female", "other"], { required_error: "Gender is required." }),
  contact: z.string().min(5, { message: "Contact must be at least 5 characters." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  medicalHistory: z.string(),
  disease: z.string().min(1, { message: "Disease/Condition is required." }),
  additionalNotes: z.string().optional(),
  income: z.coerce.number().min(0, { message: "Income must be a positive number." }),
  category: z.enum(["general", "obc", "sc", "st"], { required_error: "Category is required." }),
  insuranceStatus: z.boolean().default(false),
});

const PatientEntry = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: 0,
      gender: "male",
      address: "",
      contact: "",
      medicalHistory: "",
      disease: "",
      additionalNotes: "",
      income: 0,
      category: "general",
      insuranceStatus: false,
    },
  });

  const [eligibleSchemes, setEligibleSchemes] = React.useState<typeof schemes>([]);

  // Find eligible schemes whenever form values change
  React.useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (value.age && value.income && value.gender && value.category && value.disease) {
        const eligible = schemes.filter(scheme => {
          const { eligibilityCriteria } = scheme;
          
          // Check age criteria
          if (eligibilityCriteria.age) {
            if (eligibilityCriteria.age.min && value.age < eligibilityCriteria.age.min) return false;
            if (eligibilityCriteria.age.max && value.age > eligibilityCriteria.age.max) return false;
          }
          
          // Check income criteria
          if (eligibilityCriteria.income && value.income > eligibilityCriteria.income.max) return false;
          
          // Check category criteria
          if (eligibilityCriteria.category && !eligibilityCriteria.category.includes(value.category)) return false;
          
          // Check gender criteria
          if (eligibilityCriteria.gender && !eligibilityCriteria.gender.includes(value.gender)) return false;
          
          return true;
        });
        
        setEligibleSchemes(eligible);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // In a real app, this would send the data to an API
    console.log("Form data:", data);
    console.log("Eligible schemes:", eligibleSchemes);
    
    toast.success("Patient details saved successfully", {
      description: `${eligibleSchemes.length} eligible schemes identified`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Patient Registration</h1>
          <p className="text-muted-foreground">
            Register a new patient and identify eligible schemes
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
              <CardDescription>
                Enter the patient's basic details and medical information
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name*</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age*</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender*</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Number*</FormLabel>
                          <FormControl>
                            <Input placeholder="555-123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="123 Main St, City, State"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="disease"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Disease/Condition*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select disease/condition" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="diabetes">Diabetes</SelectItem>
                            <SelectItem value="hypertension">Hypertension</SelectItem>
                            <SelectItem value="tuberculosis">Tuberculosis</SelectItem>
                            <SelectItem value="malaria">Malaria</SelectItem>
                            <SelectItem value="dengue">Dengue</SelectItem>
                            <SelectItem value="covid19">COVID-19</SelectItem>
                            <SelectItem value="cancer">Cancer</SelectItem>
                            <SelectItem value="heartdisease">Heart Disease</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="medicalHistory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medical History</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any pre-existing conditions or allergies"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="additionalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter any additional information"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="income"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Annual Income</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="general">General</SelectItem>
                              <SelectItem value="obc">OBC</SelectItem>
                              <SelectItem value="sc">SC</SelectItem>
                              <SelectItem value="st">ST</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="insuranceStatus"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Has Health Insurance</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Does the patient have any existing health insurance?
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button type="submit" className="bg-healthcare-600 hover:bg-healthcare-700">
                    <Save className="mr-2 h-4 w-4" /> Register Patient
                  </Button>
                  <Button type="reset" variant="outline">
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Eligible Schemes</CardTitle>
              <CardDescription>
                Based on the patient's information, these schemes are eligible
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {eligibleSchemes.length > 0 ? (
                eligibleSchemes.map((scheme) => (
                  <div
                    key={scheme.id}
                    className="rounded-lg border p-4 transition-all hover:bg-accent"
                  >
                    <h3 className="font-semibold">{scheme.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {scheme.description}
                    </p>
                    <div className="mt-2">
                      <Label className="text-xs">Benefits:</Label>
                      <ul className="mt-1 space-y-1">
                        {scheme.benefits.map((benefit, index) => (
                          <li key={index} className="text-xs text-muted-foreground flex items-start">
                            <div className="mr-2 mt-0.5 h-1.5 w-1.5 rounded-full bg-healthcare-500"></div>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-2">
                      <Label className="text-xs">Required Documents:</Label>
                      <ul className="mt-1 space-y-1">
                        {scheme.documents.map((document, index) => (
                          <li key={index} className="text-xs text-muted-foreground flex items-start">
                            <div className="mr-2 mt-0.5 h-1.5 w-1.5 rounded-full bg-healthcare-500"></div>
                            {document}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed">
                  <div className="text-center">
                    <p className="text-sm font-medium">No eligible schemes found</p>
                    <p className="text-xs text-muted-foreground">
                      Complete the patient details to check eligibility
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientEntry;
