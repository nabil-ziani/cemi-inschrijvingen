import { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/utils/database.types'
import { SVGProps } from "react";

export type TypedSupabaseClient = SupabaseClient<Database>

export type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: number;
};