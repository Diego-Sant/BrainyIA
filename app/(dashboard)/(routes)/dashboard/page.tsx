import { UserButton } from "@clerk/nextjs";

const Dashboard = () => {
    return (
      <div>
        <p>Dashboard</p>
        <UserButton afterSignOutUrl="/" />
      </div>
    )
}

export default Dashboard;