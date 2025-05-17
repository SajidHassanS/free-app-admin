"use client";

import { useCallback, useEffect, useState } from "react";
import TabLayout from "@/components/layout/TabLayout";
import { useContextConsumer } from "@/context/Context";
import MarqueeItem from "@/components/marquee/MarqueeItem";
import { SweetAlert } from "@/components/alerts/SweetAlert";
import MarqueeModal from "@/components/Forms/forms-modal/marquee/AddMarquee";
import { DndProvider } from "react-dnd";
import update from "immutability-helper";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  useDeleteMarquee,
  useGetMarqueeList,
  useReorderMarquee,
  useUpdateMarquee,
} from "@/hooks/apis/useMarquee";
import DraggableMarqueeItem from "@/components/marquee/DraggableMarqueeItem";

const ItemType = { MARQUEE: "marquee" };

export default function Maquee() {
  const { token } = useContextConsumer();
  const [marquees, setMarquees] = useState<any[]>([]);
  const [selectedMarqueToView, setSelectedMarqueToView] = useState({});
  const [isEditMarqueeModalOpen, setIsEditMarqueeModalOpen] =
    useState<boolean>(false);

  //
  const { data, isLoading } = useGetMarqueeList(token);
  const { mutate: updateMarquee } = useUpdateMarquee();
  const { mutate: reorderMarquee } = useReorderMarquee();
  const { mutate: deleteMarquee } = useDeleteMarquee(token);

  const handleEdit = (item: any) => {
    setIsEditMarqueeModalOpen(true);
    setSelectedMarqueToView(item);
  };

  const handleDelete = async (uuid: any) => {
    const isConfirmed = await SweetAlert(
      "Delete Marquee?",
      "",
      "warning",
      "Yes, delete it!",
      "#15803D"
    );
    if (isConfirmed) {
      deleteMarquee(uuid);
    }
  };

  const handleToggle = (uuid: string, isEnabled: boolean) => {
    const toggleStatus = isEnabled ? "false" : "true";
    const updatedData = {
      data: {
        uuid,
        isEnabled: toggleStatus,
      },
      token,
    };
    updateMarquee(updatedData);
  };

  useEffect(() => {
    if (data?.data) {
      setMarquees([...data.data].sort((a, b) => a.order - b.order));
    }
  }, [data]);

  const moveMarquee = useCallback((dragIndex: number, hoverIndex: number) => {
    setMarquees((prevMarquees) =>
      update(prevMarquees, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevMarquees[dragIndex]],
        ],
      })
    );
  }, []);

  const handleDrop = () => {
    const reorder = {
      data: {
        uuids: marquees.map((m) => m.uuid),
      },
      token,
    };
    reorderMarquee(reorder);
  };

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <TabLayout>
          <div className="p-6 space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">
              Marquee Messages
            </h2>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              data?.data
                ?.sort((a: any, b: any) => a.order - b.order)
                .map((item: any, index: number) => (
                  <DraggableMarqueeItem
                    key={item.uuid}
                    index={index}
                    id={item.uuid}
                    moveMarquee={moveMarquee}
                    onDrop={handleDrop}
                    message={item.message}
                    isEnabled={item.isEnabled}
                    uuid={item.uuid}
                    order={item.order}
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item.uuid)}
                    onToggle={() => handleToggle(item.uuid, item.isEnabled)}
                  />
                ))
            )}
          </div>
        </TabLayout>
      </DndProvider>
      <MarqueeModal
        open={isEditMarqueeModalOpen}
        onOpenChange={setIsEditMarqueeModalOpen}
        marquee={selectedMarqueToView}
        mode="view"
      />
    </>
  );
}
