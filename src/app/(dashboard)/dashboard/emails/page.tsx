// "use client";

// import React, { useMemo, useState } from "react";
// import { useDeleteSupplier } from "@/hooks/apis/useSupplier";
// import { useContextConsumer } from "@/context/Context";
// import { Button } from "@/components/ui/button";
// import { Pencil, Plus, Trash2 } from "lucide-react";
// import DataTable from "@/components/Table/DataTable";
// import { Badge } from "@/components/ui/badge";
// import { Toaster } from "react-hot-toast";
// import { SweetAlert } from "@/components/alerts/SweetAlert";
// import PasswordModal from "@/components/Forms/forms-modal/passwords/AddPassword";
// import { useGetAllPasswords } from "@/hooks/apis/usePasswords";
// import { SkeletonCard } from "@/components/Loaders/SkeletonLoader";
// import { format } from "date-fns";
// import { useGetAllEmails } from "@/hooks/apis/useEmails";

// const Emails = () => {
//   const { token } = useContextConsumer();
//   const [isAddPasswordModalOpen, setIsAddPasswordModalOpen] =
//     useState<boolean>(false);
//   const [isUpdatePasswordModalOpen, setIsUpdatePasswordModalOpen] =
//     useState<boolean>(false);
//   const [selectedPasswordToView, setSelectedPasswordToView] = useState({});

//   const { data, isLoading } = useGetAllEmails(token);
//   // const { mutate: deletePassword, isPending: deletingPassword } =
//   //   useDeletePassword(token);

//   const emails = data?.data || [];

//   console.log(emails, "emails");

//   const handleView = (password: any) => {
//     setIsUpdatePasswordModalOpen(true);
//     setSelectedPasswordToView(password);
//   };

//   // const handleDelete = async (supplierId: any) => {
//   //   const isConfirmed = await SweetAlert(
//   //     "Delete Supplier?",
//   //     "",
//   //     "warning",
//   //     "Yes, delete it!",
//   //     "#15803D"
//   //   );
//   //   if (isConfirmed) {
//   //     deletePassword(supplierId);
//   //   }
//   // };

//   const EmailColoumn = useMemo(
//     () => [
//       {
//         Header: "Password",
//         accessor: "password",
//       },
//       {
//         Header: "Created At",
//         accessor: "createdAt",
//         Cell: ({ row }: any) =>
//           format(new Date(row.original.createdAt), "dd MMM yyyy, hh:mm a"),
//       },
//       {
//         Header: "Updated At",
//         accessor: "updatedAt",
//         Cell: ({ row }: any) =>
//           format(new Date(row.original.updatedAt), "dd MMM yyyy, hh:mm a"),
//       },
//       {
//         Header: "Status",
//         accessor: "active",
//         Cell: ({ row }: any) => (
//           <Badge variant={row.original.active ? "success" : "destructive"}>
//             {row.original.active ? "Active" : "Inactive"}
//           </Badge>
//         ),
//       },
//       {
//         Header: "",
//         accessor: "actions",
//         Cell: ({ row }: any) => (
//           <div className="flex items-center justify-end gap-2.5">
//             <Button
//               size="icon"
//               variant="outline"
//               className="h-7 w-7"
//               onClick={() => handleView(row.original)}
//             >
//               <Pencil className="h-3.5 w-3.5 text-gray-600" />
//             </Button>
//             <Button
//               size="icon"
//               variant="destructive"
//               className="h-7 w-7"
//               // onClick={() => handleDelete(row.original.uuid)}
//             >
//               <Trash2 className="h-3.5 w-3.5" />
//             </Button>
//           </div>
//         ),
//       },
//     ],
//     []
//   );

//   return (
//     <>
//       <Toaster />
//       <div className="space-y-4 p-10 rounded-2xl">
//         <div className="flex items-center justify-between">
//           <h2 className="text-xl font-bold">Available Emails</h2>
//           <Button
//             className="text-xs"
//             size="sm"
//             onClick={() => setIsAddPasswordModalOpen(true)}
//           >
//             Create Password
//             <Plus className="h-4 w-4 ml-1 font-bold" />
//           </Button>
//         </div>
//         {isLoading ? (
//           <SkeletonCard className="w-full h-80" />
//         ) : emails.length <= 0 ? (
//           <p>No Emails Data Available!</p>
//         ) : (
//           <div className="border rounded-2xl">
//             <DataTable
//               columns={EmailColoumn}
//               data={emails}
//               paginate={emails.length > 10}
//             />
//           </div>
//         )}
//       </div>
//       <PasswordModal
//         open={isAddPasswordModalOpen}
//         onOpenChange={setIsAddPasswordModalOpen}
//         mode="add"
//       />
//       <PasswordModal
//         open={isUpdatePasswordModalOpen}
//         onOpenChange={setIsUpdatePasswordModalOpen}
//         password={selectedPasswordToView}
//         mode="view"
//       />
//     </>
//   );
// };

// export default Emails;

"use client";

import React, { useMemo, useState } from "react";
import { useContextConsumer } from "@/context/Context";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2 } from "lucide-react";
import DataTable from "@/components/Table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "react-hot-toast";
import { SkeletonCard } from "@/components/Loaders/SkeletonLoader";
import { format } from "date-fns";
import { useGetAllEmails } from "@/hooks/apis/useEmails";

const Emails = () => {
  const { token } = useContextConsumer();
  const [isAddEmailModalOpen, setIsAddEmailModalOpen] = useState(false);
  const [isUpdateEmailModalOpen, setIsUpdateEmailModalOpen] = useState(false);
  const [selectedEmailToView, setSelectedEmailToView] = useState({});

  const { data, isLoading } = useGetAllEmails(token);
  const emails = data?.data || [];

  const handleView = (email: any) => {
    setIsUpdateEmailModalOpen(true);
    setSelectedEmailToView(email);
  };

  const emailColumns = useMemo(
    () => [
      {
        Header: "Supplier",
        accessor: "user.username",
        Cell: ({ row }: any) => row.original.user?.username || "-",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Password",
        accessor: "password",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }: any) => (
          <Badge
            variant={
              row.original.status === "pending" ? "secondary" : "success"
            }
            className={
              row.original.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }
          >
            {row.original.status}
          </Badge>
        ),
      },
      {
        Header: "Screenshot",
        accessor: "emailScreenshot",
        Cell: ({ row }: any) => (
          <a
            href={row.original.emailScreenshot}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline text-xs"
          >
            View Image
          </a>
        ),
      },
      {
        Header: "Remarks",
        accessor: "remarks",
      },
      {
        Header: "Created At",
        accessor: "createdAt",
        Cell: ({ row }: any) =>
          format(new Date(row.original.createdAt), "dd MMM yyyy, hh:mm a"),
      },
      {
        Header: "Updated At",
        accessor: "updatedAt",
        Cell: ({ row }: any) =>
          format(new Date(row.original.updatedAt), "dd MMM yyyy, hh:mm a"),
      },
      {
        Header: "",
        accessor: "actions",
        Cell: ({ row }: any) => (
          <div className="flex items-center justify-end gap-2.5">
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7"
              onClick={() => handleView(row.original)}
            >
              <Pencil className="h-3.5 w-3.5 text-gray-600" />
            </Button>
            <Button size="icon" variant="destructive" className="h-7 w-7">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <>
      <Toaster />
      <div className="space-y-4 p-10 rounded-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Available Emails</h2>
          <Button
            className="text-xs"
            size="sm"
            onClick={() => setIsAddEmailModalOpen(true)}
          >
            Create Email
            <Plus className="h-4 w-4 ml-1 font-bold" />
          </Button>
        </div>
        {isLoading ? (
          <SkeletonCard className="w-full h-80" />
        ) : emails.length <= 0 ? (
          <p>No Email Data Available!</p>
        ) : (
          <div className="border rounded-2xl">
            <DataTable
              columns={emailColumns}
              data={emails}
              paginate={emails.length > 10}
            />
          </div>
        )}
      </div>
      {/* <EmailModal
        open={isAddEmailModalOpen}
        onOpenChange={setIsAddEmailModalOpen}
        mode="add"
      />
      <EmailModal
        open={isUpdateEmailModalOpen}
        onOpenChange={setIsUpdateEmailModalOpen}
        email={selectedEmailToView}
        mode="view"
      /> */}
    </>
  );
};

export default Emails;
