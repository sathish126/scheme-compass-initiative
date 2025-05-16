
import React from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import DashboardLayout from "@/components/DashboardLayout";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Patient, Scheme } from "@/types";
import { savePatient } from "@/utils/localStorageUtils";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  age: z.coerce.number().min(0, {
    message: "Age must be a positive number.",
  }),
  gender: z.enum(["male", "female", "other"], {
    required_error: "You need to select a gender.",
  }),
  address: z.string().min(10, {
    message: "Address must be at least 10 characters.",
  }),
  contact: z.string().regex(/^(\+?\d{1,4}[-.\s]?)?(\(?\d{1,}\)?[-.\s]?)?(\d{1,}[-.\s]?){1,}$/, {
    message: "Invalid phone number format.",
  }),
  medicalHistory: z.string().optional(),
  income: z.coerce.number().min(0, {
    message: "Income must be a positive number.",
  }),
  category: z.enum(["general", "obc", "sc", "st"], {
    required_error: "You need to select a category.",
  }),
  insuranceStatus: z.boolean().default(false),
  disease: z.string().min(3, {
    message: "Disease must be at least 3 characters.",
  }),
});

const PatientEntry = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      age: 0,
      gender: "male",
      address: "",
      contact: "",
      medicalHistory: "",
      income: 0,
      category: "general",
      insuranceStatus: false,
      disease: ""
    },
  });

  function findEligibleSchemes(patientData: any): Scheme[] {
    // Get all schemes from localStorage
    const schemes = JSON.parse(localStorage.getItem('schemes') || '[]');
    
    // Filter schemes based on eligibility criteria
    return schemes.filter((scheme: Scheme) => {
      const { eligibilityCriteria } = scheme;
      
      // Check income criteria
      if (eligibilityCriteria.income && patientData.income > eligibilityCriteria.income.max) {
        return false;
      }
      
      // Check age criteria
      if (eligibilityCriteria.age) {
        if (eligibilityCriteria.age.min && patientData.age < eligibilityCriteria.age.min) {
          return false;
        }
        if (eligibilityCriteria.age.max && patientData.age > eligibilityCriteria.age.max) {
          return false;
        }
      }
      
      // Check gender criteria
      if (eligibilityCriteria.gender && !eligibilityCriteria.gender.includes(patientData.gender)) {
        return false;
      }
      
      // Check category criteria
      if (eligibilityCriteria.category && !eligibilityCriteria.category.includes(patientData.category)) {
        return false;
      }
      
      return true;
    });
  }

  const handlePatientSubmit = async (data: z.infer<typeof FormSchema>) => {
    // Convert age and income to numbers
    data.age = Number(data.age);
    data.income = Number(data.income);

    // Find eligible schemes
    const eligibleSchemes = findEligibleSchemes(data);

    // Save patient data to localStorage
    const patientData: Omit<Patient, "id" | "createdAt"> = {
      name: data.name,
      age: data.age,
      gender: data.gender,
      address: data.address,
      contact: data.contact,
      medicalHistory: data.medicalHistory || "",
      income: data.income,
      category: data.category,
      insuranceStatus: data.insuranceStatus,
      disease: data.disease,
      updatedBy: user?.id || "unknown",
      recommendedSchemes: eligibleSchemes
    };
    
    savePatient(patientData);
    
    toast({
      title: "Patient entry successful!",
      description: "Patient data has been saved and is awaiting approval.",
    });
    
    navigate("/facility-dashboard");
  };

  return (
    <DashboardLayout>
      <div className="container max-w-4xl mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Patient Entry Form</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handlePatientSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Patient Name" {...field} />
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
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Age"
                            {...field}
                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Gender</FormLabel>
                        <FormDescription>
                          What is the patient's gender?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-row space-x-2"
                        >
                          <FormItem className="flex items-center space-x-1">
                            <RadioGroupItem value="male" id="male" />
                            <Label htmlFor="male">Male</Label>
                          </FormItem>
                          <FormItem className="flex items-center space-x-1">
                            <RadioGroupItem value="female" id="female" />
                            <Label htmlFor="female">Female</Label>
                          </FormItem>
                          <FormItem className="flex items-center space-x-1">
                            <RadioGroupItem value="other" id="other" />
                            <Label htmlFor="other">Other</Label>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Patient Address"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Contact Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="income"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Income</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Annual Income"
                            {...field}
                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="medicalHistory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medical History</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Relevant Medical History"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Category</FormLabel>
                        <FormDescription>
                          Select patient category
                        </FormDescription>
                      </div>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-row space-x-2"
                        >
                          <FormItem className="flex items-center space-x-1">
                            <RadioGroupItem value="general" id="general" />
                            <Label htmlFor="general">General</Label>
                          </FormItem>
                          <FormItem className="flex items-center space-x-1">
                            <RadioGroupItem value="obc" id="obc" />
                            <Label htmlFor="obc">OBC</Label>
                          </FormItem>
                          <FormItem className="flex items-center space-x-1">
                            <RadioGroupItem value="sc" id="sc" />
                            <Label htmlFor="sc">SC</Label>
                          </FormItem>
                          <FormItem className="flex items-center space-x-1">
                            <RadioGroupItem value="st" id="st" />
                            <Label htmlFor="st">ST</Label>
                          </FormItem>
                        </RadioGroup>
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
                      <FormLabel>Disease</FormLabel>
                      <FormControl>
                        <Input placeholder="Disease" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PatientEntry;
