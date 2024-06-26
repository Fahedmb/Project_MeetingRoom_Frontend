import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableThree from "@/components/Tables/TableThree";
import TableThreeReservation from "@/components/Tables/TableThreeReservation";
import TableThreeUser from "@/components/Tables/TableThreeUser";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Next.js Tables | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        <h1>Rooms</h1>
        <TableThree />
        <h1>Reservations</h1>
        <TableThreeReservation />
        <h1>Users</h1>
        <TableThreeUser />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
