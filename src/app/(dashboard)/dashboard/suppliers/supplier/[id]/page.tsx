"use client";
import React from "react";
import { useContextConsumer } from "@/context/Context";
import { useGetSupplier } from "@/hooks/apis/useSupplier";
import { Toaster } from "react-hot-toast";
import Image from "next/image";
import { baseURL } from "@/api/auth";
import { SkeletonCard } from "@/components/Loaders/SkeletonLoader";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const SupplierDetails = ({ params }: { params: { id: string } }) => {
  const { token } = useContextConsumer();
  const router = useRouter();
  const { data: supplierDetails, isLoading: detailsLoading } = useGetSupplier(
    params.id!,
    token
  );

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
                  {phones.map((p: any, idx: number) => (
                    <li key={idx} className="py-2 text-gray-800">
                      {p.countryCode} {p.phone}
                    </li>
                  ))}
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
