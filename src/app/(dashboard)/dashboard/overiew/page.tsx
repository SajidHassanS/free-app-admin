"use client";
import { Toaster } from "react-hot-toast";

export default function Home() {
  // projects api

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <main className="relative h-[calc(100vh-4rem)] w-full">
        <div className="relative h-full w-full bg-gray-50">
          <h2 className="p-10">Coming Soon....</h2>
          {/* <Map
            projects={showProjects ? projects?.data : []}
            selectedProjectId={selectedProjectId}
            onSeeMoreDetails={handleProjectDetails}
            resetMap={resetMap}
          /> */}
          {/* {!showProjects && !showDetails && (
            <div className="absolute left-3 md:left-auto top-2 md:top-0 md:right-2 h-full md:w-[400px] md:p-4 md:overflow-y-auto z-30 space-y-4 scrollbar-custom">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setshowProjects(false)}
                className="text-primary font-semibold mb-2"
              >
                <Undo2 className="inline" />
              </Button>
              <Projects
                projects={projects?.data || []}
                onSeeMoreDetails={handleProjectDetails}
              />
            </div>
          )}
          {showDetails && (
            <div className="absolute left-3 sm:left-auto top-2 md:top-0 sm:right-2 h-full sm:w-[500px] overflow-hidden md:p-4 z-30 space-y-4">
              <Button variant="outline" size="sm" onClick={resetMap}>
                <X className="inline" />
              </Button>
              <ProjectDetails project={projectDetails?.data} />
            </div>
          )} */}
        </div>
      </main>
    </>
  );
}
