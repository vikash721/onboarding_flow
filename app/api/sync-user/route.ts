import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { upsertUser } from '@/lib/db/user';

export async function POST() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await currentUser();
    if (!user) {
      return new NextResponse('User not found in Clerk', { status: 404 });
    }

    // Map Clerk user to our Zod schema structure
    const userData = {
      clerkId: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
    };

    // Upsert into MongoDB
    await upsertUser(userData);

    return NextResponse.json({ success: true, message: 'User synced successfully' });
  } catch (error) {
    console.error("Error syncing user:", error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
