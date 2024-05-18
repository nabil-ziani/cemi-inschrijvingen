import { createClient } from '@/utils/supabase/server'
import { redirect } from "next/navigation";

export default async function StudentsPage() {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    const { data: students } = await supabase.from('students').select()
    console.log(students)

    return <pre>Hey Hey!</pre>
}

// *** Client component example ***
// 'use client'

// import { createClient } from '@/utils/supabase/client'
// import { useEffect, useState } from 'react'

// export default function Page() {
//   const [notes, setNotes] = useState<any[] | null>(null)
//   const supabase = createClient()

//   useEffect(() => {
//     const getData = async () => {
//       const { data } = await supabase.from('notes').select()
//       setNotes(data)
//     }
//     getData()
//   }, [])

//   return <pre>{JSON.stringify(notes, null, 2)}</pre>
// }