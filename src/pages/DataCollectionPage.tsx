import DataCollectionForm from "@/components/data-collection/DataCollectionForm";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "react-router-dom";

const DataCollectionPage = () => {
  const { isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <DataCollectionForm />
      </div>
    </div>
  );
};

export default DataCollectionPage;
