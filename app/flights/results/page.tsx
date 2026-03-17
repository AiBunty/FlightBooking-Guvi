import dynamic from "next/dynamic";
const ClientResults = dynamic(() => import("./client-results"), { ssr: false });

export default function FlightResultsPage() {
  return <ClientResults />;
}
