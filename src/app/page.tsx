
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { UserButton, SignedIn, SignedOut} from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { LogIn } from 'lucide-react';
import Link from 'next/link';

import React from 'react';

export default async function Home() {
const {userId} = await auth();
const isAuth = !!userId;



  return (
    <div className="h-screen w-screen bg-gradient-to-l from-gray-200 via-fuchsia-200 to-stone-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">Chat with any PDF</h1>
            <UserButton afterSignOutUrl="/" />
          </div>

      <div className="flex mt-2">
        {isAuth && <Button>Go to the chats</Button>}
      </div>

<p className='max-w-l mt-1 text-lg text-slate-600'>
  Join millions of students, researchers and professionals to instantly answer questions and understand research with AI.
</p>

<div className='w-full mt-4'>
{isAuth ? (<FileUpload />):(
  <Link href='/sign-in'>
  <Button>Login to get Started!
<LogIn className='w-4 h-4 ml-2' />

  </Button>
  </Link>
)}
</div>
         
        </div>
      </div>
    </div>
  );
}
