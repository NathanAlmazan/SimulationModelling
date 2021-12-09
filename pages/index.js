import React from 'react';
import { getSession } from 'next-auth/client';

export default function Home({ currUser }) {
  return (
    <div>Home</div>
  )
}

export async function getServerSideProps(ctx) {
  const currSession = await getSession(ctx);
  const ExecutivePosition = ["President", "Vice President", "Manager", "Accountant", "Cashier"];
  const Personnel = ["Warehouse Staff", "Delivery Personnel"];

  if (!currSession) {
    return {
      redirect: {
        permanent: false,
        destination: '/signin'
      }
    }
  }

  if (ExecutivePosition.includes(currSession.position)) {
      return {
          redirect: {
            permanent: false,
            destination: '/dashboard'
          }
        }
  }
  else if (Personnel.includes(currSession.position)) {
    return {
      redirect: {
        permanent: false,
        destination: '/products'
      }
    }
  }
  else if (currSession.position === "Sales Agent") {
    return {
      redirect: {
        permanent: false,
        destination: `/employees/profile/${currSession.userId}`
      }
    }
  }

  return {
      props: { currUser: currSession }
  }
}
