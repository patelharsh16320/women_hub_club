import EditUserClient from "./EditUserClient";

export default function UserEditPage({ params }) {
  return <EditUserClient id={params.id} />;
}
