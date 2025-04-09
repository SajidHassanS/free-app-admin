import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LabelInputContainer from "../LabelInputContainer";
import { useContextConsumer } from "@/context/Context";
import {
  useCreateNewSupplier,
  useUpdateSupplier,
} from "@/hooks/apis/useSupplier";
import { addNewSupplierFormSchema } from "@/schemas/FormsValidation";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

const AddSupplierForm = ({
  supplier,
  mode,
  onClose,
}: {
  showInsList?: boolean;
  supplier: any;
  mode: "add" | "view" | "edit";
  onClose: () => void;
}) => {
  const isViewMode = mode === "view";
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [confirmShowPassword, setConfirmShowPassword] =
    useState<boolean>(false);
  const { token } = useContextConsumer();
  const { mutate: addNewSupplier, isPending: loading } = useCreateNewSupplier();
  const { mutate: updateSupplier, isPending: updating } = useUpdateSupplier();

  const form = useForm<z.infer<typeof addNewSupplierFormSchema>>({
    resolver: zodResolver(addNewSupplierFormSchema),
    defaultValues: {
      username: "",
      countryCode: "+92",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { reset } = form;
  useEffect(() => {
    if (supplier) {
      reset({
        username: supplier.username || "",
        countryCode: supplier.countryCode || "",
        phone: supplier.phone || "",
        password: supplier.password || "",
        confirmPassword: supplier.confirmPassword || "",
      });
    }
  }, [supplier, reset]);

  const onSubmit = (data: z.infer<typeof addNewSupplierFormSchema>) => {
    if (mode === "add") {
      addNewSupplier(
        { data, token },
        {
          onSuccess: (log) => {
            if (log?.success) {
              onClose();
            }
          },
        }
      );
    } else if (mode === "edit") {
      const updatedData = {
        data: { username: data.username, uuid: supplier?.uuid },
        token,
      };
      updateSupplier(updatedData, {
        onSuccess: (log) => {
          if (log?.success) {
            onClose();
          }
        },
      });
    }
  };

  return (
    <>
      <Form {...form}>
        <form className="2" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3 mb-4">
            <LabelInputContainer>
              <Label htmlFor="full_name">Username</Label>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isViewMode}
                        placeholder="Username"
                        type="text"
                        className="outline-none focus:border-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label>Country Code</Label>
              <FormField
                control={form.control}
                name="countryCode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isViewMode}
                        placeholder="+92"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label>Phone</Label>
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isViewMode}
                        placeholder="3123456789"
                        type="tel"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="password">Password</Label>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className="outline-none focus:border-primary"
                        {...field}
                      />
                    </FormControl>
                    {!showPassword ? (
                      <Icon
                        name="Eye"
                        size={18}
                        className={cn(
                          "absolute right-3.5 -translate-y-1/2 cursor-pointer text-gray-400",
                          !!form.formState.errors.password
                            ? "top-[20%]"
                            : "top-[32%]"
                        )}
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    ) : (
                      <Icon
                        name="EyeOff"
                        size={20}
                        className={cn(
                          "absolute right-3.5 -translate-y-1/2 cursor-pointer text-gray-400",
                          !!form.formState.errors.password
                            ? "top-[20%]"
                            : "top-[32%]"
                        )}
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        type={confirmShowPassword ? "text" : "password"}
                        id="confirmPassword"
                        className="outline-none focus:border-primary"
                        {...field}
                      />
                    </FormControl>
                    {!confirmShowPassword ? (
                      <Icon
                        name="Eye"
                        size={18}
                        className={cn(
                          "absolute right-3.5 -translate-y-1/2 cursor-pointer text-gray-400",
                          !!form.formState.errors.password
                            ? "top-[20%]"
                            : "top-[20%]"
                        )}
                        onClick={() =>
                          setConfirmShowPassword(!confirmShowPassword)
                        }
                      />
                    ) : (
                      <Icon
                        name="EyeOff"
                        size={20}
                        className={cn(
                          "absolute right-3.5 -translate-y-1/2 cursor-pointer text-gray-400",
                          !!form.formState.errors.password
                            ? "top-[20%]"
                            : "top-[20%]"
                        )}
                        onClick={() =>
                          setConfirmShowPassword(!confirmShowPassword)
                        }
                      />
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </LabelInputContainer>
          </div>
          <Button
            className="w-full text-white font-medium mt-4"
            type="submit"
            disabled={isViewMode || loading || updating}
          >
            {mode === "add" ? "Create" : "Update"}
          </Button>
          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent mt-6 h-[1px] w-full" />
        </form>
      </Form>
    </>
  );
};

export default AddSupplierForm;
