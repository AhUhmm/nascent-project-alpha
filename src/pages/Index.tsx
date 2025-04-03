
import MainLayout from "@/components/layout/MainLayout";

const Index = () => {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <div className="rounded-lg border shadow-sm p-8 bg-white">
          <h2 className="text-2xl font-bold mb-4">Welcome to Your Project</h2>
          <p className="text-gray-600 mb-6">
            This is a clean starter template for your new application. You can customize
            it to fit your needs and start building your features right away.
          </p>
          <div className="flex justify-center">
            <div className="w-full max-w-md p-8 rounded-lg bg-gray-50 text-center">
              <p className="text-gray-500 text-sm">Content area ready for your project</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
