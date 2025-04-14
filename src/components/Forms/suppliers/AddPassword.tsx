"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Plus, Trash } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import * as z from "zod";
import {
  useCreateNewPassword,
  useUpdatePassword,
} from "@/hooks/apis/usePasswords";
import { addPasswordSchema } from "@/schemas/FormsValidation";

const AddPasswordForm = ({
  mode,
  onClose,
  password,
}: {
  mode: "add" | "view" | "edit";
  onClose: () => void;
  password: any;
}) => {
  const isViewMode = mode === "view";
  const { token } = useContextConsumer();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { mutate: createPassword, isPending: loading } = useCreateNewPassword();
  const { mutate: updatePassword, isPending: updating } =
    useUpdatePassword(token);

  const form = useForm({
    resolver: zodResolver(addPasswordSchema),
    // defaultValues: { passwords: [""] },
    shouldUnregister: true,
  });

  const { reset } = form;

  const { fields, append, remove } = useFieldArray({
    name: "passwords",
    control: form.control,
  });

  useEffect(() => {
    if (password) {
      reset({
        passwords: [password.password],
      });
    }
  }, [password, reset]);

  useEffect(() => {
    if (mode === "add" && fields.length === 0) append("");
  }, [fields, append, mode]);

  const onSubmit = (data: any) => {
    if (mode === "add") {
      const passwords = data.passwords.filter(
        (name: any) => name.trim() !== ""
      );
      createPassword(
        { data: { passwords }, token },
        {
          onSuccess: (log) => {
            if (log?.success) onClose();
          },
        }
      );
    } else if (mode === "edit") {
      const updatedData = {
        // password: password.password,
        passwords: [data.passwords[0]],
      };
      updatePassword(
        { data: updatedData },
        {
          onSuccess: (log) => {
            if (log?.success) {
              onClose();
            }
          },
        }
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col md:flex-row items-center gap-3 mb-4"
          >
            <LabelInputContainer>
              <Label htmlFor={`password_${index}`}>Password</Label>
              <FormField
                control={form.control}
                name={`passwords.${index}`}
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        id={`password_${index}`}
                        className="outline-none focus:border-primary"
                        disabled={isViewMode}
                        {...field}
                      />
                    </FormControl>
                    {!showPassword ? (
                      <Icon
                        name="Eye"
                        size={18}
                        className={cn(
                          "absolute right-3.5 -translate-y-1/2 cursor-pointer text-gray-400",
                          !!form.formState.errors.passwords
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
                          !!form.formState.errors.passwords
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

            {mode === "add" && fields.length > 1 && (
              <Button
                size="icon"
                className="bg-red-500 hover:bg-red-600 text-white mt-5"
                type="button"
                onClick={() => remove(index)}
              >
                <Trash className="w-4 h-4" />
              </Button>
            )}
            {index === fields.length - 1 && mode === "add" && (
              <Button
                size="icon"
                className="bg-primary text-white mt-5"
                type="button"
                onClick={() => append("")}
              >
                <Plus className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}

        <Button
          className="w-full text-white font-medium mt-4"
          type="submit"
          disabled={isViewMode}
        >
          {mode === "add" ? "Create Password(s)" : "Update"}
        </Button>
      </form>
    </Form>
  );
};

export default AddPasswordForm;
