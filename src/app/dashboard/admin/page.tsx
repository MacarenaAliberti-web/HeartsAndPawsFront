// app/dashboard/admin/page.tsx
//import { getSession } from '@auth0/nextjs-auth0';
//import { redirect } from 'next/navigation';
import AdminDashboard from '../../../components/componentsadmin/AdminDashboard';

export default async function AdminPage() {
  //const session = await getSession();
  //const namespace = process.env.AUTH0_BASE_URL;

 // if (!session) {
 //   return redirect('/api/auth/login');
 // }
//
 // const roles = (session.user?.[`${namespace}roles`] as string[]) || [];
//
 // if (!roles.includes('admin')) {
 //   return redirect('/not-authorized');
 // }

  return <AdminDashboard />;
}
