"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function SignUp() {
  const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // const [formData,setFormData] = useState({
  //   email:"",
  //   password:""
  // })

  // const [formDataError,setFormDataError] = useState({
  //   email:"",
  //   password:""
  // })

  const formSchema = z.object({
    name: z.string(),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // const handleOnChange=(name:string,value:string):void=>{

  //   if(name === "email" || name === "password"){
  //        if(value === ""){
  //         setFormDataError((prev)=>({
  //           ...prev,
  //           [name]:"These fields are required"
  //         }))
  //        }
  //   }
  //        setFormData((prev)=>({
  //         ...prev,
  //         [name]:value
  //        }))
  // }

  // const handleSubmit=async()=>{
  //   if(Object.values(formDataError).some((item)=>item !== "")) return
  //   console.log(formData)
  // }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URI}/auth/email-signup`,
        values
      );

      console.log(response)
      if (response.data.success) {
        toast("User Created Successfully")
        router.push("/sign-in");
        return
      } 
      toast(response.data.message || "SignUp Failed")
    } catch (error: any) {
      console.log("signup error", error);
      toast(error.response.data.message || error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Your Account
        </h1>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Name</FormLabel>
                  <FormControl>
                    <Input
                      type="name"
                      placeholder="Enter your email"
                      className="h-11 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="h-11 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="h-11 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-11 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Loading" : "Sign Up"}
              {/* Sign Up */}
            </Button>

            <p className="text-center text-gray-600 text-sm">
              Already have an account?{" "}
              <span
                onClick={() => router.push("/sign-in")}
                className="text-blue-600 font-medium cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}
