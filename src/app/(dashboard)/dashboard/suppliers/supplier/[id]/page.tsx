"use client";
import React, { useEffect, useState } from "react";
import { useContextConsumer } from "@/context/Context";
import {
  useDeleteSecondaryPhone,
  useGetSupplier,
  useUpdateSecondary,
} from "@/hooks/apis/useSupplier";
import { Toaster } from "react-hot-toast";
import Image from "next/image";
import { baseURL } from "@/api/auth";
import { SkeletonCard } from "@/components/Loaders/SkeletonLoader";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Trash2, Check } from "lucide-react";
import { SweetAlert } from "@/components/alerts/SweetAlert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SupplierDetails = ({ params }: { params: { id: string } }) => {
  const { token } = useContextConsumer();
  const router = useRouter();

  const { data: supplierDetails, isLoading: detailsLoading } = useGetSupplier(
    params.id!,
    token
  );

  const { mutate: updatePhone, isPending: updating } = useUpdateSecondary();
  const { mutate: deleteSecondaryNo, isPending: deleting } =
    useDeleteSecondaryPhone(token);

  const [editStates, setEditStates] = useState<{
    [uuid: string]: { value: string; isEditing: boolean };
  }>({});

  useEffect(() => {
    if (supplierDetails?.data?.phones?.length > 0) {
      const initial: any = {};
      supplierDetails.data.phones.forEach((p: any) => {
        initial[p.uuid] = { value: p.phone, isEditing: false };
      });
      setEditStates(initial);
    }
  }, [supplierDetails]);

  if (!supplierDetails || !supplierDetails.data) {
    return (
      <p className="text-center mt-10 text-red-500">Supplier not found.</p>
    );
  }

  const {
    username,
    phone,
    countryCode,
    phones,
    profileImg,
    userTitle,
    active,
    referCode,
    bonus,
  } = supplierDetails.data;

  const handleDelete = async (id: any) => {
    const isConfirmed = await SweetAlert(
      "Delete Phone?",
      "",
      "warning",
      "Yes, delete it!",
      "#15803D"
    );
    if (isConfirmed) {
      deleteSecondaryNo(id);
    }
  };

  const handleEditToggle = (uuid: string) => {
    setEditStates((prev) => ({
      ...prev,
      [uuid]: { ...prev[uuid], isEditing: true },
    }));
  };

  const handleInputChange = (uuid: string, value: string) => {
    setEditStates((prev) => ({
      ...prev,
      [uuid]: { ...prev[uuid], value },
    }));
  };

  const handleUpdate = (uuid: string, phone: string, countryCode: string) => {
    const updated = editStates[uuid];
    if (!updated || !updated.value || updated.value === phone) return;

    const data = {
      uuid,
      phone: updated.value,
      countryCode,
    };

    updatePhone({ data, token });

    setEditStates((prev) => ({
      ...prev,
      [uuid]: { ...prev[uuid], isEditing: false },
    }));
  };

  return (
    <>
      <Toaster />
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div>
          <button
            onClick={() => router.push("/dashboard/suppliers")}
            className="mb-4 flex items-center text-sm text-primary hover:underline hover:text-primary/80 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Suppliers
          </button>
          <h2 className="text-2xl font-bold text-primary mb-4">
            Supplier Details
          </h2>
        </div>

        {detailsLoading ? (
          <SkeletonCard className="w-full h-40" />
        ) : (
          <>
            <div className="bg-white border border-primary rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
              {profileImg && (
                <Image
                  src={`${baseURL.replace("/api", "")}${profileImg}`}
                  alt="Profile"
                  width={120}
                  height={120}
                  className="rounded-full object-cover border h-28 w-32"
                />
              )}
              <div className="space-y-2 w-full">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {username}
                  </h3>
                  <span
                    className={`text-sm px-3 py-1 rounded-full ${
                      active
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm text-gray-500">User Title: {userTitle}</p>
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700">Primary Phone</h4>
                  <p className="text-gray-900 text-sm">
                    {countryCode} {phone}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="font-medium text-gray-700">Refer Code</h4>
                    <p className="text-gray-900 text-sm">
                      {referCode || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Bonus</h4>
                    <p className="text-gray-900 text-sm">{bonus ?? "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {phones && phones.length > 0 && (
              <div className="bg-white border border-primary rounded-xl p-5">
                <h4 className="text-lg font-semibold mb-3 text-gray-700">
                  Secondary Phones
                </h4>
                <ul className="divide-y divide-gray-200">
                  {phones.map((p: any) => {
                    const state = editStates[p.uuid] || {
                      value: p.phone,
                      isEditing: false,
                    };

                    return (
                      <li
                        key={p.uuid}
                        className="py-3 text-gray-800 flex justify-between items-center"
                      >
                        <div className="flex flex-col w-full">
                          <span className="text-sm text-gray-500">
                            {p.countryCode}
                          </span>
                          {state.isEditing ? (
                            <Input
                              value={state.value}
                              onChange={(e) =>
                                handleInputChange(p.uuid, e.target.value)
                              }
                              className="w-full max-w-xs text-sm"
                            />
                          ) : (
                            <span className="text-sm">{p.phone}</span>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          {state.isEditing ? (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                handleUpdate(p.uuid, p.phone, p.countryCode)
                              }
                              disabled={updating}
                              title="Update"
                            >
                              <Check className="w-4 h-4 text-green-600" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEditToggle(p.uuid)}
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4 text-blue-600" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(p.uuid)}
                            disabled={deleting}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default SupplierDetails;
